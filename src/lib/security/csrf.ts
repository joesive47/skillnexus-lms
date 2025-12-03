// CSRF Protection
import crypto from 'crypto'

const tokens = new Map<string, { token: string; expires: number }>()

export class CSRF {
  static generate(sessionId: string): string {
    const token = crypto.randomBytes(32).toString('hex')
    const expires = Date.now() + 3600000 // 1 hour
    
    tokens.set(sessionId, { token, expires })
    
    return token
  }

  static validate(sessionId: string, token: string): boolean {
    const stored = tokens.get(sessionId)
    
    if (!stored) return false
    if (stored.expires < Date.now()) {
      tokens.delete(sessionId)
      return false
    }
    if (stored.token !== token) return false
    
    return true
  }

  static cleanup() {
    const now = Date.now()
    for (const [sessionId, data] of tokens.entries()) {
      if (data.expires < now) {
        tokens.delete(sessionId)
      }
    }
  }
}

// Cleanup expired tokens every 10 minutes
setInterval(() => CSRF.cleanup(), 600000)
