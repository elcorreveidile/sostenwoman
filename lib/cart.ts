import type { CartItem } from '@/types/cart'

const CART_KEY = 'sostenwoman_cart'

export const cartUtils = {
  getCart: (): CartItem[] => {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem(CART_KEY)
    return stored ? JSON.parse(stored) : []
  },

  saveCart: (items: CartItem[]) => {
    if (typeof window === 'undefined') return
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  },

  addItem: (item: Omit<CartItem, 'maxQuantity'>) => {
    const cart = cartUtils.getCart()
    const existingIndex = cart.findIndex(
      (i) => i.variantId === item.variantId && i.size === item.size && i.color === item.color
    )

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += item.quantity
    } else {
      cart.push({ ...item, maxQuantity: item.quantity })
    }

    cartUtils.saveCart(cart)
  },

  removeItem: (variantId: string, size: string, color: string) => {
    const cart = cartUtils.getCart()
    const filtered = cart.filter(
      (i) => !(i.variantId === variantId && i.size === size && i.color === color)
    )
    cartUtils.saveCart(filtered)
  },

  updateQuantity: (variantId: string, size: string, color: string, quantity: number) => {
    const cart = cartUtils.getCart()
    const item = cart.find(
      (i) => i.variantId === variantId && i.size === size && i.color === color
    )

    if (item) {
      item.quantity = Math.max(1, Math.min(quantity, item.maxQuantity))
      cartUtils.saveCart(cart)
    }
  },

  clearCart: () => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(CART_KEY)
  },

  getTotalItems: () => {
    const cart = cartUtils.getCart()
    return cart.reduce((sum, item) => sum + item.quantity, 0)
  },

  getTotalPrice: () => {
    const cart = cartUtils.getCart()
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  },
}
