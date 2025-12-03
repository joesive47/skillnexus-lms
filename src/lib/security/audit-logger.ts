// Security Audit Logger
interface AuditLog {
  timestamp: Date
  userId?: string
  action: string
  resource: string
  ip: string
  userAgent: string
  status: 'success' | 'failure' | 'suspicious'
  details?: any
}

export class AuditLogger {
  private static logs: AuditLog[] = []

  static log(entry: Omit<AuditLog, 'timestamp'>) {
    const log: AuditLog = {
      timestamp: new Date(),
      ...entry
    }
    
    this.logs.push(log)
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🔒 AUDIT:', log)
    }
    
    // Keep only last 10000 logs in memory
    if (this.logs.length > 10000) {
      this.logs = this.logs.slice(-10000)
    }
    
    // In production, send to external logging service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to Sentry, DataDog, or CloudWatch
    }
  }

  static getSuspiciousActivity(limit = 100): AuditLog[] {
    return this.logs
      .filter(log => log.status === 'suspicious')
      .slice(-limit)
  }

  static getFailedAttempts(userId: string, minutes = 15): number {
    const cutoff = new Date(Date.now() - minutes * 60000)
    return this.logs.filter(
      log => log.userId === userId && 
             log.status === 'failure' && 
             log.timestamp > cutoff
    ).length
  }
}
