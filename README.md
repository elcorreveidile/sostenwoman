# SostenWoman

Tienda online de moda sostenible con Next.js 15, Prisma, Stripe y Vercel.

## Stack Tecnológico

- **Framework**: Next.js 15 (App Router)
- **Base de datos**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Auth**: NextAuth v5 (Credentials)
- **Pagos**: Stripe Checkout
- **Imágenes**: Cloudinary
- **Email**: Resend
- **CSS**: Tailwind CSS
- **Deploy**: Vercel

## Configuración Inicial

### 1. Variables de Entorno

Crea un archivo `.env` con las siguientes variables:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/sostenwoman?schema=public"

# Auth
AUTH_SECRET="your-secret-key-here"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."

# Email (Resend)
RESEND_API_KEY="re_..."
EMAIL_FROM="SostenWoman <noreply@sostenwoman.com>"
ADMIN_EMAIL="admin@sostenwoman.com"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 2. Setup de Base de Datos

```bash
# Push del schema a la BD
npm run db:push

# Seed de datos de prueba
npm run db:seed
```

### 3. Instalación y Desarrollo

```bash
# Instalar dependencias
npm install

# Generar cliente Prisma
npx prisma generate

# Iniciar servidor de desarrollo
npm run dev
```

## Cuentas de Prueba

Tras ejecutar el seed, tendrás estas cuentas:

- **Admin**: admin@sostenwoman.com / admin123
- **Cliente**: cliente@test.com / cliente123

## Comandos Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run db:push      # Push schema a BD
npm run db:seed      # Seed de datos
npm run db:studio    # Prisma Studio
```

## Estructura del Proyecto

```
├── app/
│   ├── api/              # API Routes
│   │   ├── auth/         # NextAuth
│   │   ├── products/     # Productos públicos
│   │   ├── checkout/     # Stripe Checkout
│   │   ├── webhooks/     # Stripe Webhook
│   │   ├── admin/        # Panel admin
│   │   └── orders/       # Pedidos
│   ├── admin/            # Panel admin UI
│   ├── checkout/         # Checkout
│   ├── login/            # Login/Registro
│   ├── pedidos/          # Confirmación pedido
│   ├── tienda/           # Tienda
│   └── carrito/          # Carrito
├── components/           # Componentes React
├── lib/                  # Utilidades (Prisma, Stripe, etc)
├── prisma/
│   └── seed.ts          # Seed script
└── types/               # Tipos TypeScript
```

## Funcionalidades Implementadas

### Tienda Pública
- ✅ Catálogo de productos con filtros
- ✅ Ficha de producto con variantes
- ✅ Carrito persistente (localStorage)
- ✅ Checkout con Stripe
- ✅ Confirmación de pedido

### Usuarios
- ✅ Registro con email + contraseña
- ✅ Login
- ✅ Panel de cliente (básico)

### Admin
- ✅ Dashboard con métricas
- ✅ Gestión de productos
- ✅ Gestión de pedidos
- ✅ Gestión de stock

### Pagos
- ✅ Stripe Checkout
- ✅ Webhook para gestión de stock
- ✅ Decremento automático de stock

### Envíos
- ✅ Precio fijo: 9.99€

## Próximos Pasos (Fase 2)

- [ ] Devoluciones (solicitud + aprobación + reembolso)
- [ ] Emails transaccionales completos
- [ ] Tracking visible para cliente
- [ ] Generador de descripciones con IA
- [ ] Filtros avanzados en catálogo
- [ ] Gestión de direcciones del cliente

## Deploy en Vercel

1. Conectar repo a Vercel
2. Configurar variables de entorno
3. Configurar webhook de Stripe:
   - URL: `https://tu-dominio.com/api/webhooks/stripe`
   - Eventos: `checkout.session.completed`, `checkout.session.expired`
4. Deploy automático desde `main`

## Licencia

Educativo / Demo
