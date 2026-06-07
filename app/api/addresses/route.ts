import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

type SessionUser = {
  id: string
  email: string
  role?: string
}

export async function GET() {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = (session.user as SessionUser).id

  try {
    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    })

    return NextResponse.json(addresses)
  } catch (error) {
    console.error('Error fetching addresses:', error)
    return NextResponse.json({ error: 'Error fetching addresses' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = (session.user as SessionUser).id

  try {
    const body = await req.json()
    const { name, line1, line2, city, province, postalCode, country, isDefault } = body

    // Si se marca como default, quitar default de las demás
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      })
    }

    const address = await prisma.address.create({
      data: {
        userId,
        name,
        line1,
        line2,
        city,
        province,
        postalCode,
        country: country || 'ES',
        isDefault: isDefault || false,
      },
    })

    return NextResponse.json(address, { status: 201 })
  } catch (error) {
    console.error('Error creating address:', error)
    return NextResponse.json({ error: 'Error creating address' }, { status: 500 })
  }
}
