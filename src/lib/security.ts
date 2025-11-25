import { NextRequest } from 'next/server'

// Input sanitization
export function sanitizeInput(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim()
}

// CSRF token generation
export function generateCSRFToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// File upload validation
export function validateFileUpload(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'application/pdf']
  const maxSize = 50 * 1024 * 1024 // 50MB
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type' }
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'File too large' }
  }
  
  return { valid: true }
}

// Rate limiting helper
export function createRateLimiter(windowMs: number, maxRequests: number) {
  const requests = new Map<string, { count: number; resetTime: number }>()
  
  return (identifier: string): { success: boolean; resetTime?: number } => {
    const now = Date.now()
    const windowStart = now - windowMs
    
    // Clean old entries
    for (const [key, value] of requests.entries()) {
      if (value.resetTime < now) {
        requests.delete(key)
      }
    }
    
    const current = requests.get(identifier)
    
    if (!current) {
      requests.set(identifier, { count: 1, resetTime: now + windowMs })
      return { success: true }
    }
    
    if (current.count >= maxRequests) {
      return { success: false, resetTime: current.resetTime }
    }
    
    current.count++
    return { success: true }
  }
}