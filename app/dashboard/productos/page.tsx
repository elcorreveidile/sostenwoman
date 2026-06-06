'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'

type Product = {
  id: string
  slug: string
  name: string
  price: number
  active: boolean
  images: string[]
  _count: { variants: number }
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products')
      const data = await res.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleActive = async (id: string, active: boolean) => {
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !active }),
      })

      if (res.ok) {
        fetchProducts()
      }
    } catch (error) {
      console.error('Error toggling product:', error)
    }
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('¿Seguro que quieres archivar este producto?')) return

    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })

      if (res.ok) {
        fetchProducts()
      }
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-12">Cargando...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-stone-900">Productos</h1>
        <Link
          href="/admin/productos/nuevo"
          className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-md hover:bg-stone-800"
        >
          <Plus className="w-4 h-4" />
          Nuevo Producto
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase">Producto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase">Precio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase">Variantes</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-stone-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-stone-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-stone-100 rounded overflow-hidden">
                      <img
                        src={product.images[0] || '/placeholder.jpg'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-stone-900">{product.name}</p>
                      <p className="text-sm text-stone-500">{product.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-stone-900">{product.price.toFixed(2)}€</td>
                <td className="px-6 py-4 text-sm text-stone-600">{product._count.variants}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleActive(product.id, product.active)}
                    className="text-stone-600 hover:text-stone-900"
                  >
                    {product.active ? (
                      <ToggleRight className="w-5 h-5 text-green-600" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-stone-400" />
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/productos/${product.id}`}
                      className="p-2 text-stone-600 hover:text-stone-900"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="p-2 text-stone-600 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="p-8 text-center text-stone-500">No hay productos</div>
        )}
      </table>
    </div>
  </div>
)
}
