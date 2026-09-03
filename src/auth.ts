import { createHash } from 'crypto'
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import prisma from '@/lib/prisma'
import { safeUserFind } from '@/lib/prisma-safe'
import { handleError } from '@/lib/error-handler'
import bcrypt from "bcryptjs"
import { UserRole } from "@/lib/types"
import { authLogger } from '@/lib/auth-logger'

// Database connection happens automatically on first query
// Removed eager connection to prevent build-time hangs

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const email = credentials?.email as string
        const password = credentials?.password as string

        // Step 1: Validate credentials
        if (!email || !password) {
          authLogger.error('VALIDATION', 'Missing email or password', { 
            hasEmail: !!email, 
            hasPassword: !!password 
          })
          return null
        }

        authLogger.info('START', 'Login attempt started', {}, email)

        try {
          // Step 3: Find user
          authLogger.info('USER_QUERY', 'Querying user from database', {}, email)
          const userQueryStart = Date.now()
          
          const user = await safeUserFind(email)
          
          const userQueryTime = Date.now() - userQueryStart
          console.log(`[AUTH] User query took ${userQueryTime}ms`)

          if (!user) {
            authLogger.error('USER_QUERY', 'User not found in database', {}, email)
            return null
          }

          authLogger.success('USER_QUERY', 'User found', { 
            userId: user.id, 
            role: user.role,
            queryTime: userQueryTime 
          }, email)

          // Step 4: Verify password
          authLogger.info('PASSWORD_CHECK', 'Verifying password', {}, email)
const bcryptStart = Date.now()
          const isPasswordValid = await bcrypt.compare(password, user.password)
          const bcryptTime = Date.now() - bcryptStart
          
          console.log(`[AUTH DEBUG] bcrypt.compare took ${bcryptTime}ms`)

          if (!isPasswordValid) {
            authLogger.error('PASSWORD_CHECK', 'Invalid password', {}, email)
            return null
          }

          authLogger.success('PASSWORD_CHECK', 'Password verified', {}, email)
          
          // Step 5: Create session data
          authLogger.success('AUTH_SUCCESS', 'Authentication successful', { 
            userId: user.id, 
            role: user.role 
          }, email)

          console.log(authLogger.createLoginSummary(email))

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role as UserRole,
          }
        } catch (error) {
          authLogger.error('AUTH_ERROR', 'Unexpected error during authentication', { 
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined
          }, email)
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
    error: "/login",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      authLogger.info('REDIRECT', 'Redirect callback triggered', { url, baseUrl })
      
      // Auth.js client constructs URL from this value, so always return absolute.
      if (url.startsWith('/') && !url.startsWith('//')) {
        const destination = new URL(url, baseUrl).toString()
        authLogger.success('REDIRECT', 'Redirecting to relative path', { url: destination })
        return destination
      }
      
      // If url is on the same domain, allow it
      if (new URL(url, baseUrl).origin === new URL(baseUrl).origin) {
        authLogger.success('REDIRECT', 'Redirecting to same domain', { url })
        return url
      }
      
      // Default to dashboard (client-side will handle role-based redirect)
      const destination = new URL('/dashboard', baseUrl).toString()
      authLogger.info('REDIRECT', 'Using default redirect', { defaultUrl: destination })
      return destination
    },
    async jwt({ token, user }) {
      // เมื่อ login ใหม่ (user object มา) — set token จาก user
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        // เก็บ passwordVersion เพื่อ invalidate token เมื่อ password เปลี่ยน
        try {
          const current = await prisma.user.findUnique({ where: { id: user.id as string }, select: { password: true } })
          if (current?.password) {
            token.passwordVersion = createHash('sha256').update(current.password).digest('hex')
          }
        } catch { /* ถ้า DB error ให้ login ผ่านไปก่อน */ }
        return token
      }

      // Session refresh — ตรวจสอบแค่ว่า user ยังมีอยู่ใน DB ทุก 5 นาที
      const now = Math.floor(Date.now() / 1000)
      const lastCheck = (token.lastDbCheck as number) || 0
      if (now - lastCheck < 300) return token // ยังไม่ถึง 5 นาที ใช้ cache

      try {
        const current = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { id: true, role: true, password: true }
        })
        if (!current) return null
        const passwordVersion = createHash('sha256').update(current.password).digest('hex')
        if (token.passwordVersion && token.passwordVersion !== passwordVersion) return null
        token.role = current.role
        token.passwordVersion = passwordVersion
        token.lastDbCheck = now
      } catch { /* DB error — ใช้ token เดิม */ }

      return token
    },
    async session({ session, token }) {
      if (token) {
        authLogger.info('SESSION', 'Creating session', { userId: token.id, role: token.role })
        session.user.id = token.id as string
        session.user.role = token.role as UserRole
      }
      return session
    },
  },
  debug: process.env.NODE_ENV === 'development',
  trustHost: true,
  experimental: {
    enableWebAuthn: false,
  },
})
