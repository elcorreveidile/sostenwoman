import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()

  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const monthStart = new Date()
    monthStart.setDate(1)
    monthStart.setHours(0, 0, 0, 0)

    const [todaySales, monthSales, pendingOrders, lowStock] = await Promise.all([
      prisma.order.aggregate({
        where: {
          status: { in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
          createdAt: { gte: today },
        },
        _sum: { total: true },
      }),
      prisma.order.aggregate({
        where: {
          status: { in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
          createdAt: { gte: monthStart },
        },
        _sum: { total: true },
      }),
      prisma.order.count({
        where: { status: { in: ['PAID', 'PROCESSING'] } },
      }),
      prisma.variant.count({
        where: { stock: { lt: 5 } },
      }),
    ])

    return NextResponse.json({
      todaySales: todaySales._sum.total || 0,
      monthSales: monthSales._sum.total || 0,
      pendingOrders,
      lowStock,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Error fetching stats' }, { status: 500 })
  }
}
