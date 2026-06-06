'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Eye } from 'lucide-react'

type Order = {
  id: string
  status: string
  total: number
  createdAt: string
  user: {
    name?: string
    email: string
  }
  shippingAddress: any
  trackingNumber?: string
}

const statusColors = {
  PENDING: 'bg-gray-100 text-gray-700',
  PAID: 'bg-green-100 text-green-700',
  PROCESSING: 'bg-blue-100 text-blue-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-red-100 text-red-700',
  REFUNDED: 'bg-amber-100 text-amber-700',
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders')
      const data = await res.json()
      setOrders(data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      fetchOrders()
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-12">Cargando...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-stone-900 mb-8">Pedidos</h1>

      <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase">Pedido</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase">Fecha</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-stone-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-stone-50">
                <td className="px-6 py-4 text-sm font-medium text-stone-900">#{order.id.slice(0, 8)}</td>
                <td className="px-6 py-4">
                  <p className="text-sm text-stone-900">{order.user.name || 'Cliente'}</p>
                  <p className="text-xs text-stone-500">{order.user.email}</p>
                </td>
                <td className="px-6 py-4 text-sm text-stone-900">{order.total.toFixed(2)}€</td>
                <td className="px-6 py-4">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className={`px-2 py-1 rounded text-xs font-medium ${statusColors[order.status as keyof typeof statusColors]}`}
                  >
                    <option value="PENDING">Pendiente</option>
                    <option value="PAID">Pagado</option>
                    <option value="PROCESSING">Procesando</option>
                    <option value="SHIPPED">Enviado</option>
                    <option value="DELIVERED">Entregado</option>
                    <option value="CANCELLED">Cancelado</option>
                    <option value="REFUNDED">Reembolsado</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-sm text-stone-600">
                  {new Date(order.createdAt).toLocaleDateString('es-ES')}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/admin/pedidos/${order.id}`}
                    className="p-2 text-stone-600 hover:text-stone-900"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="p-8 text-center text-stone-500">No hay pedidos</div>
        )}
      </table>
    </div>
  </div>
)
}
