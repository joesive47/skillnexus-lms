// Rate Limiter for API Protection
import { NextRequest } from 'next/server'

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number }
}

const store: RateLimitStore = {}

export class RateLimiter {
  private maxRequests: number
  private windowMs: number

  constructor(maxRequests = 100, windowMs = 60000) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
  }

  async check(identifier: string): Promise<{ success: boolean; remaining: number; resetTime: number }> {
    const now = Date.now()
    const record = store[identifier]

    if (!record || now > record.resetTime) {
      store[identifier] = {
        count: 1,
        resetTime: now + this.windowMs
      }
      return { success: true, remaining: this.maxRequests - 1, resetTime: now + this.windowMs }
    }

    if (record.count >= this.maxRequests) {
      return { success: false, remaining: 0, resetTime: record.resetTime }
    }

    record.count++
    return { success: true, remaining: this.maxRequests - record.count, resetTime: record.resetTime }
  }

  getIdentifier(req: NextRequest): string {
    return req.headers.get('x-forwarded-for') || 
           req.headers.get('x-real-ip') || 
           'unknown'
  }
}

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < now) {
      delete store[key]
    }
  })
}, 300000)
