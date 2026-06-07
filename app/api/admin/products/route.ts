import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const productSchema = z.object({
  name: z.string().min(1, 'Nombre requerido'),
  slug: z.string().min(1, 'Slug requerido').regex(/^[a-z0-9-]+$/, 'Slug inválido'),
  description: z.string().min(1, 'Descripción requerida'),
  price: z.number().positive('Precio debe ser positivo'),
  images: z.array(z.string()).min(1, 'Al menos una imagen'),
  materials: z.string().optional(),
  variants: z.array(
    z.object({
      size: z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL']),
      color: z.string(),
      colorHex: z.string().optional(),
      stock: z.number().int().min(0),
      sku: z.string().optional(),
    })
  ),
})

export async function GET(req: Request) {
  const session = await auth()

  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const products = await prisma.product.findMany({
      include: {
        _count: { select: { variants: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Error fetching products' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await auth()

  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const data = productSchema.parse(body)

    // Verificar slug único
    const existing = await prisma.product.findUnique({
      where: { slug: data.slug },
    })

    if (existing) {
      return NextResponse.json({ error: 'Slug ya existe' }, { status: 400 })
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        images: data.images,
        materials: data.materials,
        variants: {
          create: data.variants,
        },
      },
      include: { variants: true },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Error creating product' }, { status: 500 })
  }
}
