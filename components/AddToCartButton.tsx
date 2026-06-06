'use client'

import { useState } from 'react'

export default function AddToCartButton({
  variantId,
  productId,
  name,
  price,
  size,
  color,
  image,
}: {
  variantId: string
  productId: string
  name: string
  price: number
  size: string
  color: string
  image: string
}) {
  const [added, setAdded] = useState(false)

  const addToCart = () => {
    const item = {
      variantId,
      productId,
      name,
      price,
      size,
      color,
      image,
      quantity: 1,
    }
    localStorage.setItem('sostenwoman_cart_add', JSON.stringify(item))
    window.dispatchEvent(new CustomEvent('cart-add-item'))
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <button
      onClick={addToCart}
      className={`w-full mt-2 py-2 rounded transition-colors ${
        added
          ? 'bg-green-600 text-white'
          : 'bg-stone-900 text-white hover:bg-stone-800'
      }`}
    >
      {added ? '✓ Añadido' : 'Añadir al carrito'}
    </button>
  )
}
