export const config = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  shipping: {
    cost: 9.99,
    method: 'fixed',
  },
  return: {
    charge: 3.95,
    maxDays: 30, // días máximos para solicitar devolución
  },
  stock: {
    lowStockThreshold: 5,
  },
}
