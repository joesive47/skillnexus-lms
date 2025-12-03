// Session Fingerprinting for Security
import crypto from 'crypto'
import { NextRequest } from 'next/server'

export class SessionFingerprint {
  static generate(req: NextRequest): string {
    const ip = req.headers.get('x-forwarded-for') || 
               req.headers.get('x-real-ip') || 
               'unknown'
    const userAgent = req.headers.get('user-agent') || 'unknown'
    const acceptLanguage = req.headers.get('accept-language') || 'unknown'
    
    const fingerprint = `${ip}:${userAgent}:${acceptLanguage}`
    
    return crypto.createHash('sha256').update(fingerprint).digest('hex')
  }

  static validate(req: NextRequest, storedFingerprint: string): boolean {
    const currentFingerprint = this.generate(req)
    return currentFingerprint === storedFingerprint
  }

  static detectSuspicious(req: NextRequest, storedFingerprint: string): {
    suspicious: boolean
    reason?: string
  } {
    const ip = req.headers.get('x-forwarded-for') || 'unknown'
    const userAgent = req.headers.get('user-agent') || 'unknown'
    
    // Check for suspicious patterns
    if (userAgent.includes('bot') || userAgent.includes('crawler')) {
      return { suspicious: true, reason: 'Bot detected' }
    }
    
    if (!this.validate(req, storedFingerprint)) {
      return { suspicious: true, reason: 'Fingerprint mismatch' }
    }
    
    return { suspicious: false }
  }
}
