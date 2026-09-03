/**
 * Disabled Threat Detector for Development
 */

export class ThreatDetector {
  static getInstance() {
    return new ThreatDetector()
  }

  async detectThreat() {
    return { action: 'LOG', reason: 'Disabled in development' }
  }

  isIPBlocked() {
    return false
  }

  unblockIP() {
    // No-op
  }

  getStats() {
    return { blockedIPs: 0, suspiciousIPs: 0 }
  }
}

export const threatDetector = ThreatDetector.getInstance()
