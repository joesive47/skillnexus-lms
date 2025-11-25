import { prisma } from './prisma'

interface PerformanceMetric {
  id: string
  name: string
  value: number
  timestamp: Date
  category: 'database' | 'api' | 'ui' | 'cache' | 'memory'
  metadata?: Record<string, any>
}

interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical'
  score: number
  metrics: {
    responseTime: number
    throughput: number
    errorRate: number
    memoryUsage: number
    cpuUsage: number
  }
  recommendations: string[]
}

class AdvancedPerformanceMonitor {
  private metrics: Map<string, PerformanceMetric[]> = new Map()
  private thresholds = {
    responseTime: 1000, // ms
    errorRate: 0.05, // 5%
    memoryUsage: 0.8, // 80%
    cpuUsage: 0.7 // 70%
  }

  // Track API response times
  async trackApiResponse(endpoint: string, duration: number, success: boolean) {
    const metric: PerformanceMetric = {
      id: `api_${Date.now()}_${Math.random()}`,
      name: 'api_response_time',
      value: duration,
      timestamp: new Date(),
      category: 'api',
      metadata: { endpoint, success }
    }

    this.addMetric('api_response', metric)
    
    // Store in database for long-term analysis
    // Note: performanceMetric model not yet implemented in schema
    // TODO: Add performanceMetric model to Prisma schema for persistent storage
  }

  // Track database query performance
  async trackDatabaseQuery(query: string, duration: number, rowCount?: number) {
    const metric: PerformanceMetric = {
      id: `db_${Date.now()}_${Math.random()}`,
      name: 'database_query_time',
      value: duration,
      timestamp: new Date(),
      category: 'database',
      metadata: { query: query.substring(0, 100), rowCount }
    }

    this.addMetric('database', metric)
  }

  // Track cache performance
  trackCacheOperation(operation: 'hit' | 'miss' | 'set', key: string, duration?: number) {
    const metric: PerformanceMetric = {
      id: `cache_${Date.now()}_${Math.random()}`,
      name: `cache_${operation}`,
      value: duration || 0,
      timestamp: new Date(),
      category: 'cache',
      metadata: { operation, key: key.substring(0, 50) }
    }

    this.addMetric('cache', metric)
  }

  // Track memory usage
  trackMemoryUsage() {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const usage = process.memoryUsage()
      const metric: PerformanceMetric = {
        id: `memory_${Date.now()}`,
        name: 'memory_usage',
        value: usage.heapUsed / usage.heapTotal,
        timestamp: new Date(),
        category: 'memory',
        metadata: usage
      }

      this.addMetric('memory', metric)
    }
  }

  // Add metric to in-memory store
  private addMetric(category: string, metric: PerformanceMetric) {
    if (!this.metrics.has(category)) {
      this.metrics.set(category, [])
    }

    const categoryMetrics = this.metrics.get(category)!
    categoryMetrics.push(metric)

    // Keep only last 1000 metrics per category
    if (categoryMetrics.length > 1000) {
      categoryMetrics.shift()
    }
  }

  // Get system health status
  getSystemHealth(): SystemHealth {
    const apiMetrics = this.metrics.get('api_response') || []
    const dbMetrics = this.metrics.get('database') || []
    const memoryMetrics = this.metrics.get('memory') || []

    // Calculate average response time (last 100 requests)
    const recentApiMetrics = apiMetrics.slice(-100)
    const avgResponseTime = recentApiMetrics.length > 0 
      ? recentApiMetrics.reduce((sum, m) => sum + m.value, 0) / recentApiMetrics.length
      : 0

    // Calculate error rate
    const successfulRequests = recentApiMetrics.filter(m => m.metadata?.success).length
    const errorRate = recentApiMetrics.length > 0 
      ? 1 - (successfulRequests / recentApiMetrics.length)
      : 0

    // Get latest memory usage
    const latestMemory = memoryMetrics[memoryMetrics.length - 1]
    const memoryUsage = latestMemory?.value || 0

    // Calculate health score
    let score = 100
    const recommendations: string[] = []

    if (avgResponseTime > this.thresholds.responseTime) {
      score -= 20
      recommendations.push('API response time is high. Consider optimizing queries or adding caching.')
    }

    if (errorRate > this.thresholds.errorRate) {
      score -= 30
      recommendations.push('Error rate is above threshold. Check logs for recurring issues.')
    }

    if (memoryUsage > this.thresholds.memoryUsage) {
      score -= 25
      recommendations.push('Memory usage is high. Consider implementing garbage collection or optimizing memory usage.')
    }

    // Determine status
    let status: SystemHealth['status'] = 'healthy'
    if (score < 70) status = 'warning'
    if (score < 50) status = 'critical'

    return {
      status,
      score,
      metrics: {
        responseTime: avgResponseTime,
        throughput: recentApiMetrics.length,
        errorRate,
        memoryUsage,
        cpuUsage: 0 // Would need system-level monitoring
      },
      recommendations
    }
  }

  // Get performance insights
  getPerformanceInsights() {
    const health = this.getSystemHealth()
    const apiMetrics = this.metrics.get('api_response') || []
    const dbMetrics = this.metrics.get('database') || []
    const cacheMetrics = this.metrics.get('cache') || []

    // Analyze API performance trends
    const hourlyApiPerformance = this.groupMetricsByHour(apiMetrics)
    const slowestEndpoints = this.getSlowestEndpoints(apiMetrics)
    
    // Analyze database performance
    const slowestQueries = this.getSlowestQueries(dbMetrics)
    
    // Analyze cache performance
    const cacheHitRate = this.calculateCacheHitRate(cacheMetrics)

    return {
      systemHealth: health,
      trends: {
        hourlyApiPerformance,
        slowestEndpoints,
        slowestQueries,
        cacheHitRate
      },
      recommendations: this.generateRecommendations(health, {
        slowestEndpoints,
        slowestQueries,
        cacheHitRate
      })
    }
  }

  private groupMetricsByHour(metrics: PerformanceMetric[]) {
    const hourlyData: Record<string, { count: number; avgTime: number }> = {}
    
    metrics.forEach(metric => {
      const hour = new Date(metric.timestamp).getHours()
      const key = `${hour}:00`
      
      if (!hourlyData[key]) {
        hourlyData[key] = { count: 0, avgTime: 0 }
      }
      
      hourlyData[key].count++
      hourlyData[key].avgTime = (hourlyData[key].avgTime + metric.value) / 2
    })
    
    return hourlyData
  }

  private getSlowestEndpoints(metrics: PerformanceMetric[]) {
    const endpointPerformance: Record<string, { count: number; totalTime: number }> = {}
    
    metrics.forEach(metric => {
      const endpoint = metric.metadata?.endpoint || 'unknown'
      if (!endpointPerformance[endpoint]) {
        endpointPerformance[endpoint] = { count: 0, totalTime: 0 }
      }
      
      endpointPerformance[endpoint].count++
      endpointPerformance[endpoint].totalTime += metric.value
    })
    
    return Object.entries(endpointPerformance)
      .map(([endpoint, data]) => ({
        endpoint,
        avgTime: data.totalTime / data.count,
        count: data.count
      }))
      .sort((a, b) => b.avgTime - a.avgTime)
      .slice(0, 10)
  }

  private getSlowestQueries(metrics: PerformanceMetric[]) {
    return metrics
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
      .map(metric => ({
        query: metric.metadata?.query || 'unknown',
        duration: metric.value,
        timestamp: metric.timestamp
      }))
  }

  private calculateCacheHitRate(metrics: PerformanceMetric[]) {
    const hits = metrics.filter(m => m.name === 'cache_hit').length
    const misses = metrics.filter(m => m.name === 'cache_miss').length
    const total = hits + misses
    
    return total > 0 ? hits / total : 0
  }

  private generateRecommendations(health: SystemHealth, analysis: any) {
    const recommendations: string[] = [...health.recommendations]
    
    // Add specific recommendations based on analysis
    if (analysis.cacheHitRate < 0.8) {
      recommendations.push('Cache hit rate is low. Consider reviewing cache strategy and TTL settings.')
    }
    
    if (analysis.slowestEndpoints.length > 0) {
      const slowest = analysis.slowestEndpoints[0]
      if (slowest.avgTime > 2000) {
        recommendations.push(`Endpoint ${slowest.endpoint} is very slow (${slowest.avgTime}ms). Consider optimization.`)
      }
    }
    
    return recommendations
  }

  // Real-time monitoring
  startRealTimeMonitoring(intervalMs: number = 60000) {
    setInterval(() => {
      this.trackMemoryUsage()
      
      // Clean up old metrics
      this.cleanupOldMetrics()
    }, intervalMs)
  }

  private cleanupOldMetrics() {
    const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 hours ago
    
    this.metrics.forEach((metrics, category) => {
      const filtered = metrics.filter(m => m.timestamp > cutoffTime)
      this.metrics.set(category, filtered)
    })
  }
}

// Export singleton instance
export const performanceMonitor = new AdvancedPerformanceMonitor()

// Middleware for automatic API monitoring
export function withPerformanceMonitoring<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  name: string
): T {
  return (async (...args: any[]) => {
    const start = Date.now()
    let success = true
    
    try {
      const result = await fn(...args)
      return result
    } catch (error) {
      success = false
      throw error
    } finally {
      const duration = Date.now() - start
      await performanceMonitor.trackApiResponse(name, duration, success)
    }
  }) as T
}

// Database query monitoring wrapper
export function withDatabaseMonitoring<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  queryName: string
): T {
  return (async (...args: any[]) => {
    const start = Date.now()
    
    try {
      const result = await fn(...args)
      const duration = Date.now() - start
      
      // Try to get row count if result is array
      const rowCount = Array.isArray(result) ? result.length : undefined
      
      await performanceMonitor.trackDatabaseQuery(queryName, duration, rowCount)
      return result
    } catch (error) {
      const duration = Date.now() - start
      await performanceMonitor.trackDatabaseQuery(queryName, duration, 0)
      throw error
    }
  }) as T
}