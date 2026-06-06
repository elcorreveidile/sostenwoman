import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminPage() {
  const session = await auth()

  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    redirect('/login')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 border">
          <h3 className="font-semibold mb-2">Productos</h3>
          <p className="text-sm text-stone-600 mb-3">Gestionar catálogo</p>
          <Link href="/dashboard/productos" className="text-sm text-stone-900 font-medium hover:underline">Ver →</Link>
        </div>
        <div className="bg-white rounded-lg p-6 border">
          <h3 className="font-semibold mb-2">Pedidos</h3>
          <p className="text-sm text-stone-600 mb-3">Gestionar pedidos</p>
          <Link href="/dashboard/pedidos" className="text-sm text-stone-900 font-medium hover:underline">Ver →</Link>
        </div>
        <div className="bg-white rounded-lg p-6 border">
          <h3 className="font-semibold mb-2">Inventario</h3>
          <p className="text-sm text-stone-600 mb-3">Ver stock</p>
          <Link href="/dashboard/stock" className="text-sm text-stone-900 font-medium hover:underline">Ver →</Link>
        </div>
      </div>
    </div>
  )
}
