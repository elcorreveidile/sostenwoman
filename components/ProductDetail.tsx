'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, Check } from 'lucide-react'

type Variant = {
  id: string
  size: string
  color: string
  colorHex?: string | null
  stock: number
}

type Product = {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  materials?: string | null
  variants: Variant[]
}

export default function ProductDetail({ product }: { product: Product }) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    product.variants.length > 0 ? product.variants[0] : null
  )
  const [addedToCart, setAddedToCart] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [mainImgFailed, setMainImgFailed] = useState(false)

  const addToCart = () => {
    if (!selectedVariant) return

    const item = {
      variantId: selectedVariant.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      size: selectedVariant.size,
      color: selectedVariant.color,
      colorHex: selectedVariant.colorHex,
      image: product.images[0] ?? '',
      quantity,
    }

    localStorage.setItem('sostenwoman_cart_add', JSON.stringify(item))
    window.dispatchEvent(new CustomEvent('cart-add-item'))

    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const colors = product.variants.reduce((acc: { name: string; hex?: string | null }[], v) => {
    if (!acc.find((c) => c.name === v.color)) {
      acc.push({ name: v.color, hex: v.colorHex })
    }
    return acc
  }, [])

  const sizes = product.variants.reduce((acc: string[], v) => {
    if (!acc.includes(v.size)) acc.push(v.size)
    return acc
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* Galería */}
        <div className="space-y-4">
          <div className="aspect-square bg-stone-100 rounded-lg overflow-hidden flex items-center justify-center relative">
            {product.images[0] && !mainImgFailed ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover"
                onError={() => setMainImgFailed(true)}
              />
            ) : (
              <span className="text-stone-400 text-sm">Sin imagen</span>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.slice(1, 5).map((image, idx) => (
                <div key={idx} className="aspect-square bg-stone-100 rounded-md overflow-hidden">
                  <img
                    src={image}
                    alt={`${product.name} ${idx + 2}`}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detalles */}
        <div>
          <h1 className="text-3xl font-bold text-stone-900 mb-2">{product.name}</h1>
          <p className="text-2xl font-bold text-stone-900 mb-6">{product.price.toFixed(2)}€</p>

          <div className="prose prose-stone mb-6">
            <p>{product.description}</p>
          </div>

          {product.materials && (
            <div className="bg-stone-100 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-stone-900 mb-2">Materiales</h3>
              <p className="text-sm text-stone-600">{product.materials}</p>
            </div>
          )}

          {/* Color */}
          {colors.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-stone-700 mb-2">Color</label>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => {
                      const variant = product.variants.find(
                        (v) => v.color === color.name && v.size === selectedVariant?.size
                      )
                      if (variant && variant.stock > 0) setSelectedVariant(variant)
                    }}
                    className={`px-4 py-2 rounded-md border-2 transition-colors flex items-center gap-2 ${
                      selectedVariant?.color === color.name
                        ? 'border-stone-900 bg-stone-900 text-white'
                        : 'border-stone-300 hover:border-stone-400'
                    }`}
                  >
                    {color.hex && (
                      <span
                        className="inline-block w-4 h-4 rounded-full"
                        style={{ backgroundColor: color.hex }}
                      />
                    )}
                    {color.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Talla */}
          {sizes.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-stone-700 mb-2">Talla</label>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => {
                  const variant = product.variants.find(
                    (v) => v.size === size && v.color === selectedVariant?.color
                  )
                  const inStock = variant && variant.stock > 0
                  return (
                    <button
                      key={size}
                      onClick={() => inStock && setSelectedVariant(variant!)}
                      disabled={!inStock}
                      className={`w-12 h-12 rounded-md border-2 font-medium transition-colors ${
                        selectedVariant?.size === size
                          ? 'border-stone-900 bg-stone-900 text-white'
                          : inStock
                            ? 'border-stone-300 hover:border-stone-400'
                            : 'border-stone-200 bg-stone-100 text-stone-400 cursor-not-allowed'
                      }`}
                    >
                      {size}
                    </button>
                  )
                })}
              </div>

              {selectedVariant && (
                <p className="mt-2 text-sm text-stone-600">
                  {selectedVariant.stock > 0
                    ? `${selectedVariant.stock} unidades disponibles`
                    : 'Agotado'}
                </p>
              )}
            </div>
          )}

          {/* Cantidad */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-stone-700 mb-2">Cantidad</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-md border border-stone-300 hover:bg-stone-100"
              >
                −
              </button>
              <span className="w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(selectedVariant?.stock ?? 1, quantity + 1))}
                className="w-10 h-10 rounded-md border border-stone-300 hover:bg-stone-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Añadir al carrito */}
          {selectedVariant && selectedVariant.stock > 0 ? (
            <button
              onClick={addToCart}
              className={`w-full py-3 rounded-md font-medium transition-colors flex items-center justify-center gap-2 ${
                addedToCart
                  ? 'bg-green-600 text-white'
                  : 'bg-stone-900 text-white hover:bg-stone-800'
              }`}
            >
              {addedToCart ? (
                <><Check className="w-5 h-5" /> Añadido al carrito</>
              ) : (
                <><ShoppingCart className="w-5 h-5" /> Añadir al carrito</>
              )}
            </button>
          ) : (
            <button disabled className="w-full py-3 rounded-md font-medium bg-stone-200 text-stone-500 cursor-not-allowed">
              Agotado
            </button>
          )}

          <div className="mt-6 text-sm text-stone-600">
            <Link href="/tienda" className="hover:text-stone-900">← Volver a la tienda</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
