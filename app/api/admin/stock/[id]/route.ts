import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const updateSchema = z.object({
  stock: z.number().int().min(0),
})

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()

  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const data = updateSchema.parse(body)

    const variant = await prisma.variant.update({
      where: { id: params.id },
      data: { stock: data.stock },
    })

    return NextResponse.json(variant)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error('Error updating stock:', error)
    return NextResponse.json({ error: 'Error updating stock' }, { status: 500 })
  }
}
