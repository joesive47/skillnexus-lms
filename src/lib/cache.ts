interface CacheItem<T> {
  data: T
  expiry: number
}

class MemoryCache {
  private cache = new Map<string, CacheItem<any>>()

  set<T>(key: string, data: T, ttlMs: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttlMs
    })
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) return null
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key)
      return null
    }
    
    return item.data
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }
}

export const cache = new MemoryCache()

export function withCache<T>(
  key: string,
  fn: () => Promise<T>,
  ttlMs: number = 5 * 60 * 1000
): Promise<T> {
  return new Promise(async (resolve) => {
    const cached = cache.get<T>(key)
    if (cached) {
      resolve(cached)
      return
    }
    
    const result = await fn()
    cache.set(key, result, ttlMs)
    resolve(result)
  })
}