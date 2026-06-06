const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function test() {
  try {
    console.log('Connecting to database...')
    const products = await prisma.product.findMany({
      include: { variants: true }
    })
    console.log(`✅ Connected! Found ${products.length} products`)
    console.log('Products:', products.map(p => p.name))
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

test()
