'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, User } from 'lucide-react'
import { cartUtils } from '@/lib/cart'
import { useEffect, useState } from 'react'

export function Nav() {
  const pathname = usePathname()
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const updateCart = () => setCartCount(cartUtils.getTotalItems())
    updateCart()
    window.addEventListener('storage', updateCart)
    return () => window.removeEventListener('storage', updateCart)
  }, [])

  return (
    <nav className="bg-white border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-semibold text-stone-900">
            SostenWoman
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/tienda"
              className={`text-sm font-medium transition-colors hover:text-stone-600 ${
                pathname === '/tienda' ? 'text-stone-900' : 'text-stone-500'
              }`}
            >
              Tienda
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium transition-colors hover:text-stone-600 ${
                pathname === '/about' ? 'text-stone-900' : 'text-stone-500'
              }`}
            >
              Nosotros
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/cart"
              className="relative p-2 text-stone-600 hover:text-stone-900 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-stone-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link href="/login" className="p-2 text-stone-600 hover:text-stone-900 transition-colors">
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
