export default function AdminPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 border">
          <h3 className="font-semibold mb-2">Productos</h3>
          <p className="text-sm text-stone-600">Gestionar catálogo</p>
          <a href="/admin/productos" className="text-sm text-blue-600">Ver →</a>
        </div>
        <div className="bg-white rounded-lg p-6 border">
          <h3 className="font-semibold mb-2">Pedidos</h3>
          <p className="text-sm text-stone-600">Gestionar pedidos</p>
          <a href="/admin/pedidos" className="text-sm text-blue-600">Ver →</a>
        </div>
        <div className="bg-white rounded-lg p-6 border">
          <h3 className="font-semibold mb-2">Inventario</h3>
          <p className="text-sm text-stone-600">Ver stock</p>
          <a href="/admin/stock" className="text-sm text-blue-600">Ver →</a>
        </div>
      </div>
    </div>
  )
}
