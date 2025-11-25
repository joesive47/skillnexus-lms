import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { UserRole } from "@/lib/types"
import { rateLimit } from "@/lib/rate-limit"
import { securityMiddleware } from "@/middleware/security"

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const userRole = req.auth?.user?.role as UserRole
  
  // Skip processing for static assets, API routes, and login page
  if (nextUrl.pathname.startsWith('/_next') || 
      nextUrl.pathname.startsWith('/.well-known') ||
      nextUrl.pathname.includes('.') ||
      nextUrl.pathname === '/favicon.ico' ||
      nextUrl.pathname === '/login') {
    return NextResponse.next()
  }

  // Rate limiting for API routes only
  if (nextUrl.pathname.startsWith('/api/')) {
    try {
      const rateLimitResult = rateLimit(req, 100, 15 * 60 * 1000)
      if (!rateLimitResult.success) {
        return new NextResponse('Too Many Requests', { status: 429 })
      }
    } catch (error) {
      console.error('Rate limit error:', error)
    }
    return NextResponse.next()
  }

  const isProtectedRoute = nextUrl.pathname.startsWith('/dashboard') || nextUrl.pathname.startsWith('/courses')
  const isDebugRoute = nextUrl.pathname.startsWith('/debug')

  // Allow homepage and debug routes
  if (nextUrl.pathname === '/' || (isDebugRoute && process.env.NODE_ENV === 'development')) {
    return NextResponse.next()
  }

  // Redirect to login if accessing protected route without authentication
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', nextUrl))
  }

  // Simple RBAC for admin routes
  if (nextUrl.pathname.startsWith('/dashboard/admin') && userRole !== UserRole.ADMIN) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|\\.well-known|manifest.json|sw.js).*)'
  ],
}