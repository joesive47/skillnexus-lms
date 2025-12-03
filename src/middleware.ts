import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { RateLimiter } from './lib/security/rate-limiter'
import { AuditLogger } from './lib/security/audit-logger'

const rateLimiter = new RateLimiter(100, 60000) // 100 requests per minute

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files
  if (pathname.startsWith('/_next') || pathname.startsWith('/static')) {
    return NextResponse.next()
  }

  // Rate limiting for API routes
  if (pathname.startsWith('/api')) {
    const identifier = rateLimiter.getIdentifier(request)
    const result = await rateLimiter.check(identifier)

    if (!result.success) {
      AuditLogger.log({
        action: 'RATE_LIMIT_EXCEEDED',
        resource: pathname,
        ip: identifier,
        userAgent: request.headers.get('user-agent') || 'unknown',
        status: 'suspicious'
      })

      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '100',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': result.resetTime.toString()
          }
        }
      )
    }

    const response = NextResponse.next()
    response.headers.set('X-RateLimit-Limit', '100')
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
    response.headers.set('X-RateLimit-Reset', result.resetTime.toString())
    return response
  }

  // Block access to test/debug endpoints in production
  if (process.env.NODE_ENV === 'production') {
    const blockedPaths = [
      '/test',
      '/api/test-users',
      '/api/chatbot/test',
      '/dashboard/admin/bard-certificates/test'
    ]
    
    if (blockedPaths.some(path => pathname.startsWith(path))) {
      AuditLogger.log({
        action: 'BLOCKED_TEST_ENDPOINT',
        resource: pathname,
        ip: rateLimiter.getIdentifier(request),
        userAgent: request.headers.get('user-agent') || 'unknown',
        status: 'suspicious'
      })
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
