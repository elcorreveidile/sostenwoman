export default function AboutPage() {
  return (
    <div className="min-h-screen bg-stone-900">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-white mb-8">Conócenos</h1>

        <section className="prose prose-invert max-w-none">
          <p className="text-lg text-stone-300 mb-6">
            SostenWoman nació con una convicción: la moda puede ser beautiful y responsable al mismo tiempo.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-12 mb-4">Nuestra Misión</h2>
          <p className="text-stone-300 mb-6">
            Creamos prendas que respetan el medio ambiente y las personas que las fabrican. Cada pieza cuenta una historia de compromiso con materiales sostenibles, procesos éticos y transparencia.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-12 mb-4">Lo que nos define</h2>
          <ul className="list-disc list-inside text-stone-300 space-y-2 mb-8">
            <li>Materiales orgánicos y reciclados</li>
            <li>Producción local en talleres con condiciones justas</li>
            <li>Tintes naturales y procesos eco-amigables</li>
            <li>Transparencia en toda nuestra cadena de suministro</li>
          </ul>

          <h2 className="text-2xl font-semibold text-white mt-12 mb-4">Nuestro compromiso</h2>
          <p className="text-stone-300 mb-6">
            Creemos en el consumo consciente: menos prendas, mejor hechas, diseñadas para durar. Cada elección cuenta, y estamos aquí para demostrar que el estilo y la sostenibilidad no son opuestos — son aliados.
          </p>
        </section>
      </div>
    </div>
  )
}
