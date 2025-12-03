// Password Security & Breach Detection
import crypto from 'crypto'

export class PasswordValidator {
  private static commonPasswords = new Set([
    'password', '123456', '12345678', 'qwerty', 'abc123',
    'monkey', '1234567', 'letmein', 'trustno1', 'dragon',
    'baseball', 'iloveyou', 'master', 'sunshine', 'ashley',
    'bailey', 'passw0rd', 'shadow', '123123', '654321'
  ])

  static validate(password: string): { valid: boolean; score: number; feedback: string[] } {
    const feedback: string[] = []
    let score = 0

    if (password.length >= 8) score += 20
    else feedback.push('Password must be at least 8 characters')

    if (password.length >= 12) score += 10
    if (/[A-Z]/.test(password)) score += 20
    else feedback.push('Add uppercase letters')

    if (/[a-z]/.test(password)) score += 20
    else feedback.push('Add lowercase letters')

    if (/[0-9]/.test(password)) score += 15
    else feedback.push('Add numbers')

    if (/[^A-Za-z0-9]/.test(password)) score += 15
    else feedback.push('Add special characters')

    if (this.commonPasswords.has(password.toLowerCase())) {
      score = 0
      feedback.push('This password is too common')
    }

    return {
      valid: score >= 70,
      score,
      feedback
    }
  }

  static async checkBreach(password: string): Promise<boolean> {
    const hash = crypto.createHash('sha1').update(password).digest('hex').toUpperCase()
    const prefix = hash.substring(0, 5)
    const suffix = hash.substring(5)

    try {
      const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`)
      const text = await response.text()
      return text.includes(suffix)
    } catch {
      return false
    }
  }
}
