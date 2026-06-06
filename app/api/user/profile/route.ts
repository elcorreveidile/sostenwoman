import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const data = await req.json()

    // Actualizar usuario
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      },
    })

    // Crear dirección
    await prisma.address.create({
      data: {
        userId: user.id,
        name: `${data.firstName} ${data.lastName}`,
        line1: data.addressLine1,
        line2: data.addressLine2 || null,
        city: data.city,
        province: data.province,
        postalCode: data.postalCode,
        country: 'ES',
        isDefault: true,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Error al actualizar perfil' }, { status: 500 })
  }
}

