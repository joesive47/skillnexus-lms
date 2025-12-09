/**
 * Phase 9: Real-Time Threat Detection
 * SIEM, IDS, and Automated Response System
 */

import { prisma } from '@/lib/prisma';

export type ThreatLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ThreatType = 
  | 'BRUTE_FORCE'
  | 'SQL_INJECTION'
  | 'XSS'
  | 'CSRF'
  | 'DDoS'
  | 'SUSPICIOUS_ACTIVITY'
  | 'UNAUTHORIZED_ACCESS'
  | 'DATA_EXFILTRATION';

export interface ThreatEvent {
  type: ThreatType;
  level: ThreatLevel;
  userId?: string;
  ip: string;
  userAgent?: string;
  endpoint: string;
  payload?: any;
  timestamp: Date;
}

export interface ThreatResponse {
  action: 'BLOCK' | 'ALERT' | 'LOG' | 'QUARANTINE';
  reason: string;
  duration?: number; // in seconds
}

export class ThreatDetector {
  private static instance: ThreatDetector;
  private suspiciousIPs = new Map<string, number>();
  private blockedIPs = new Set<string>();
  private readonly MAX_FAILED_ATTEMPTS = 5;
  private readonly BLOCK_DURATION = 3600; // 1 hour

  private constructor() {
    this.startCleanupTask();
  }

  static getInstance(): ThreatDetector {
    if (!ThreatDetector.instance) {
      ThreatDetector.instance = new ThreatDetector();
    }
    return ThreatDetector.instance;
  }

  /**
   * Detect and analyze threat
   */
  async detectThreat(event: ThreatEvent): Promise<ThreatResponse> {
    // Check if IP is already blocked
    if (this.blockedIPs.has(event.ip)) {
      return {
        action: 'BLOCK',
        reason: 'IP address is blocked due to previous threats',
        duration: this.BLOCK_DURATION,
      };
    }

    // Analyze threat based on type
    const response = await this.analyzeThreat(event);

    // Log threat event
    await this.logThreatEvent(event, response);

    // Execute automated response
    await this.executeResponse(event, response);

    return response;
  }

  /**
   * Analyze threat and determine response
   */
  private async analyzeThreat(event: ThreatEvent): Promise<ThreatResponse> {
    switch (event.type) {
      case 'BRUTE_FORCE':
        return this.handleBruteForce(event);
      
      case 'SQL_INJECTION':
      case 'XSS':
        return {
          action: 'BLOCK',
          reason: `${event.type} attack detected`,
          duration: this.BLOCK_DURATION * 24, // 24 hours
        };
      
      case 'DDoS':
        return this.handleDDoS(event);
      
      case 'SUSPICIOUS_ACTIVITY':
        return this.handleSuspiciousActivity(event);
      
      case 'UNAUTHORIZED_ACCESS':
        return {
          action: 'BLOCK',
          reason: 'Unauthorized access attempt',
          duration: this.BLOCK_DURATION,
        };
      
      default:
        return {
          action: 'LOG',
          reason: 'Unknown threat type',
        };
    }
  }

  /**
   * Handle brute force attacks
   */
  private handleBruteForce(event: ThreatEvent): ThreatResponse {
    const attempts = this.suspiciousIPs.get(event.ip) || 0;
    this.suspiciousIPs.set(event.ip, attempts + 1);

    if (attempts >= this.MAX_FAILED_ATTEMPTS) {
      this.blockedIPs.add(event.ip);
      return {
        action: 'BLOCK',
        reason: `Brute force attack detected: ${attempts + 1} failed attempts`,
        duration: this.BLOCK_DURATION,
      };
    }

    if (attempts >= 3) {
      return {
        action: 'ALERT',
        reason: `Suspicious login attempts: ${attempts + 1} failures`,
      };
    }

    return {
      action: 'LOG',
      reason: 'Failed login attempt recorded',
    };
  }

  /**
   * Handle DDoS attacks
   */
  private async handleDDoS(event: ThreatEvent): Promise<ThreatResponse> {
    // Check request rate from IP
    const recentRequests = await this.getRecentRequestCount(event.ip, 60); // Last 60 seconds

    if (recentRequests > 100) {
      this.blockedIPs.add(event.ip);
      return {
        action: 'BLOCK',
        reason: `DDoS attack detected: ${recentRequests} requests in 60 seconds`,
        duration: this.BLOCK_DURATION,
      };
    }

    if (recentRequests > 50) {
      return {
        action: 'ALERT',
        reason: `High request rate detected: ${recentRequests} requests in 60 seconds`,
      };
    }

    return {
      action: 'LOG',
      reason: 'Request rate within normal limits',
    };
  }

  /**
   * Handle suspicious activity
   */
  private handleSuspiciousActivity(event: ThreatEvent): ThreatResponse {
    const suspicionScore = this.calculateSuspicionScore(event);

    if (suspicionScore >= 80) {
      return {
        action: 'BLOCK',
        reason: `High suspicion score: ${suspicionScore}/100`,
        duration: this.BLOCK_DURATION,
      };
    }

    if (suspicionScore >= 50) {
      return {
        action: 'ALERT',
        reason: `Moderate suspicion score: ${suspicionScore}/100`,
      };
    }

    return {
      action: 'LOG',
      reason: `Low suspicion score: ${suspicionScore}/100`,
    };
  }

  /**
   * Calculate suspicion score
   */
  private calculateSuspicionScore(event: ThreatEvent): number {
    let score = 0;

    // Check threat level
    switch (event.level) {
      case 'CRITICAL': score += 40; break;
      case 'HIGH': score += 30; break;
      case 'MEDIUM': score += 20; break;
      case 'LOW': score += 10; break;
    }

    // Check if IP has previous incidents
    const previousIncidents = this.suspiciousIPs.get(event.ip) || 0;
    score += Math.min(previousIncidents * 10, 30);

    // Check user agent
    if (!event.userAgent || event.userAgent.includes('bot')) {
      score += 20;
    }

    // Check endpoint sensitivity
    const sensitiveEndpoints = ['/api/admin', '/api/users', '/api/payments'];
    if (sensitiveEndpoints.some(ep => event.endpoint.includes(ep))) {
      score += 10;
    }

    return Math.min(score, 100);
  }

  /**
   * Execute automated response
   */
  private async executeResponse(event: ThreatEvent, response: ThreatResponse): Promise<void> {
    switch (response.action) {
      case 'BLOCK':
        await this.blockIP(event.ip, response.duration || this.BLOCK_DURATION);
        await this.sendAlert('CRITICAL', event, response);
        break;
      
      case 'ALERT':
        await this.sendAlert('HIGH', event, response);
        break;
      
      case 'QUARANTINE':
        if (event.userId) {
          await this.quarantineUser(event.userId);
        }
        await this.sendAlert('HIGH', event, response);
        break;
      
      case 'LOG':
        // Already logged in logThreatEvent
        break;
    }
  }

  /**
   * Block IP address
   */
  private async blockIP(ip: string, duration: number): Promise<void> {
    this.blockedIPs.add(ip);
    
    try {
      await prisma.$executeRaw`
        INSERT INTO blocked_ips (ip, reason, expires_at, created_at)
        VALUES (${ip}, 'Automated threat detection', datetime('now', '+${duration} seconds'), CURRENT_TIMESTAMP)
      `;
    } catch (error) {
      console.error('Failed to block IP:', error);
    }

    // Auto-unblock after duration
    setTimeout(() => {
      this.blockedIPs.delete(ip);
    }, duration * 1000);
  }

  /**
   * Quarantine user account
   */
  private async quarantineUser(userId: string): Promise<void> {
    try {
      await prisma.$executeRaw`
        UPDATE users 
        SET is_quarantined = true, quarantined_at = CURRENT_TIMESTAMP
        WHERE id = ${userId}
      `;
    } catch (error) {
      console.error('Failed to quarantine user:', error);
    }
  }

  /**
   * Send security alert
   */
  private async sendAlert(
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
    event: ThreatEvent,
    response: ThreatResponse
  ): Promise<void> {
    console.log(`[SECURITY ALERT - ${severity}]`, {
      type: event.type,
      ip: event.ip,
      endpoint: event.endpoint,
      action: response.action,
      reason: response.reason,
      timestamp: event.timestamp,
    });

    // TODO: Integrate with Slack/Email/SMS for real alerts
  }

  /**
   * Log threat event
   */
  private async logThreatEvent(event: ThreatEvent, response: ThreatResponse): Promise<void> {
    try {
      await prisma.$executeRaw`
        INSERT INTO threat_logs (
          type, level, user_id, ip, user_agent, endpoint, 
          payload, action, reason, created_at
        )
        VALUES (
          ${event.type}, ${event.level}, ${event.userId || null}, ${event.ip},
          ${event.userAgent || null}, ${event.endpoint}, ${JSON.stringify(event.payload || {})},
          ${response.action}, ${response.reason}, CURRENT_TIMESTAMP
        )
      `;
    } catch (error) {
      console.error('Failed to log threat event:', error);
    }
  }

  /**
   * Get recent request count from IP
   */
  private async getRecentRequestCount(ip: string, seconds: number): Promise<number> {
    try {
      const result = await prisma.$queryRaw<any[]>`
        SELECT COUNT(*) as count FROM threat_logs
        WHERE ip = ${ip} 
        AND created_at >= datetime('now', '-${seconds} seconds')
      `;
      return parseInt(result[0]?.count || '0');
    } catch (error) {
      console.error('Failed to get request count:', error);
      return 0;
    }
  }

  /**
   * Check if IP is blocked
   */
  isIPBlocked(ip: string): boolean {
    return this.blockedIPs.has(ip);
  }

  /**
   * Unblock IP address
   */
  async unblockIP(ip: string): Promise<void> {
    this.blockedIPs.delete(ip);
    this.suspiciousIPs.delete(ip);
    
    try {
      await prisma.$executeRaw`
        DELETE FROM blocked_ips WHERE ip = ${ip}
      `;
    } catch (error) {
      console.error('Failed to unblock IP:', error);
    }
  }

  /**
   * Get threat statistics
   */
  async getThreatStats(hours: number = 24): Promise<{
    totalThreats: number;
    blockedIPs: number;
    criticalThreats: number;
    topThreatTypes: Array<{ type: string; count: number }>;
  }> {
    try {
      const stats = await prisma.$queryRaw<any[]>`
        SELECT 
          COUNT(*) as total_threats,
          COUNT(DISTINCT ip) as unique_ips,
          SUM(CASE WHEN level = 'CRITICAL' THEN 1 ELSE 0 END) as critical_threats
        FROM threat_logs
        WHERE created_at >= datetime('now', '-${hours} hours')
      `;

      const topTypes = await prisma.$queryRaw<any[]>`
        SELECT type, COUNT(*) as count
        FROM threat_logs
        WHERE created_at >= datetime('now', '-${hours} hours')
        GROUP BY type
        ORDER BY count DESC
        LIMIT 5
      `;

      return {
        totalThreats: parseInt(stats[0]?.total_threats || '0'),
        blockedIPs: this.blockedIPs.size,
        criticalThreats: parseInt(stats[0]?.critical_threats || '0'),
        topThreatTypes: topTypes.map(t => ({
          type: t.type,
          count: parseInt(t.count),
        })),
      };
    } catch (error) {
      console.error('Failed to get threat stats:', error);
      return {
        totalThreats: 0,
        blockedIPs: 0,
        criticalThreats: 0,
        topThreatTypes: [],
      };
    }
  }

  /**
   * Cleanup task to remove expired blocks
   */
  private startCleanupTask(): void {
    setInterval(async () => {
      try {
        // Remove expired IP blocks from database
        await prisma.$executeRaw`
          DELETE FROM blocked_ips 
          WHERE expires_at < CURRENT_TIMESTAMP
        `;

        // Clear old suspicious IPs (older than 1 hour)
        const oneHourAgo = Date.now() - 3600000;
        for (const [ip, timestamp] of this.suspiciousIPs.entries()) {
          if (timestamp < oneHourAgo) {
            this.suspiciousIPs.delete(ip);
          }
        }
      } catch (error) {
        console.error('Cleanup task failed:', error);
      }
    }, 300000); // Run every 5 minutes
  }
}

export const threatDetector = ThreatDetector.getInstance();
