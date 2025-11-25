// Performance monitoring utilities
export class PerformanceMonitor {
  private static metrics = new Map<string, number[]>()

  static startTimer(label: string): () => number {
    const start = performance.now()
    return () => {
      const duration = performance.now() - start
      this.recordMetric(label, duration)
      return duration
    }
  }

  static recordMetric(label: string, value: number) {
    if (!this.metrics.has(label)) {
      this.metrics.set(label, [])
    }
    this.metrics.get(label)!.push(value)
  }

  static getMetrics(label: string) {
    const values = this.metrics.get(label) || []
    if (values.length === 0) return null

    return {
      count: values.length,
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values)
    }
  }

  static getAllMetrics() {
    const result: Record<string, any> = {}
    for (const [label] of this.metrics) {
      result[label] = this.getMetrics(label)
    }
    return result
  }
}

// Database query optimization helper
export function optimizeQuery(query: any) {
  // Add select fields to reduce data transfer
  if (!query.select) {
    console.warn('Query without select fields detected')
  }
  
  // Add pagination for large datasets
  if (!query.take && !query.first) {
    console.warn('Query without pagination detected')
  }
  
  return query
}