// Performance Optimizer - เครื่องมือเพิ่มความเร็วระบบ
import { cache } from './cache'

export class PerformanceOptimizer {
  private static queryCache = new Map()
  private static componentCache = new Map()

  // Database Query Optimization
  static async optimizeQuery<T>(
    key: string,
    queryFn: () => Promise<T>,
    options: {
      ttl?: number
      skipCache?: boolean
    } = {}
  ): Promise<T> {
    const { ttl = 300000, skipCache = false } = options

    if (!skipCache) {
      const cached = this.queryCache.get(key)
      if (cached && Date.now() < cached.expiry) {
        return cached.data
      }
    }

    const start = performance.now()
    const result = await queryFn()
    const duration = performance.now() - start

    // Cache result
    this.queryCache.set(key, {
      data: result,
      expiry: Date.now() + ttl
    })

    // Log slow queries
    if (duration > 1000) {
      console.warn(`🐌 Slow query detected: ${key} took ${duration.toFixed(2)}ms`)
    }

    return result
  }

  // Component Memoization
  static memoizeComponent<T>(
    key: string,
    componentFn: () => T,
    deps: any[] = []
  ): T {
    const depsKey = JSON.stringify(deps)
    const cacheKey = `${key}_${depsKey}`
    
    const cached = this.componentCache.get(cacheKey)
    if (cached) {
      return cached
    }

    const result = componentFn()
    this.componentCache.set(cacheKey, result)
    
    return result
  }

  // Image Optimization
  static optimizeImageUrl(url: string, width?: number, quality = 75): string {
    if (!url) return ''
    
    // สำหรับ Next.js Image Optimization
    if (url.startsWith('/')) {
      const params = new URLSearchParams()
      if (width) params.set('w', width.toString())
      params.set('q', quality.toString())
      return `/_next/image?url=${encodeURIComponent(url)}&${params.toString()}`
    }
    
    return url
  }

  // Bundle Size Optimization
  static async loadComponentLazy<T>(
    importFn: () => Promise<{ default: T }>
  ): Promise<T> {
    try {
      const module = await importFn()
      return module.default
    } catch (error) {
      console.error('Failed to load component:', error)
      throw error
    }
  }

  // Memory Management
  static clearCaches() {
    this.queryCache.clear()
    this.componentCache.clear()
    cache.clear()
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc()
    }
  }

  // Performance Monitoring
  static getPerformanceStats() {
    return {
      queryCache: {
        size: this.queryCache.size,
        entries: Array.from(this.queryCache.keys())
      },
      componentCache: {
        size: this.componentCache.size,
        entries: Array.from(this.componentCache.keys())
      },
      memory: process.memoryUsage ? process.memoryUsage() : null
    }
  }

  // Database Connection Optimization
  static async withTransaction<T>(
    fn: (tx: any) => Promise<T>
  ): Promise<T> {
    // ใช้ transaction เพื่อลด connection overhead
    const { prisma } = await import('./prisma')
    return prisma.$transaction(fn)
  }

  // API Response Optimization
  static optimizeApiResponse(data: any) {
    // ลบ fields ที่ไม่จำเป็น
    const optimized = JSON.parse(JSON.stringify(data, (key, value) => {
      // ลบ fields ที่ขึ้นต้นด้วย _
      if (key.startsWith('_')) return undefined
      
      // ลบ null values
      if (value === null) return undefined
      
      // ลบ empty arrays
      if (Array.isArray(value) && value.length === 0) return undefined
      
      return value
    }))

    return optimized
  }
}

// React Hook สำหรับ Performance
export function usePerformanceOptimizer() {
  return {
    optimizeQuery: PerformanceOptimizer.optimizeQuery,
    memoizeComponent: PerformanceOptimizer.memoizeComponent,
    optimizeImageUrl: PerformanceOptimizer.optimizeImageUrl,
    clearCaches: PerformanceOptimizer.clearCaches,
    getStats: PerformanceOptimizer.getPerformanceStats
  }
}

// Utility Functions
export const performanceUtils = {
  // Debounce function calls
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout
    return (...args: Parameters<T>) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  },

  // Throttle function calls
  throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  },

  // Measure execution time
  async measureTime<T>(
    name: string,
    fn: () => Promise<T>
  ): Promise<T> {
    const start = performance.now()
    const result = await fn()
    const end = performance.now()
    
    console.log(`⏱️ ${name}: ${(end - start).toFixed(2)}ms`)
    return result
  }
}