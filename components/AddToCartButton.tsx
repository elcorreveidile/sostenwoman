'use client'

export default function AddToCartButton({
  variantId,
  productId,
  name,
  price,
  size,
  color,
  image,
}: {
  variantId: string
  productId: string
  name: string
  price: number
  size: string
  color: string
  image: string
}) {
  const addToCart = () => {
    const item = {
      variantId,
      productId,
      name,
      price,
      size,
      color,
      image,
      quantity: 1,
    }
    localStorage.setItem('sostenwoman_cart_add', JSON.stringify(item))
    window.dispatchEvent(new Event('storage'))
    alert('Añadido al carrito')
  }

  return (
    <button
      onClick={addToCart}
      className="w-full mt-2 bg-stone-900 text-white py-2 rounded hover:bg-stone-800"
    >
      Añadir al carrito
    </button>
  )
}
