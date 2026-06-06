import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(req: Request) {
  const session = await auth()

  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const variants = await prisma.variant.findMany({
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            images: true,
          },
        },
      },
      orderBy: [{ stock: 'asc' }, { productId: 'desc' }],
    })

    return NextResponse.json(variants)
  } catch (error) {
    console.error('Error fetching stock:', error)
    return NextResponse.json({ error: 'Error fetching stock' }, { status: 500 })
  }
}
