import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ProductDetail from '@/components/ProductDetail'

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const product = await prisma.product.findUnique({
    where: { slug, active: true },
    include: {
      variants: {
        orderBy: [{ size: 'asc' }, { color: 'asc' }],
      },
    },
  })

  if (!product) {
    notFound()
  }

  return <ProductDetail product={product} />
}
