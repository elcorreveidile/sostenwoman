import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import { auth } from '@/lib/auth'
import { config } from '@/lib/config'

type SessionUser = {
  id: string
  email: string
  role?: string
}

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as SessionUser).id

    const { items, addressId } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 })
    }

    // Obtener el usuario con direcciones
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { addresses: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Obtener dirección
    const address = user.addresses.find((a) => a.id === addressId) || user.addresses.find((a) => a.isDefault)

    if (!address) {
      return NextResponse.json({ error: 'No address found' }, { status: 400 })
    }

    // Verificar stock y calcular total
    let subtotal = 0
    const lineItems = []

    for (const item of items) {
      const variant = await prisma.variant.findUnique({
        where: { id: item.variantId },
        include: { product: true },
      })

      if (!variant) {
        return NextResponse.json({ error: 'Variant not found' }, { status: 404 })
      }

      if (variant.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${variant.product.name}` },
          { status: 400 }
        )
      }

      subtotal += variant.product.price * item.quantity

      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: variant.product.name,
            description: `${variant.size} - ${variant.color}`,
            images: variant.product.images,
          },
          unit_amount: Math.round(variant.product.price * 100),
        },
        quantity: item.quantity,
      })
    }

    // Añadir coste de envío
    const shippingCost = config.shipping.cost
    const total = subtotal + shippingCost

    // Crear orden en estado PENDING
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        shippingAddress: address,
        shippingMethod: config.shipping.method,
        shippingCost,
        subtotal,
        total,
        status: 'PENDING',
        items: {
          create: items.map((item: any) => ({
            variantId: item.variantId,
            quantity: item.quantity,
            unitPrice: 0, // Se actualizará después
          })),
        },
      },
      include: { items: true },
    })

    // Actualizar precios unitarios
    await Promise.all(
      order.items.map(async (orderItem) => {
        const variant = await prisma.variant.findUnique({
          where: { id: orderItem.variantId },
          include: { product: true },
        })
        if (variant) {
          await prisma.orderItem.update({
            where: { id: orderItem.id },
            data: { unitPrice: variant.product.price },
          })
        }
      })
    )

    // Añadir línea de envío a Stripe
    lineItems.push({
      price_data: {
        currency: 'eur',
        product_data: {
          name: 'Envío',
          description: 'Envío estándar península',
        },
        unit_amount: Math.round(shippingCost * 100),
      },
      quantity: 1,
    })

    // Crear Checkout Session de Stripe
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${config.appUrl}/pedidos/${order.id}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.appUrl}/carrito`,
      metadata: {
        orderId: order.id,
        userId: user.id,
      },
      expires_at: Math.floor(Date.now() / 1000) + 1800, // 30 minutos
    })

    // Guardar stripeSessionId en la orden
    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: stripeSession.id },
    })

    return NextResponse.json({ sessionId: stripeSession.id, orderId: order.id })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json({ error: 'Error creating checkout session' }, { status: 500 })
  }
}
