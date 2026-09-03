/**
 * Simple Rate Limiter
 * In-memory rate limiting for API endpoints
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

export async function rateLimit(
  identifier: string, 
  limit: number = 100, 
  windowMs: number = 60000 // 1 minute
): Promise<boolean> {
  const now = Date.now()
  const key = `rate_limit:${identifier}`
  
  // Clean up expired entries
  if (rateLimitStore.size > 10000) {
    for (const [k, v] of rateLimitStore.entries()) {
      if (v.resetTime < now) {
        rateLimitStore.delete(k)
      }
    }
  }
  
  const entry = rateLimitStore.get(key)
  
  if (!entry || entry.resetTime < now) {
    // Create new entry or reset expired entry
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs
    })
    return true
  }
  
  if (entry.count >= limit) {
    return false
  }
  
  entry.count++
  return true
}

export function getRateLimitInfo(identifier: string) {
  const key = `rate_limit:${identifier}`
  const entry = rateLimitStore.get(key)
  
  if (!entry || entry.resetTime < Date.now()) {
    return {
      count: 0,
      remaining: 100,
      resetTime: Date.now() + 60000
    }
  }
  
  return {
    count: entry.count,
    remaining: Math.max(0, 100 - entry.count),
    resetTime: entry.resetTime
  }
}

// Rate limiter class for middleware compatibility
class RateLimiter {
  constructor(private limit: number, private windowMs: number) {}
  
  check(identifier: string) {
    const now = Date.now()
    const key = `rate_limit:${identifier}`
    
    const entry = rateLimitStore.get(key)
    
    if (!entry || entry.resetTime < now) {
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + this.windowMs
      })
      return {
        success: true,
        count: 1,
        remaining: this.limit - 1,
        resetTime: now + this.windowMs
      }
    }
    
    if (entry.count >= this.limit) {
      return {
        success: false,
        count: entry.count,
        remaining: 0,
        resetTime: entry.resetTime
      }
    }
    
    entry.count++
    return {
      success: true,
      count: entry.count,
      remaining: this.limit - entry.count,
      resetTime: entry.resetTime
    }
  }
}

// Export rate limiters for middleware
export const apiLimiter = new RateLimiter(100, 60000) // 100 requests per minute
export const authLimiter = new RateLimiter(10, 60000)  // 10 auth requests per minute

// Export rate limit headers function
export function getRateLimitHeaders(rateLimitResult: any) {
  return {
    'X-RateLimit-Limit': rateLimitResult.count + rateLimitResult.remaining,
    'X-RateLimit-Remaining': rateLimitResult.remaining,
    'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString()
  }
}