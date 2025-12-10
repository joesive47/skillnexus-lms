import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Ultra-lightweight middleware - ไม่มี security overhead
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip ทุกอย่างยกเว้น API rate limiting พื้นฐาน
  if (pathname.startsWith('/_next') || pathname.includes('.')) {
    return NextResponse.next()
  }

  // Rate limiting แบบง่ายๆ เฉพาะ production
  if (process.env.NODE_ENV === 'production' && pathname.startsWith('/api')) {
    // Simple in-memory rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    // TODO: Add simple rate limiting if needed
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
}
