// Security Audit Logger
import * as Sentry from '@sentry/nextjs';

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
      // Send suspicious activity to Sentry
      if (log.status === 'suspicious' || log.status === 'failure') {
        Sentry.captureMessage(`Security Audit: ${log.action}`, {
          level: log.status === 'suspicious' ? 'warning' : 'error',
          tags: {
            audit_action: log.action,
            audit_status: log.status,
            resource: log.resource,
          },
          extra: {
            userId: log.userId,
            ip: log.ip,
            userAgent: log.userAgent,
            details: log.details,
          },
        });
      }
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
