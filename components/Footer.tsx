import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-semibold mb-4">SostenWoman</h3>
            <p className="text-stone-400 text-sm max-w-md">
              Moda sostenible con prendas conscientes y éticas. Cada pieza cuenta una historia de compromiso con el medio ambiente.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Tienda</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <Link href="/tienda" className="hover:text-stone-100 transition-colors">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-stone-100 transition-colors">
                  Nosotros
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <Link href="/aviso-legal" className="hover:text-stone-100 transition-colors">
                  Aviso legal
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="hover:text-stone-100 transition-colors">
                  Privacidad
                </Link>
              </li>
              <li>
                <Link href="/devoluciones" className="hover:text-stone-100 transition-colors">
                  Devoluciones
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 mt-8 pt-8 text-center text-sm text-stone-500 space-y-2">
          <p>&copy; {new Date().getFullYear()} SostenWoman. Todos los derechos reservados.</p>
          <p>
            Desarrollado por{' '}
            <a
              href="https://www.por2duros.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-stone-100 transition-colors"
            >
              Por 2 duros
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
