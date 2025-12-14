/**
 * Redis Client (Optional)
 * Simple Redis connection for caching
 */

let redis: any = null

try {
  if (process.env.REDIS_URL) {
    const Redis = require('ioredis')
    redis = new Redis(process.env.REDIS_URL, {
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    })
    
    redis.on('error', (error: Error) => {
      console.warn('Redis connection error:', error.message)
      redis = null
    })
  }
} catch (error) {
  console.warn('Redis not available:', error instanceof Error ? error.message : 'Unknown error')
  redis = null
}

export { redis }

// Simple cache interface that works with or without Redis
export class SimpleCache {
  private memoryCache = new Map<string, { value: any; expires: number }>()
  
  async get(key: string): Promise<any> {
    if (redis) {
      try {
        const value = await redis.get(key)
        return value ? JSON.parse(value) : null
      } catch (error) {
        console.warn('Redis get error:', error)
      }
    }
    
    // Fallback to memory cache
    const entry = this.memoryCache.get(key)
    if (entry && entry.expires > Date.now()) {
      return entry.value
    }
    
    if (entry) {
      this.memoryCache.delete(key)
    }
    
    return null
  }
  
  async set(key: string, value: any, ttlSeconds: number = 3600): Promise<void> {
    if (redis) {
      try {
        await redis.setex(key, ttlSeconds, JSON.stringify(value))
        return
      } catch (error) {
        console.warn('Redis set error:', error)
      }
    }
    
    // Fallback to memory cache
    this.memoryCache.set(key, {
      value,
      expires: Date.now() + (ttlSeconds * 1000)
    })
    
    // Clean up expired entries periodically
    if (this.memoryCache.size > 1000) {
      this.cleanup()
    }
  }
  
  async del(key: string): Promise<void> {
    if (redis) {
      try {
        await redis.del(key)
      } catch (error) {
        console.warn('Redis del error:', error)
      }
    }
    
    this.memoryCache.delete(key)
  }
  
  private cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.memoryCache.entries()) {
      if (entry.expires <= now) {
        this.memoryCache.delete(key)
      }
    }
  }
}

export const cache = new SimpleCache()

// Export convenience functions for backward compatibility
export const getCache = (key: string) => cache.get(key)
export const setCache = (key: string, value: any, ttl?: number) => cache.set(key, value, ttl)
export const deleteCache = (key: string) => cache.del(key)

export default { redis, cache, SimpleCache }