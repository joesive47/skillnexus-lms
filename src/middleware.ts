import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { matchesPrefix, removedApiPrefixes, unavailableApiPrefixes, unavailablePagePrefixes } from '@/lib/feature-availability'
import { apiLimiter, authLimiter, getRateLimitHeaders } from '@/lib/rate-limiter'

function applySecurityHeaders(response: NextResponse) {
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '0')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  const scripts = process.env.NODE_ENV === 'production'
    ? "script-src 'self' 'unsafe-inline' https://js.stripe.com https://www.youtube.com https://www.gstatic.com"
    : "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.youtube.com https://www.gstatic.com"
  response.headers.set('Content-Security-Policy', [
    "default-src 'self'",
    scripts,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "media-src 'self' https: blob:",
    "connect-src 'self' https://api.stripe.com https://*.sentry.io",
    "frame-src 'self' https://js.stripe.com https://www.youtube.com https://youtube.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'"
  ].join('; '))

  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  }
  return response
}

function requestIp(request: NextRequest) {
  // Forwarded addresses are attacker-controlled unless the deployment explicitly
  // confirms that its reverse proxy overwrites these headers.
  if (process.env.TRUST_PROXY !== 'true') return 'untrusted-proxy'
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') || 'unknown'
}

function isAllowedCorsOrigin(origin: string, configuredOrigins: string[]) {
  if (configuredOrigins.includes(origin)) return true
  if (process.env.NODE_ENV !== 'development') return false
  try {
    const url = new URL(origin)
    return url.protocol === 'http:' && ['localhost', '127.0.0.1', '::1'].includes(url.hostname)
  } catch {
    return false
  }
}

// SECURITY-ENHANCED middleware with security headers
// Note: Role-based access control handled by client-side redirects and page-level auth checks
// to avoid Edge Runtime limitations with NextAuth
export function middleware(request: NextRequest) {
  // Skip static files immediately
  const { pathname } = request.nextUrl
  const forwardedProto = request.headers.get('x-forwarded-proto')
  const isLoopback = ['localhost', '127.0.0.1', '::1'].includes(request.nextUrl.hostname)
  if (process.env.NODE_ENV === 'production' && !isLoopback && forwardedProto && forwardedProto !== 'https') {
    const secureUrl = request.nextUrl.clone()
    secureUrl.protocol = 'https:'
    return applySecurityHeaders(NextResponse.redirect(secureUrl, 308))
  }

  if (matchesPrefix(pathname, removedApiPrefixes)) return applySecurityHeaders(NextResponse.json({ error: 'Not found' }, { status: 404 }))
  if (matchesPrefix(pathname, unavailableApiPrefixes)) return applySecurityHeaders(NextResponse.json({ error: 'Feature temporarily unavailable pending implementation and security verification' }, { status: 503 }))
  if (matchesPrefix(pathname, unavailablePagePrefixes)) return applySecurityHeaders(NextResponse.redirect(new URL('/feature-unavailable', request.url)))
  
  if (pathname.startsWith('/_next') || 
      pathname.startsWith('/favicon') ||
      pathname.includes('.')) {
    return NextResponse.next()
  }

  // Handle CORS for API routes
  if (pathname.startsWith('/api')) {
    // SessionProvider, CSRF bootstrap and callback redirects can generate several
    // /api/auth requests for one login. Count only the credential submission as
    // an authentication attempt so normal session polling cannot lock users out.
    const isAuthAttempt = request.method === 'POST' && pathname === '/api/auth/callback/credentials'
    const ip = requestIp(request)
    const rateLimitResult = (isAuthAttempt ? authLimiter : apiLimiter).check(`${isAuthAttempt ? 'auth' : 'api'}:${ip}`)
    if (!rateLimitResult.success) {
      return applySecurityHeaders(NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: getRateLimitHeaders(rateLimitResult) }
      ))
    }

    const response = NextResponse.next()
    for (const [key, value] of Object.entries(getRateLimitHeaders(rateLimitResult))) response.headers.set(key, value)
    const origin = request.headers.get('origin')
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',').map(value => value.trim()).filter(Boolean) || [
      'https://www.uppowerskill.com',
      'https://uppowerskill.com'
    ]
    
    if (origin && isAllowedCorsOrigin(origin, allowedOrigins)) {
      response.headers.set('Access-Control-Allow-Origin', origin)
      response.headers.set('Access-Control-Allow-Credentials', 'true')
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token')
    }
    
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      if (origin && !isAllowedCorsOrigin(origin, allowedOrigins)) {
        return applySecurityHeaders(NextResponse.json({ error: 'Origin not allowed' }, { status: 403 }))
      }
      return applySecurityHeaders(new NextResponse(null, { status: 200, headers: response.headers }))
    }

    return applySecurityHeaders(response)
  }

  return applySecurityHeaders(NextResponse.next())
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
}
