import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ULTRA-MINIMAL middleware - <2kB target
export function middleware(request: NextRequest) {
  // Skip static files immediately
  const { pathname } = request.nextUrl
  
  if (pathname.startsWith('/_next') || 
      pathname.startsWith('/favicon') ||
      pathname.includes('.')) {
    return NextResponse.next()
  }

  // Minimal security headers only
  const response = NextResponse.next()
  
  // Only essential headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Fix CORS - Use environment variable with fallback to production domain
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['https://www.uppowerskill.com']
  const origin = request.headers.get('origin')
  
  // Always allow same-origin and production domain
  if (origin && (allowedOrigins.includes(origin) || origin === 'https://www.uppowerskill.com')) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Credentials', 'true')
  }
  
  response.headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token')
  
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
}
