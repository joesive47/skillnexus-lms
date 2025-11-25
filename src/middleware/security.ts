import { NextRequest, NextResponse } from 'next/server'
import { sanitizeInput } from '@/lib/security'
import { apiLimiter, authLimiter, getRateLimitHeaders } from '@/lib/rate-limiter'
import { handleError } from '@/lib/error-handler'

export function securityMiddleware(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const isAuthRoute = request.nextUrl.pathname.startsWith('/api/auth')
    
    const limiter = isAuthRoute ? authLimiter : apiLimiter
    const rateLimitResult = limiter.check(ip)
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { 
          status: 429,
          headers: getRateLimitHeaders(rateLimitResult)
        }
      )
    }

    // HTTPS enforcement in production
    if (process.env.NODE_ENV === 'production' && request.headers.get('x-forwarded-proto') !== 'https') {
      return NextResponse.redirect(`https://${request.headers.get('host')}${request.nextUrl.pathname}`, 301)
    }
    
    const response = NextResponse.next()
    
    // เพิ่ม rate limit headers
    const rateLimitHeaders = getRateLimitHeaders(rateLimitResult)
    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
  
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // HSTS in production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  }
  
  // CSP header
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.youtube.com https://www.gstatic.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "media-src 'self' https:",
    "connect-src 'self' https://api.stripe.com",
    "frame-src https://js.stripe.com https://www.youtube.com https://youtube.com"
  ].join('; ')
  
  response.headers.set('Content-Security-Policy', csp)
  
  return response
  } catch (error) {
    handleError(error, 'SECURITY_MIDDLEWARE')
    return NextResponse.next()
  }
}

// Input validation middleware
export function validateInput(data: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {}
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value)
    } else {
      sanitized[key] = value
    }
  }
  
  return sanitized
}