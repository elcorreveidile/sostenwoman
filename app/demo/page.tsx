export default function DemoPage() {
  const products = [
    { id: '1', name: 'Producto 1', price: 10 },
    { id: '2', name: 'Producto 2', price: 20 },
  ]

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Demo Server-Side</h1>
      <ul>
        {products.map((p) => (
          <li key={p.id}>{p.name} - {p.price}€</li>
        ))}
      </ul>
    </div>
  )
}
