import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import { auth } from '@/lib/auth'

type SessionUser = {
  id: string
  email: string
  role?: string
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('session_id')

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = (session.user as SessionUser).id
  const { id } = await params

  try {
    const order = await prisma.order.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    let verified = false

    if (sessionId) {
      try {
        const stripeSession = await stripe.checkout.sessions.retrieve(sessionId)
        verified =
          stripeSession.payment_status === 'paid' &&
          stripeSession.metadata.orderId === order.id
      } catch (err) {
        console.error('Error verifying Stripe session:', err)
      }
    }

    return NextResponse.json({ order, verified })
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json({ error: 'Error fetching order' }, { status: 500 })
  }
}
