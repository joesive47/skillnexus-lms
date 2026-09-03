import { NextRequest } from 'next/server'

const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(limit: number = 100, windowMs: number = 60000) {
  return async (req: NextRequest) => {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const now = Date.now()
    
    const record = rateLimitMap.get(ip)
    
    if (!record || now > record.resetTime) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
      return { allowed: true, remaining: limit - 1 }
    }
    
    if (record.count >= limit) {
      return { allowed: false, remaining: 0, resetTime: record.resetTime }
    }
    
    record.count++
    return { allowed: true, remaining: limit - record.count }
  }
}

export function clearExpiredRateLimits() {
  const now = Date.now()
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key)
    }
  }
}

setInterval(clearExpiredRateLimits, 60000)
