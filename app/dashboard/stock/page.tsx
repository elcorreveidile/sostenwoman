'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

type Variant = {
  id: string
  size: string
  color: string
  colorHex?: string
  stock: number
  sku?: string
  product: {
    id: string
    name: string
    slug: string
    images: string[]
  }
}

export default function AdminStockPage() {
  const [variants, setVariants] = useState<Variant[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'low'>('all')

  useEffect(() => {
    fetchStock()
  }, [])

  const fetchStock = async () => {
    try {
      const res = await fetch('/api/admin/stock')
      const data = await res.json()
      setVariants(data)
    } catch (error) {
      console.error('Error fetching stock:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStock = async (id: string, stock: number) => {
    try {
      await fetch(`/api/admin/stock/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock }),
      })
      fetchStock()
    } catch (error) {
      console.error('Error updating stock:', error)
    }
  }

  const filteredVariants = filter === 'low' ? variants.filter((v) => v.stock < 5) : variants

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-12">Cargando...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-stone-900">Inventario</h1>

        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700'}`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('low')}
            className={`px-4 py-2 rounded-md flex items-center gap-2 ${filter === 'low' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700'}`}
          >
            <AlertTriangle className="w-4 h-4" />
            Stock Bajo ({variants.filter((v) => v.stock < 5).length})
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase">Producto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase">Variante</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase">Stock</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-stone-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {filteredVariants.map((variant) => (
              <tr key={variant.id} className={variant.stock < 5 ? 'bg-red-50' : ''}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-stone-100 rounded overflow-hidden">
                      <img
                        src={variant.product.images[0] || '/placeholder.jpg'}
                        alt={variant.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <Link
                        href={`/admin/productos/${variant.product.id}`}
                        className="font-medium text-stone-900 hover:text-stone-600"
                      >
                        {variant.product.name}
                      </Link>
                      <p className="text-sm text-stone-500">{variant.product.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {variant.colorHex && (
                      <span
                        className="w-4 h-4 rounded-full border border-stone-300"
                        style={{ backgroundColor: variant.colorHex }}
                      />
                    )}
                    <span className="text-sm text-stone-900">
                      {variant.size} - {variant.color}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-stone-600">{variant.sku || '-'}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateStock(variant.id, Math.max(0, variant.stock - 1))}
                      className="w-8 h-8 rounded border border-stone-300 hover:bg-stone-100"
                    >
                      -
                    </button>
                    <span className={`w-12 text-center font-medium ${variant.stock < 5 ? 'text-red-600' : 'text-stone-900'}`}>
                      {variant.stock}
                    </span>
                    <button
                      onClick={() => updateStock(variant.id, variant.stock + 1)}
                      className="w-8 h-8 rounded border border-stone-300 hover:bg-stone-100"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/admin/productos/${variant.product.id}`}
                    className="text-sm text-stone-600 hover:text-stone-900"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredVariants.length === 0 && (
          <div className="p-8 text-center text-stone-500">No hay variantes</div>
        )}
      </table>
    </div>
  </div>
)
}
