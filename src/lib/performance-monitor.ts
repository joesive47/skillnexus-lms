// Client-side performance monitoring
export class ClientPerformanceMonitor {
  private static instance: ClientPerformanceMonitor
  private metrics: Map<string, number[]> = new Map()

  static getInstance(): ClientPerformanceMonitor {
    if (!this.instance) {
      this.instance = new ClientPerformanceMonitor()
    }
    return this.instance
  }

  measurePageLoad() {
    if (typeof window === 'undefined') return

    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      
      const metrics = {
        'page-load-time': navigation.loadEventEnd - navigation.fetchStart,
        'dom-content-loaded': navigation.domContentLoadedEventEnd - navigation.fetchStart,
        'first-paint': this.getFirstPaint(),
        'largest-contentful-paint': this.getLCP()
      }

      Object.entries(metrics).forEach(([key, value]) => {
        if (value > 0) {
          this.recordMetric(key, value)
        }
      })
    })
  }

  private getFirstPaint(): number {
    const paintEntries = performance.getEntriesByType('paint')
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint')
    return firstPaint?.startTime || 0
  }

  private getLCP(): number {
    return new Promise((resolve) => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        resolve(lastEntry.startTime)
      }).observe({ entryTypes: ['largest-contentful-paint'] })
    }) as any
  }

  recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }
    this.metrics.get(name)!.push(value)
  }

  getMetrics() {
    const result: Record<string, any> = {}
    this.metrics.forEach((values, name) => {
      result[name] = {
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        count: values.length
      }
    })
    return result
  }
}