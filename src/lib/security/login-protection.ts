// Login Protection & Brute Force Prevention
import { AuditLogger } from './audit-logger'

interface LoginAttempt {
  count: number
  lastAttempt: number
  lockedUntil?: number
}

const attempts = new Map<string, LoginAttempt>()

export class LoginProtection {
  private static MAX_ATTEMPTS = 5
  private static LOCK_DURATION = 900000 // 15 minutes
  private static ATTEMPT_WINDOW = 300000 // 5 minutes

  static async checkAttempts(identifier: string): Promise<{ allowed: boolean; remaining: number; lockedUntil?: number }> {
    const now = Date.now()
    const attempt = attempts.get(identifier)

    if (!attempt) {
      return { allowed: true, remaining: this.MAX_ATTEMPTS }
    }

    // Check if locked
    if (attempt.lockedUntil && now < attempt.lockedUntil) {
      return {
        allowed: false,
        remaining: 0,
        lockedUntil: attempt.lockedUntil
      }
    }

    // Reset if window expired
    if (now - attempt.lastAttempt > this.ATTEMPT_WINDOW) {
      attempts.delete(identifier)
      return { allowed: true, remaining: this.MAX_ATTEMPTS }
    }

    // Check attempts
    if (attempt.count >= this.MAX_ATTEMPTS) {
      const lockedUntil = now + this.LOCK_DURATION
      attempt.lockedUntil = lockedUntil
      
      AuditLogger.log({
        action: 'ACCOUNT_LOCKED',
        resource: '/api/auth/signin',
        ip: identifier,
        userAgent: 'unknown',
        status: 'suspicious',
        details: { reason: 'Too many failed attempts' }
      })

      return { allowed: false, remaining: 0, lockedUntil }
    }

    return {
      allowed: true,
      remaining: this.MAX_ATTEMPTS - attempt.count
    }
  }

  static recordAttempt(identifier: string, success: boolean) {
    if (success) {
      attempts.delete(identifier)
      return
    }

    const now = Date.now()
    const attempt = attempts.get(identifier)

    if (!attempt) {
      attempts.set(identifier, {
        count: 1,
        lastAttempt: now
      })
    } else {
      attempt.count++
      attempt.lastAttempt = now
    }
  }

  static cleanup() {
    const now = Date.now()
    for (const [key, attempt] of attempts.entries()) {
      if (now - attempt.lastAttempt > this.ATTEMPT_WINDOW) {
        attempts.delete(key)
      }
    }
  }
}

// Cleanup every 5 minutes
setInterval(() => LoginProtection.cleanup(), 300000)
