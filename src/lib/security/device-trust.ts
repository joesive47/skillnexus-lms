// Device Trust Management
import { NextRequest } from 'next/server'
import { SessionFingerprint } from './session-fingerprint'
import crypto from 'crypto'

export class DeviceTrust {
  static generateDeviceId(req: NextRequest): string {
    const fingerprint = SessionFingerprint.generate(req)
    return crypto.createHash('sha256').update(fingerprint).digest('hex')
  }

  static getDeviceInfo(req: NextRequest) {
    const userAgent = req.headers.get('user-agent') || 'Unknown'
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'Unknown'
    
    let deviceName = 'Unknown Device'
    if (userAgent.includes('iPhone')) deviceName = 'iPhone'
    else if (userAgent.includes('iPad')) deviceName = 'iPad'
    else if (userAgent.includes('Android')) deviceName = 'Android Device'
    else if (userAgent.includes('Windows')) deviceName = 'Windows PC'
    else if (userAgent.includes('Mac')) deviceName = 'Mac'
    else if (userAgent.includes('Linux')) deviceName = 'Linux PC'

    return {
      deviceName,
      fingerprint: this.generateDeviceId(req),
      ipAddress: ip,
      userAgent
    }
  }

  static async isTrusted(userId: string, fingerprint: string): Promise<boolean> {
    // Check if device is in trusted list
    // Implementation depends on database
    return false // Default: not trusted
  }
}
