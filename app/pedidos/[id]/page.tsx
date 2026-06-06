'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Check, Package } from 'lucide-react'

type Order = {
  id: string
  status: string
  shippingAddress: any
  shippingCost: number
  subtotal: number
  total: number
  createdAt: string
  items: Array<{
    id: string
    quantity: number
    unitPrice: number
    variant: {
      size: string
      color: string
      product: {
        name: string
        images: string[]
      }
    }
  }>
}

export default function OrderConfirmationPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    if (!params.id || !sessionId) return

    fetch(`/api/orders/${params.id}?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        setOrder(data.order)
        setVerified(data.verified)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [params.id, sessionId])

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center">Verificando pedido...</div>
      </div>
    )
  }

  if (!verified || !order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center text-red-600">Error al verificar el pedido</div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg p-8 border border-stone-200">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-stone-900 mb-2">¡Pedido Confirmado!</h1>
          <p className="text-stone-600">Gracias por tu compra</p>
        </div>

        <div className="bg-stone-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-stone-600">Número de pedido</p>
          <p className="text-xl font-bold text-stone-900">#{order.id}</p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <h2 className="font-semibold text-stone-900 mb-2">Dirección de envío</h2>
            <p className="text-sm text-stone-600">
              {order.shippingAddress.line1}
              {order.shippingAddress.line2 && `, ${order.shippingAddress.line2}`}
            </p>
            <p className="text-sm text-stone-600">
              {order.shippingAddress.postalCode} {order.shippingAddress.city}, {order.shippingAddress.province}
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-stone-900 mb-2">Productos</h2>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.variant.product.name} ({item.variant.size} - {item.variant.color}) × {item.quantity}
                  </span>
                  <span className="font-medium">{(item.unitPrice * item.quantity).toFixed(2)}€</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-stone-200 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{order.subtotal.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Envío</span>
              <span>{order.shippingCost.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{order.total.toFixed(2)}€</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
          <div className="flex gap-3">
            <Package className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-1">¿Cuándo recibiré mi pedido?</p>
              <p>
                Recibirás un email de confirmación y te notificaremos cuando tu pedido sea enviado.
                El envío estándar tarda 2-5 días laborables.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <Link
            href="/cuenta/pedidos"
            className="inline-block px-6 py-3 bg-stone-900 text-white rounded-md hover:bg-stone-800 transition-colors"
          >
            Ver mis pedidos
          </Link>
          <div>
            <Link href="/tienda" className="text-sm text-stone-600 hover:text-stone-900">
              ← Volver a la tienda
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
