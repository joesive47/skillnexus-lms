// Input Validation & Sanitization
export class InputValidator {
  static sanitizeHtml(input: string): string {
    // Simple HTML sanitization without external library
    return input.replace(/<[^>]*>/g, '')
  }

  static validateEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email) && email.length <= 255
  }

  static validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = []
    if (password.length < 8) errors.push('Password must be at least 8 characters')
    if (!/[A-Z]/.test(password)) errors.push('Password must contain uppercase letter')
    if (!/[a-z]/.test(password)) errors.push('Password must contain lowercase letter')
    if (!/[0-9]/.test(password)) errors.push('Password must contain number')
    return { valid: errors.length === 0, errors }
  }

  static sanitizeFilename(filename: string): string {
    return filename.replace(/[^a-zA-Z0-9.-]/g, '_').substring(0, 255)
  }

  static validateFileType(filename: string, allowedTypes: string[]): boolean {
    const ext = filename.split('.').pop()?.toLowerCase()
    return ext ? allowedTypes.includes(ext) : false
  }

  static preventSqlInjection(input: string): string {
    return input.replace(/['";\\]/g, '')
  }
}
