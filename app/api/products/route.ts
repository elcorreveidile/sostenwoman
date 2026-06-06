import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      include: {
        variants: {
          where: { stock: { gt: 0 } },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const filteredProducts = products.filter((p) => p.variants.length > 0)

    return NextResponse.json(filteredProducts)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Error fetching products' }, { status: 500 })
  }
}
