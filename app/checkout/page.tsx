'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import type { CartItem } from '@/types/cart'

type Address = {
  id: string
  name: string
  line1: string
  line2?: string
  city: string
  province: string
  postalCode: string
  country: string
  isDefault: boolean
}

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const [items, setItems] = useState<CartItem[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/login?redirect=/checkout')
      return
    }

    // Cargar direcciones
    fetch('/api/addresses')
      .then((res) => res.json())
      .then((data) => {
        setAddresses(data)
        const def = data.find((a: Address) => a.isDefault)
        if (def) setSelectedAddress(def.id)
      })
      .catch(console.error)

    // Cargar carrito
    const cartStr = sessionStorage.getItem('checkout_cart')
    if (cartStr) {
      setItems(JSON.parse(cartStr))
    } else {
      const cart = localStorage.getItem('sostenwoman_cart')
      if (cart) setItems(JSON.parse(cart))
    }
  }, [session, status, router])

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 9.99
  const total = subtotal + shipping

  const handleCheckout = async () => {
    if (!selectedAddress) {
      setError('Por favor selecciona una dirección de envío')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
          addressId: selectedAddress,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al crear sesión de pago')
      }

      const data = await res.json()
      const { checkoutUrl } = data

      // Redirigir a Stripe Checkout
      if (checkoutUrl) {
        window.location.href = checkoutUrl
      } else {
        throw new Error('No se recibió la URL de checkout')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading' || (!session && status !== 'unauthenticated')) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-stone-900 mb-8">Finalizar Compra</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Dirección de envío */}
          <div className="bg-white rounded-lg p-6 border border-stone-200">
            <h2 className="text-lg font-semibold text-stone-900 mb-4">Dirección de Envío</h2>

            {addresses.length === 0 ? (
              <p className="text-stone-600 mb-4">No tienes direcciones guardadas</p>
            ) : (
              <div className="space-y-3">
                {addresses.map((address) => (
                  <label
                    key={address.id}
                    className={`block p-4 border-2 rounded-md cursor-pointer transition-colors ${
                      selectedAddress === address.id
                        ? 'border-stone-900 bg-stone-50'
                        : 'border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      value={address.id}
                      checked={selectedAddress === address.id}
                      onChange={(e) => setSelectedAddress(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-start gap-3">
                      <div className="w-4 h-4 mt-1 rounded-full border-2 border-stone-900 flex items-center justify-center">
                        {selectedAddress === address.id && (
                          <div className="w-2 h-2 rounded-full bg-stone-900" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-stone-900">{address.name}</p>
                        <p className="text-sm text-stone-600">
                          {address.line1}
                          {address.line2 && `, ${address.line2}`}
                        </p>
                        <p className="text-sm text-stone-600">
                          {address.postalCode} {address.city}, {address.province}
                        </p>
                        <p className="text-sm text-stone-600">{address.country}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}

            <button
              onClick={() => router.push('/cuenta/direcciones?new=true')}
              className="mt-4 text-sm text-stone-600 hover:text-stone-900"
            >
              + Añadir nueva dirección
            </button>
          </div>

          {/* Resumen de productos */}
          <div className="bg-white rounded-lg p-6 border border-stone-200">
            <h2 className="text-lg font-semibold text-stone-900 mb-4">Productos ({items.length})</h2>

            <div className="space-y-3">
              {items.map((item, idx) => (
                <div key={`${item.variantId}-${idx}`} className="flex gap-3 py-3 border-b border-stone-100 last:border-b-0">
                  <div className="w-16 h-16 relative bg-stone-100 rounded overflow-hidden flex-shrink-0">
                    <img
                      src={item.image || '/placeholder.jpg'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <p className="font-medium text-stone-900">{item.name}</p>
                    <p className="text-sm text-stone-600">
                      {item.size} - {item.color} × {item.quantity}
                    </p>
                    <p className="text-sm font-medium text-stone-900 mt-1">
                      {(item.price * item.quantity).toFixed(2)}€
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resumen de pago */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg p-6 border border-stone-200 sticky top-24">
            <h2 className="text-lg font-semibold text-stone-900 mb-4">Resumen del Pago</h2>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-stone-600">Subtotal</span>
                <span className="font-medium">{subtotal.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-600">Envío</span>
                <span className="font-medium">{shipping.toFixed(2)}€</span>
              </div>
              <div className="border-t border-stone-200 pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-lg">{total.toFixed(2)}€</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isLoading || !selectedAddress}
              className="w-full py-3 bg-stone-900 text-white rounded-md hover:bg-stone-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Procesando...' : 'Pagar con Stripe'}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-stone-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Pago seguro con Stripe
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
