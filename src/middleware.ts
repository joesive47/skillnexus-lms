import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/auth'

// SECURITY-ENHANCED middleware with role-based access control
export async function middleware(request: NextRequest) {
  // Skip static files immediately
  const { pathname } = request.nextUrl
  
  if (pathname.startsWith('/_next') || 
      pathname.startsWith('/favicon') ||
      pathname.includes('.')) {
    return NextResponse.next()
  }

  // CRITICAL: Role-based access control for protected routes
  const session = await auth()
  
  // Admin routes - ADMIN only
  if (pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login?error=unauthorized', request.url))
    }
    if (session.user?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard?error=forbidden', request.url))
    }
  }
  
  // Teacher routes - TEACHER or ADMIN only
  if (pathname.startsWith('/teacher')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login?error=unauthorized', request.url))
    }
    if (session.user?.role !== 'TEACHER' && session.user?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard?error=forbidden', request.url))
    }
  }
  
  // Dashboard and protected routes - authenticated users only
  if (pathname.startsWith('/dashboard') || 
      pathname.startsWith('/courses') ||
      pathname.startsWith('/certificates')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login?redirect=' + pathname, request.url))
    }
  }

  // Minimal security headers only
  const response = NextResponse.next()
  
  // Only essential headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Handle CORS for API routes
  if (pathname.startsWith('/api')) {
    const origin = request.headers.get('origin')
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
      'https://www.uppowerskill.com',
      'https://uppowerskill.com'
    ]
    
    // Allow if origin matches or in development
    if (origin && (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development')) {
      response.headers.set('Access-Control-Allow-Origin', origin)
      response.headers.set('Access-Control-Allow-Credentials', 'true')
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token')
    }
    
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 200, headers: response.headers })
    }
  }
  
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
}
