import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-stone-100 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-stone-900 mb-6">
            Moda que Cuida el Planeta
          </h1>
          <p className="text-lg md:text-xl text-stone-600 mb-8 max-w-2xl mx-auto">
            Prendas sostenibles fabricadas con materiales conscientes y procesos éticos.
            Cada compra apoyo un futuro más verde.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/tienda"
              className="inline-flex items-center justify-center px-8 py-3 bg-stone-900 text-white rounded-full hover:bg-stone-800 transition-colors font-medium"
            >
              Explorar Colección
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-stone-900 border border-stone-300 rounded-full hover:bg-stone-50 transition-colors font-medium"
            >
              Conócenos
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-semibold text-stone-900 mb-2">Materiales Sostenibles</h3>
              <p className="text-stone-600 text-sm">
                Algodón orgánico, lino reciclado y tintes naturales en cada prenda.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-stone-900 mb-2">Producción Ética</h3>
              <p className="text-stone-600 text-sm">
                Fabricado en talleres locales con condiciones de trabajo justas.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                </svg>
              </div>
              <h3 className="font-semibold text-stone-900 mb-2">Envío Consciente</h3>
              <p className="text-stone-600 text-sm">
                Packaging reciclable y logística optimizada para reducir huella de carbono.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Únete al Cambio
          </h2>
          <p className="text-stone-300 mb-8 max-w-2xl mx-auto">
            Descubre nuestra colección de moda sostenible y haz una elección consciente hoy.
          </p>
          <Link
            href="/tienda"
            className="inline-flex items-center justify-center px-8 py-3 bg-white text-stone-900 rounded-full hover:bg-stone-100 transition-colors font-medium"
          >
            Ver Tienda
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
