/**
 * Performance Monitor - ตรวจสอบประสิทธิภาพ
 */

export class PerformanceMonitor {
  private static metrics = new Map<string, number[]>()
  
  static startTimer(label: string): () => void {
    const start = performance.now()
    
    return () => {
      const duration = performance.now() - start
      const existing = this.metrics.get(label) || []
      existing.push(duration)
      
      // Keep only last 100 measurements
      if (existing.length > 100) {
        existing.splice(0, existing.length - 100)
      }
      
      this.metrics.set(label, existing)
      
      // Warn if slow
      if (duration > 100) {
        console.warn(`⚠️ Slow operation: ${label} took ${duration.toFixed(2)}ms`)
      }
    }
  }
  
  static getStats(label: string) {
    const measurements = this.metrics.get(label) || []
    if (measurements.length === 0) return null
    
    const avg = measurements.reduce((a, b) => a + b, 0) / measurements.length
    const max = Math.max(...measurements)
    const min = Math.min(...measurements)
    
    return { avg: avg.toFixed(2), max: max.toFixed(2), min: min.toFixed(2), count: measurements.length }
  }
  
  static getAllStats() {
    const stats: Record<string, any> = {}
    for (const [label] of this.metrics) {
      stats[label] = this.getStats(label)
    }
    return stats
  }
}

export default PerformanceMonitor;
