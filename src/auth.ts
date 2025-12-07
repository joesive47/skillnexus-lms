import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import prisma from '@/lib/prisma'
import { safeUserFind } from '@/lib/prisma-safe'
import { handleError } from '@/lib/error-handler'
import bcrypt from "bcryptjs"
import { UserRole } from "@/lib/types"

// Test database connection
if (process.env.NODE_ENV === 'development') {
  prisma.$connect().then(() => {
    console.log('[AUTH] Database connected successfully')
  }).catch((error) => {
    console.error('[AUTH] Database connection failed:', error)
  })
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("[AUTH] Missing credentials")
          return null
        }

        try {
          console.log("[AUTH] Attempting to find user:", credentials.email)
          const user = await safeUserFind(credentials.email as string)

          if (!user) {
            console.log("[AUTH] User not found")
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          )

          if (!isPasswordValid) {
            console.log("[AUTH] Invalid password")
            return null
          }
          
          console.log("[AUTH] Login successful for:", user.email)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role as UserRole,
          }
        } catch (error) {
          handleError(error, 'AUTH_LOGIN')
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  pages: {
    signIn: "/login",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      console.log('[AUTH] Redirect - url:', url, 'baseUrl:', baseUrl)
      
      // Always use localhost for development
      const localUrl = 'http://localhost:3000'
      
      // If url is relative, prepend localhost
      if (url.startsWith('/')) {
        return `${localUrl}${url}`
      }
      
      // If url is localhost, allow it
      if (url.startsWith(localUrl)) {
        return url
      }
      
      // Default to dashboard
      return `${localUrl}/dashboard`
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as UserRole
      }
      return session
    },
  },
  debug: process.env.NODE_ENV === 'development',
  trustHost: true,
})