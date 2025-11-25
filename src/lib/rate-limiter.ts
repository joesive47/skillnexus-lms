interface RateLimitStore {
  count: number
  resetTime: number
}

class InMemoryRateLimiter {
  private store = new Map<string, RateLimitStore>()
  
  constructor(
    private windowMs: number = 60000, // 1 minute
    private maxRequests: number = 100
  ) {
    // ล้างข้อมูลเก่าทุก 5 นาที
    setInterval(() => this.cleanup(), 300000)
  }

  check(identifier: string): { success: boolean; resetTime?: number; remaining?: number } {
    const now = Date.now()
    const current = this.store.get(identifier)
    
    if (!current || current.resetTime < now) {
      this.store.set(identifier, { count: 1, resetTime: now + this.windowMs })
      return { success: true, remaining: this.maxRequests - 1 }
    }
    
    if (current.count >= this.maxRequests) {
      return { 
        success: false, 
        resetTime: current.resetTime,
        remaining: 0
      }
    }
    
    current.count++
    return { 
      success: true, 
      remaining: this.maxRequests - current.count 
    }
  }

  private cleanup() {
    const now = Date.now()
    for (const [key, value] of this.store.entries()) {
      if (value.resetTime < now) {
        this.store.delete(key)
      }
    }
  }
}

// สร้าง rate limiters สำหรับ endpoints ต่างๆ
export const apiLimiter = new InMemoryRateLimiter(60000, 100) // 100 req/min
export const authLimiter = new InMemoryRateLimiter(900000, 5) // 5 req/15min
export const uploadLimiter = new InMemoryRateLimiter(3600000, 10) // 10 req/hour

export function getRateLimitHeaders(result: ReturnType<InMemoryRateLimiter['check']>) {
  return {
    'X-RateLimit-Remaining': result.remaining?.toString() || '0',
    'X-RateLimit-Reset': result.resetTime ? Math.ceil(result.resetTime / 1000).toString() : ''
  }
}