import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import AddToCartButton from '@/components/AddToCartButton'
import ProductImage from '@/components/ProductImage'

async function getProducts() {
  const products = await prisma.product.findMany({
    where: { active: true },
    include: {
      variants: {
        where: { stock: { gt: 0 } },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return products.filter((p) => p.variants.length > 0)
}

export default async function TiendaPage() {
  const products = await getProducts()

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Tienda</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4">
            <Link href={`/tienda/${product.slug}`}>
              <div className="aspect-square bg-stone-100 rounded mb-4 overflow-hidden">
                <ProductImage src={product.images[0]} alt={product.name} />
              </div>
            </Link>
            <Link href={`/tienda/${product.slug}`}>
              <h3 className="font-semibold hover:underline">{product.name}</h3>
            </Link>
            <p className="text-lg font-bold">{product.price.toFixed(2)}€</p>
            {product.variants.length > 0 && (
              <AddToCartButton
                variantId={product.variants[0].id}
                productId={product.id}
                name={product.name}
                price={product.price}
                size={product.variants[0].size}
                color={product.variants[0].color}
                image={product.images[0]}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
