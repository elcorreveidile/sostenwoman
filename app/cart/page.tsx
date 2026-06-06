'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { cartUtils } from '@/lib/cart'
import type { CartItem } from '@/types/cart'

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setItems(cartUtils.getCart())
    const update = () => setItems(cartUtils.getCart())
    window.addEventListener('cart-update', update)
    window.addEventListener('storage', update)
    return () => {
      window.removeEventListener('cart-update', update)
      window.removeEventListener('storage', update)
    }
  }, [])

  const removeItem = (variantId: string, size: string, color: string) => {
    cartUtils.removeItem(variantId, size, color)
    setItems(cartUtils.getCart())
    window.dispatchEvent(new Event('cart-update'))
  }

  const updateQty = (variantId: string, size: string, color: string, qty: number) => {
    if (qty < 1) return
    cartUtils.updateQuantity(variantId, size, color, qty)
    setItems(cartUtils.getCart())
    window.dispatchEvent(new Event('cart-update'))
  }

  if (!mounted) return null

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Tu carrito está vacío</h1>
        <Link href="/tienda" className="text-stone-900 underline hover:text-stone-600">
          Ir a la tienda
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-8">Tu carrito</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={`${item.variantId}-${item.size}-${item.color}`}
            className="flex gap-4 border border-stone-200 rounded-lg p-4"
          >
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-md bg-stone-100"
              />
            ) : (
              <div className="w-20 h-20 bg-stone-100 rounded-md flex items-center justify-center text-stone-400 text-xs">
                Sin imagen
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-stone-900">{item.name}</p>
              <p className="text-sm text-stone-500 mt-0.5">
                {item.color} · {item.size}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => updateQty(item.variantId, item.size, item.color, item.quantity - 1)}
                  className="w-8 h-8 border border-stone-300 rounded hover:bg-stone-100 flex items-center justify-center"
                >
                  −
                </button>
                <span className="w-6 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQty(item.variantId, item.size, item.color, item.quantity + 1)}
                  className="w-8 h-8 border border-stone-300 rounded hover:bg-stone-100 flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            <div className="text-right flex flex-col justify-between">
              <p className="font-bold text-stone-900">
                {(item.price * item.quantity).toFixed(2)}€
              </p>
              <button
                onClick={() => removeItem(item.variantId, item.size, item.color)}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t border-stone-200 pt-6">
        <div className="flex justify-between text-lg font-bold mb-6">
          <span>Total</span>
          <span>{total.toFixed(2)}€</span>
        </div>
        <Link
          href="/checkout"
          className="block w-full text-center bg-stone-900 text-white py-3 rounded-md hover:bg-stone-800 transition-colors font-medium"
        >
          Ir al pago
        </Link>
        <Link
          href="/tienda"
          className="block w-full text-center text-stone-600 hover:text-stone-900 py-3 text-sm mt-2"
        >
          ← Seguir comprando
        </Link>
      </div>
    </div>
  )
}
