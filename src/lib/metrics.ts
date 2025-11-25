class MetricsService {
  static async trackEvent(event: string, data: any) {
    try {
      // Send to analytics service
      console.log(`[METRICS] ${event}:`, data)
      
      // In production, send to DataDog/CloudWatch
      if (process.env.NODE_ENV === 'production') {
        // await sendToCloudWatch(event, data)
      }
    } catch (error) {
      console.error('Metrics error:', error)
    }
  }

  static async trackPerformance(operation: string, duration: number) {
    this.trackEvent('performance', {
      operation,
      duration,
      timestamp: Date.now()
    })
  }

  static async trackError(error: Error, context?: any) {
    this.trackEvent('error', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: Date.now()
    })
  }

  static async trackUserAction(userId: string, action: string, metadata?: any) {
    this.trackEvent('user_action', {
      userId,
      action,
      metadata,
      timestamp: Date.now()
    })
  }
}

export const trackEvent = MetricsService.trackEvent
export const trackPerformance = MetricsService.trackPerformance
export const trackError = MetricsService.trackError