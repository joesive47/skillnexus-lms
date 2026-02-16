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
          // Step 2: Database connection check
          authLogger.info('DB_CHECK', 'Checking database connection', {}, email)
          try {
            await prisma.$queryRaw`SELECT 1`
            authLogger.success('DB_CHECK', 'Database connected', {}, email)
          } catch (dbError) {
            authLogger.error('DB_CHECK', 'Database connection failed', { error: String(dbError) }, email)
            return null
          }

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
          
          // DEBUG: Log password comparison details
          console.log('[AUTH DEBUG] Password comparison:')
          console.log('[AUTH DEBUG] Input password length:', password?.length)
          console.log('[AUTH DEBUG] Input password (first 5 chars):', password?.substring(0, 5))
          console.log('[AUTH DEBUG] Stored hash (first 20 chars):', user.password?.substring(0, 20))
          console.log('[AUTH DEBUG] Hash starts with $2a$12$:', user.password?.startsWith('$2a$12$'))
          
          const bcryptStart = Date.now()
          const isPasswordValid = await bcrypt.compare(password, user.password)
          const bcryptTime = Date.now() - bcryptStart
          
          console.log(`[AUTH DEBUG] bcrypt.compare took ${bcryptTime}ms`)
          console.log('[AUTH DEBUG] bcrypt.compare result:', isPasswordValid)

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
      
      // If it's a relative URL, just return it
      if (url.startsWith('/')) {
        authLogger.success('REDIRECT', 'Redirecting to relative path', { url })
        return url
      }
      
      // If url is on the same domain, allow it
      if (url.startsWith(baseUrl)) {
        authLogger.success('REDIRECT', 'Redirecting to same domain', { url })
        return url
      }
      
      // Default to dashboard (client-side will handle role-based redirect)
      authLogger.info('REDIRECT', 'Using default redirect', { defaultUrl: '/dashboard' })
      return '/dashboard'
    },
    async jwt({ token, user, trigger }) {
      if (user) {
        authLogger.info('JWT', 'Creating JWT token', { userId: user.id, role: user.role })
        token.id = user.id
        token.role = user.role
      }
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