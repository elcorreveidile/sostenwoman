'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { CartItem } from '@/types/cart'

const CartContext = createContext<CartItem[]>([])

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    loadCart()

    // Escuchar cambios en localStorage (incluyendo eventos personalizados)
    const handleStorageChange = (e: StorageEvent | Event) => {
      if ('key' in e && e.key === 'sostenwoman_cart_add') {
        handleAddItem()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('cart-add-item', handleAddItem)
    window.addEventListener('cart-update', loadCart)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('cart-add-item', handleAddItem)
      window.removeEventListener('cart-update', loadCart)
    }
  }, [])

  const handleAddItem = () => {
    const itemStr = localStorage.getItem('sostenwoman_cart_add')
    if (!itemStr) return

    const newItem = JSON.parse(itemStr) as Omit<CartItem, 'maxQuantity'>
    const cart = loadCartFromStorage()

    const existingIndex = cart.findIndex(
      (i) => i.variantId === newItem.variantId && i.size === newItem.size && i.color === newItem.color
    )

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += newItem.quantity
    } else {
      cart.push({ ...newItem, maxQuantity: newItem.quantity })
    }

    localStorage.setItem('sostenwoman_cart', JSON.stringify(cart))
    setItems(cart)
    localStorage.removeItem('sostenwoman_cart_add')
    window.dispatchEvent(new Event('cart-update'))
  }

  const loadCartFromStorage = (): CartItem[] => {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem('sostenwoman_cart')
    return stored ? JSON.parse(stored) : []
  }

  const loadCart = () => {
    const cart = loadCartFromStorage()
    setItems(cart)
  }

  return (
    <CartContext.Provider value={items}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
