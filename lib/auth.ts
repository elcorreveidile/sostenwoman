import NextAuth from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import { prisma } from './prisma'
import { resend, emailFrom } from './resend'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      role?: string
    }
  }
  interface User {
    id: string
    email: string
    role?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    email: string
    role?: string
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    EmailProvider({
      from: emailFrom,
      sendVerificationRequest: async ({ identifier, url }) => {
        if (resend) {
          await resend.emails.send({
            from: emailFrom,
            to: identifier,
            subject: 'Tu acceso a SostenWoman',
            html: `
              <p>Haz clic en el siguiente enlace para acceder a tu cuenta:</p>
              <p><a href="${url}" style="background:#1c1917;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block">Acceder a SostenWoman</a></p>
              <p style="color:#888;font-size:12px">Si no solicitaste este acceso, ignora este email.</p>
            `,
          })
        } else {
          // Sin RESEND_API_KEY: imprime el enlace en la terminal para desarrollo local
          console.log(`\n🔗  MAGIC LINK (modo desarrollo)\n    Email: ${identifier}\n    URL:   ${url}\n`)
        }
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`
      if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
    async signIn({ user, email }) {
      const userEmail = user.email
      if (userEmail) {
        const existing = await prisma.user.findUnique({
          where: { email: userEmail },
        })

        if (!existing) {
          await prisma.user.create({
            data: {
              email: userEmail,
              role: 'CLIENT',
            },
          })
          return '/completar-perfil'
        }

        if (existing.role === 'ADMIN') return '/dashboard'
        return '/tienda'
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.email = token.email
        session.user.role = token.role
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

