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
  
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
}
