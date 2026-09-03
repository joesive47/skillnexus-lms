/**
 * Lightweight Threat Detector for Development
 * ลดการทำงานของ threat detection ใน development
 */

import { DEV_SECURITY_CONFIG } from './dev-config'

export type ThreatLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type ThreatType = 'BRUTE_FORCE' | 'RATE_LIMIT' | 'SUSPICIOUS_ACTIVITY'

export interface ThreatEvent {
  type: ThreatType
  level: ThreatLevel
  userId?: string
  ip: string
  endpoint: string
  timestamp: Date
}

export interface ThreatResponse {
  action: 'BLOCK' | 'ALERT' | 'LOG'
  reason: string
  duration?: number
}

export class LightweightThreatDetector {
  private static instance: LightweightThreatDetector
  private suspiciousIPs = new Map<string, number>()
  private blockedIPs = new Set<string>()

  private constructor() {
    // ทำ cleanup ทุก 10 นาทีแทน 5 นาที
    if (DEV_SECURITY_CONFIG.THREAT_DETECTION_ENABLED) {
      this.startCleanupTask()
    }
  }

  static getInstance(): LightweightThreatDetector {
    if (!LightweightThreatDetector.instance) {
      LightweightThreatDetector.instance = new LightweightThreatDetector()
    }
    return LightweightThreatDetector.instance
  }

  async detectThreat(event: ThreatEvent): Promise<ThreatResponse> {
    // ถ้าปิดใช้งาน threat detection ให้ return LOG เท่านั้น
    if (!DEV_SECURITY_CONFIG.THREAT_DETECTION_ENABLED) {
      return {
        action: 'LOG',
        reason: 'Threat detection disabled in development'
      }
    }

    // Check if IP is blocked (in-memory only)
    if (this.blockedIPs.has(event.ip)) {
      return {
        action: 'BLOCK',
        reason: 'IP temporarily blocked',
        duration: 300 // 5 minutes only
      }
    }

    // Simple threat analysis
    return this.simpleAnalyzeThreat(event)
  }

  private simpleAnalyzeThreat(event: ThreatEvent): ThreatResponse {
    switch (event.type) {
      case 'BRUTE_FORCE':
        const attempts = this.suspiciousIPs.get(event.ip) || 0
        this.suspiciousIPs.set(event.ip, attempts + 1)

        if (attempts >= 10) { // เพิ่มจาก 5 เป็น 10
          this.blockedIPs.add(event.ip)
          // Auto-unblock after 5 minutes
          setTimeout(() => {
            this.blockedIPs.delete(event.ip)
          }, 300000)
          
          return {
            action: 'BLOCK',
            reason: `Too many failed attempts: ${attempts + 1}`,
            duration: 300
          }
        }

        return {
          action: 'LOG',
          reason: `Failed attempt ${attempts + 1}/10`
        }

      case 'RATE_LIMIT':
        return {
          action: 'BLOCK',
          reason: 'Rate limit exceeded',
          duration: 60 // 1 minute
        }

      default:
        return {
          action: 'LOG',
          reason: 'Low priority threat'
        }
    }
  }

  isIPBlocked(ip: string): boolean {
    return this.blockedIPs.has(ip)
  }

  unblockIP(ip: string): void {
    this.blockedIPs.delete(ip)
    this.suspiciousIPs.delete(ip)
  }

  private startCleanupTask(): void {
    // ทำ cleanup ทุก 10 นาที (แทน 5 นาที)
    setInterval(() => {
      // Clear old suspicious IPs (older than 30 minutes)
      const thirtyMinutesAgo = Date.now() - 1800000
      for (const [ip, timestamp] of this.suspiciousIPs.entries()) {
        if (timestamp < thirtyMinutesAgo) {
          this.suspiciousIPs.delete(ip)
        }
      }
    }, 600000) // 10 minutes
  }

  // Simple stats without database queries
  getStats(): {
    blockedIPs: number
    suspiciousIPs: number
  } {
    return {
      blockedIPs: this.blockedIPs.size,
      suspiciousIPs: this.suspiciousIPs.size
    }
  }
}

export const lightweightThreatDetector = LightweightThreatDetector.getInstance()