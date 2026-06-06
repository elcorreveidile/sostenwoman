import NextAuth from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import { prisma } from './prisma'
import { RedirectType } from 'next/navigation'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    EmailProvider({
      server: process.env.RESEND_API_KEY ? {
        host: 'smtp.resend.com',
        port: 587,
        auth: {
          user: 'resend',
          pass: process.env.RESEND_API_KEY,
        },
      } : '',
      from: process.env.EMAIL_FROM || 'noreply@sostenwoman.com',
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Si viene de una página específica, ir allí
      if (url.startsWith('/')) return `${baseUrl}${url}`
      if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
    async signIn({ user, email }) {
      if (email) {
        const existing = await prisma.user.findUnique({
          where: { email: email },
        })

        if (!existing) {
          // Usuario no existe - necesita completar perfil
          // Creamos un registro temporal con el email
          await prisma.user.create({
            data: {
              email,
              role: 'CLIENT',
            },
          })

          // Redirigir a completar perfil
          return '/completar-perfil'
        }

        // Usuario existe - redirigir según rol
        if (existing.role === 'ADMIN') {
          return '/dashboard'
        }
        return '/tienda'
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id
        (session.user as any).email = token.email
        (session.user as any).role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
})
