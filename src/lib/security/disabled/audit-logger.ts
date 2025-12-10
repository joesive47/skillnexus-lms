/**
 * Disabled Audit Logger for Development
 */

export class AuditLogger {
  static log() {
    // No-op in development
    if (process.env.NODE_ENV === 'development') return
  }

  static getSuspiciousActivity() {
    return []
  }

  static getFailedAttempts() {
    return 0
  }
}
