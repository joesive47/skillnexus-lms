// Auth Logger - ระบบติดตามการ Login เพื่อหาสาเหตุปัญหา

type LogLevel = 'info' | 'warn' | 'error' | 'success'

interface AuthLog {
  timestamp: string
  level: LogLevel
  step: string
  message: string
  data?: any
  email?: string
}

class AuthLogger {
  private logs: AuthLog[] = []
  private readonly MAX_LOGS = 100

  log(level: LogLevel, step: string, message: string, data?: any, email?: string) {
    const logEntry: AuthLog = {
      timestamp: new Date().toISOString(),
      level,
      step,
      message,
      data,
      email: email ? this.maskEmail(email) : undefined
    }

    // เก็บ logs ใน memory (จำกัด 100 entries)
    this.logs.push(logEntry)
    if (this.logs.length > this.MAX_LOGS) {
      this.logs.shift()
    }

    // Log ไปยัง console ด้วย
    const prefix = `[AUTH ${level.toUpperCase()}] [${step}]`
    const fullMessage = email 
      ? `${prefix} ${this.maskEmail(email)} - ${message}`
      : `${prefix} ${message}`

    switch (level) {
      case 'error':
        console.error(fullMessage, data || '')
        break
      case 'warn':
        console.warn(fullMessage, data || '')
        break
      case 'success':
        console.log(`✅ ${fullMessage}`, data || '')
        break
      default:
        console.log(fullMessage, data || '')
    }

    return logEntry
  }

  info(step: string, message: string, data?: any, email?: string) {
    return this.log('info', step, message, data, email)
  }

  warn(step: string, message: string, data?: any, email?: string) {
    return this.log('warn', step, message, data, email)
  }

  error(step: string, message: string, data?: any, email?: string) {
    return this.log('error', step, message, data, email)
  }

  success(step: string, message: string, data?: any, email?: string) {
    return this.log('success', step, message, data, email)
  }

  // Mask email เพื่อความปลอดภัย (แสดงแค่บางส่วน)
  private maskEmail(email: string): string {
    const [username, domain] = email.split('@')
    if (username.length <= 3) {
      return `${username[0]}***@${domain}`
    }
    return `${username.slice(0, 2)}***${username.slice(-1)}@${domain}`
  }

  // ดึง logs ทั้งหมด
  getLogs(limit?: number): AuthLog[] {
    if (limit) {
      return this.logs.slice(-limit)
    }
    return [...this.logs]
  }

  // ดึง logs ตาม email
  getLogsByEmail(email: string, limit: number = 10): AuthLog[] {
    const maskedEmail = this.maskEmail(email)
    return this.logs
      .filter(log => log.email === maskedEmail)
      .slice(-limit)
  }

  // ล้าง logs
  clear() {
    this.logs = []
  }

  // สร้าง summary สำหรับ login attempt
  createLoginSummary(email: string): string {
    const logs = this.getLogsByEmail(email, 20)
    const errors = logs.filter(l => l.level === 'error')
    const warnings = logs.filter(l => l.level === 'warn')
    
    let summary = `\n=== Login Summary for ${this.maskEmail(email)} ===\n`
    summary += `Total logs: ${logs.length}\n`
    summary += `Errors: ${errors.length}\n`
    summary += `Warnings: ${warnings.length}\n\n`
    
    if (errors.length > 0) {
      summary += 'Recent Errors:\n'
      errors.forEach(log => {
        summary += `  [${log.step}] ${log.message}\n`
      })
      summary += '\n'
    }

    summary += 'Recent Steps:\n'
    logs.slice(-5).forEach(log => {
      const icon = log.level === 'error' ? '❌' : 
                   log.level === 'warn' ? '⚠️' : 
                   log.level === 'success' ? '✅' : 'ℹ️'
      summary += `  ${icon} [${log.step}] ${log.message}\n`
    })
    
    return summary
  }
}

// Singleton instance
export const authLogger = new AuthLogger()

// Export types
export type { AuthLog, LogLevel }
