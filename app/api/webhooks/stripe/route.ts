import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { resend, emailFrom } from '@/lib/resend'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')!

  let event: any

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object

        if (session.payment_status === 'paid') {
          // Obtener la orden
          const order = await prisma.order.findUnique({
            where: { stripeSessionId: session.id },
            include: { items: { include: { variant: true } }, user: true },
          })

          if (!order) {
            console.error('Order not found for session:', session.id)
            return NextResponse.json({ error: 'Order not found' }, { status: 404 })
          }

          // Actualizar estado de la orden a PAID
          await prisma.order.update({
            where: { id: order.id },
            data: { status: 'PAID' },
          })

          // Decrementar stock de cada variante
          for (const item of order.items) {
            await prisma.variant.update({
              where: { id: item.variantId },
              data: { stock: { decrement: item.quantity } },
            })
          }

          // Enviar email de confirmación
          if (resend && order.user.email) {
            await resend.emails.send({
              from: emailFrom,
              to: order.user.email,
              subject: 'Confirmación de pedido - SostenWoman',
              html: `
                <h1>Tu pedido ha sido confirmado</h1>
                <p>Hola ${order.user.name || [order.user.firstName, order.user.lastName].filter(Boolean).join(' ') || 'Cliente'},</p>
                <p>Tu pedido #${order.id} ha sido recibido y está siendo procesado.</p>
                <p><strong>Total:</strong> ${order.total.toFixed(2)}€</p>
                <p>Te notificaremos cuando tu pedido sea enviado.</p>
                <p>Gracias por tu compra sostenible.</p>
              `,
            })
          }

          console.log('Order paid and stock updated:', order.id)
        }
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object

        // Marcar orden como CANCELLED si expiró
        const order = await prisma.order.findUnique({
          where: { stripeSessionId: session.id },
        })

        if (order && order.status === 'PENDING') {
          await prisma.order.update({
            where: { id: order.id },
            data: { status: 'CANCELLED' },
          })
          console.log('Order expired:', order.id)
        }
        break
      }

      default:
        console.log('Unhandled event type:', event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error handling webhook:', error)
    return NextResponse.json({ error: 'Error handling webhook' }, { status: 500 })
  }
}
