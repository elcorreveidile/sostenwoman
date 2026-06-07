import 'dotenv/config'
import { prisma } from '../lib/prisma'
import { Size } from '@prisma/client'

type VariantData = {
  size: Size
  color: string
  colorHex: string
  stock: number
  sku: string
}

async function main() {
  console.log('🌱 Starting seed...')

  // Limpiar datos existentes
  await prisma.return.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.variant.deleteMany()
  await prisma.product.deleteMany()
  await prisma.address.deleteMany()
  await prisma.user.deleteMany()

  // Crear admin user
  const admin = await prisma.user.create({
    data: {
      email: 'benitezl@go.ugr.es',
      firstName: 'Javier',
      lastName: 'Benítez Láinez',
      phone: '+34 600 000 000',
      role: 'ADMIN',
    },
  })
  console.log('✅ Admin user created')

  // Crear cliente de prueba
  const client = await prisma.user.create({
    data: {
      email: 'info@poedronomo.com',
      firstName: 'Pedro',
      lastName: 'Odrónomo',
      phone: '+34 600 000 001',
      role: 'CLIENT',
    },
  })
  console.log('✅ Client user created')

  // Crear productos
  const products = [
    {
      name: 'Vestido Lino Ecológico',
      slug: 'vestido-lino-ecologico',
      description: 'Vestido de lino orgánico certificado GOTS. Tejido transpirable perfecto para verano. Corte fluido y elegante con detalles artesanales.',
      price: 89.99,
      images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800'],
      materials: '100% lino orgánico certificado GOTS. Teñido con tintes naturales',
      variants: [
        { size: 'S', color: 'blanco', colorHex: '#FFFFFF', stock: 15, sku: 'VL-001-S-BL' },
        { size: 'M', color: 'blanco', colorHex: '#FFFFFF', stock: 12, sku: 'VL-001-M-BL' },
        { size: 'L', color: 'blanco', colorHex: '#FFFFFF', stock: 8, sku: 'VL-001-L-BL' },
        { size: 'S', color: 'arena', colorHex: '#D4C4A8', stock: 10, sku: 'VL-001-S-AR' },
        { size: 'M', color: 'arena', colorHex: '#D4C4A8', stock: 15, sku: 'VL-001-M-AR' },
        { size: 'L', color: 'arena', colorHex: '#D4C4A8', stock: 6, sku: 'VL-001-L-AR' },
      ],
    },
    {
      name: 'Camiseta Algodón Reciclado',
      slug: 'camiseta-algodon-reciclado',
      description: 'Camiseta básica confeccionada con algodón 100% reciclado. Diseño atemporal que dura temporada tras temporada. Producida éticamente en Portugal.',
      price: 39.99,
      images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'],
      materials: '100% algodón reciclado post-consumo. Producción local en Portugal',
      variants: [
        { size: 'XS', color: 'negro', colorHex: '#1a1a1a', stock: 20, sku: 'CA-002-XS-N' },
        { size: 'S', color: 'negro', colorHex: '#1a1a1a', stock: 18, sku: 'CA-002-S-N' },
        { size: 'M', color: 'negro', colorHex: '#1a1a1a', stock: 15, sku: 'CA-002-M-N' },
        { size: 'L', color: 'negro', colorHex: '#1a1a1a', stock: 12, sku: 'CA-002-L-N' },
        { size: 'S', color: 'verde musgo', colorHex: '#4A5D23', stock: 8, sku: 'CA-002-S-VM' },
        { size: 'M', color: 'verde musgo', colorHex: '#4A5D23', stock: 10, sku: 'CA-002-M-VM' },
      ],
    },
    {
      name: 'Pantalón Chino Sostenible',
      slug: 'pantalon-chino-sostenible',
      description: 'Pantalón chino corte slim fit fabricado con algodón orgánico. Comodidad y estilo con el mínimo impacto ambiental. Cintura elástica forrada.',
      price: 69.99,
      images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800'],
      materials: '98% algodón orgánico, 2% elastano. Cultivo sin pesticidas ni químicos',
      variants: [
        { size: 'S', color: 'beige', colorHex: '#C4B484', stock: 12, sku: 'PC-003-S-BG' },
        { size: 'M', color: 'beige', colorHex: '#C4B484', stock: 15, sku: 'PC-003-M-BG' },
        { size: 'L', color: 'beige', colorHex: '#C4B484', stock: 10, sku: 'PC-003-L-BG' },
        { size: 'S', color: 'verde oliva', colorHex: '#556B2F', stock: 7, sku: 'PC-003-S-VO' },
        { size: 'M', color: 'verde oliva', colorHex: '#556B2F', stock: 9, sku: 'PC-003-M-VO' },
      ],
    },
    {
      name: 'Blusa Seda Vegetal',
      slug: 'blusa-seda-vegetal',
      description: 'Blusa elegante confeccionada con seda de calote vegetal. Textura sedosa natural con brillo sutil. Perfecta para ocasiones especiales.',
      price: 119.99,
      images: ['https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800'],
      materials: '100% fibra de calote ecológico. Alternativa vegana a la seda tradicional',
      variants: [
        { size: 'S', color: 'dorado', colorHex: '#D4A55A', stock: 5, sku: 'BS-004-S-D' },
        { size: 'M', color: 'dorado', colorHex: '#D4A55A', stock: 8, sku: 'BS-004-M-D' },
        { size: 'S', color: 'rosa palo', colorHex: '#E8C4B8', stock: 6, sku: 'BS-004-S-RP' },
        { size: 'M', color: 'rosa palo', colorHex: '#E8C4B8', stock: 4, sku: 'BS-004-M-RP' },
      ],
    },
    {
      name: 'Sudadera Felpa Reciclada',
      slug: 'sudadera-felpa-reciclada',
      description: 'Sudadera oversize de felpa confeccionada con botellas PET recicladas. Interior suave y cálido. Estampado serigráfico con tintes ecológicos.',
      price: 59.99,
      images: ['https://images.unsplash.com/photo-1556821842-6a79a51aa80a?w=800'],
      materials: '60% poliéster reciclado, 40% algodón orgánico. 20 botellas recicladas por prenda',
      variants: [
        { size: 'S', color: 'gris claro', colorHex: '#9CA3AF', stock: 14, sku: 'SF-005-S-GC' },
        { size: 'M', color: 'gris claro', colorHex: '#9CA3AF', stock: 16, sku: 'SF-005-M-GC' },
        { size: 'L', color: 'gris claro', colorHex: '#9CA3AF', stock: 13, sku: 'SF-005-L-GC' },
        { size: 'XL', color: 'gris claro', colorHex: '#9CA3AF', stock: 9, sku: 'SF-005-XL-GC' },
        { size: 'S', color: 'azul marino', colorHex: '#1E3A5F', stock: 11, sku: 'SF-005-S-AM' },
        { size: 'M', color: 'azul marino', colorHex: '#1E3A5F', stock: 12, sku: 'SF-005-M-AM' },
      ],
    },
    {
      name: 'Falda Midi A Línea',
      slug: 'falda-midi-a-linea',
      description: 'Falda midi corte A línea en tejido de lyocell. Caída fluida y elegante. Bolsillos ocultos y cierre invisible lateral.',
      price: 79.99,
      images: ['https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800'],
      materials: '100% lyocell de madera FSC certificado. Proceso de闭环 producción',
      variants: [
        { size: 'S', color: 'negro', colorHex: '#1a1a1a', stock: 9, sku: 'FM-006-S-N' },
        { size: 'M', color: 'negro', colorHex: '#1a1a1a', stock: 11, sku: 'FM-006-M-N' },
        { size: 'L', color: 'negro', colorHex: '#1a1a1a', stock: 7, sku: 'FM-006-L-N' },
        { size: 'S', color: 'burdeos', colorHex: '#722F37', stock: 8, sku: 'FM-006-S-B' },
        { size: 'M', color: 'burdeos', colorHex: '#722F37', stock: 10, sku: 'FM-006-M-B' },
      ],
    },
    {
      name: 'Jersey Cuello V Lana Merino',
      slug: 'jersey-cuello-v-lana-merino',
      description: 'Jersey clásico de lana merino extrafina. Temperatura reguladora natural. Transpirable y antibacteriano. Ideal para otoño-invierno.',
      price: 129.99,
      images: ['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800'],
      materials: '100% lana merino extrafina. Esquilado ético de ovejas de pastoreo libre',
      variants: [
        { size: 'S', color: 'gris', colorHex: '#6B7280', stock: 6, sku: 'JM-007-S-G' },
        { size: 'M', color: 'gris', colorHex: '#6B7280', stock: 8, sku: 'JM-007-M-G' },
        { size: 'L', color: 'gris', colorHex: '#6B7280', stock: 5, sku: 'JM-007-L-G' },
        { size: 'S', color: 'azul cielo', colorHex: '#87CEEB', stock: 4, sku: 'JM-007-S-AC' },
        { size: 'M', color: 'azul cielo', colorHex: '#87CEEB', stock: 7, sku: 'JM-007-M-AC' },
      ],
    },
    {
      name: 'Top Lino Básico',
      slug: 'top-lino-basico',
      description: 'Top básico de lino orgánico con escote cuadrado. Versátil y fresco. Lleva solo o debajo de blazers y cardigans.',
      price: 34.99,
      images: ['https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=800'],
      materials: '100% lino orgánico. Lavado en piedra para textura suave',
      variants: [
        { size: 'XS', color: 'blanco', colorHex: '#FFFFFF', stock: 18, sku: 'TL-008-XS-BL' },
        { size: 'S', color: 'blanco', colorHex: '#FFFFFF', stock: 22, sku: 'TL-008-S-BL' },
        { size: 'M', color: 'blanco', colorHex: '#FFFFFF', stock: 19, sku: 'TL-008-M-BL' },
        { size: 'S', color: 'negro', colorHex: '#1a1a1a', stock: 15, sku: 'TL-008-S-N' },
        { size: 'M', color: 'negro', colorHex: '#1a1a1a', stock: 17, sku: 'TL-008-M-N' },
      ],
    },
  ]

  for (const productData of products) {
    const { variants, ...product } = productData
    const created = await prisma.product.create({
      data: {
        ...product,
        variants: {
          create: variants as VariantData[],
        },
      },
      include: { variants: true },
    })
    console.log(`✅ Product created: ${created.name} (${created.variants.length} variants)`)
  }

  // Crear dirección para el cliente
  await prisma.address.create({
    data: {
      userId: client.id,
      name: 'Pedro Odrónomo',
      line1: 'Calle Ejemplo 123',
      line2: 'Piso 1',
      city: 'Madrid',
      province: 'Madrid',
      postalCode: '28013',
      country: 'ES',
      isDefault: true,
    },
  })
  console.log('✅ Address created')

  console.log('🎉 Seed completed!')
  console.log('\n📝 Test accounts (Magic Link - sin contraseña):')
  console.log('   Admin: benitezl@go.ugr.es')
  console.log('   Client: info@poedronomo.com')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
