export type CartItem = {
  variantId: string
  productId: string
  name: string
  price: number
  size: string
  color: string
  colorHex?: string
  image: string
  quantity: number
  maxQuantity: number
}

export type CartContextType = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'maxQuantity'>) => void
  removeItem: (variantId: string, size: string, color: string) => void
  updateQuantity: (variantId: string, size: string, color: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}
