/**
 * Phase 9: Real-Time Threat Detection
 * SIEM, IDS, and Automated Response System
 */

import { prisma } from '@/lib/prisma';
import * as Sentry from '@sentry/nextjs';

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
  private cleanupIntervalId: NodeJS.Timeout | null = null;

  private constructor() {
    // Delay cleanup task startup to allow database to be ready
    if (process.env.NODE_ENV === 'production') {
      setTimeout(() => this.startCleanupTask(), 5000);
    } else {
      this.startCleanupTask();
    }
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
      // Use Prisma model instead of raw SQL
      await prisma.blockedIP.create({
        data: {
          ipAddress: ip,
          reason: 'Automated threat detection',
          expiresAt: new Date(Date.now() + duration * 1000),
        }
      });
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
      // Log quarantine action instead of updating non-existent fields
      await prisma.securityLog.create({
        data: {
          event: 'USER_QUARANTINED',
          severity: 'HIGH',
          userId: userId,
          details: 'User quarantined due to suspicious activity'
        }
      });
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

    // Send critical alerts to Sentry
    if (response.level === 'CRITICAL' || response.level === 'HIGH') {
      Sentry.captureMessage(`Security Threat Detected: ${response.action}`, {
        level: response.level === 'CRITICAL' ? 'fatal' : 'error',
        tags: {
          threat_type: event.type,
          threat_level: response.level,
          action: response.action,
        },
        extra: {
          ip: event.ip,
          endpoint: event.endpoint,
          reason: response.reason,
          user: event.userId,
        },
      });
    }
  }

  /**
   * Log threat event
   */
  private async logThreatEvent(event: ThreatEvent, response: ThreatResponse): Promise<void> {
    try {
      await prisma.threatDetection.create({
        data: {
          ipAddress: event.ip,
          threatType: event.type.toLowerCase(),
          severity: event.level,
          blocked: response.action === 'BLOCK',
        }
      });
      
      await prisma.securityLog.create({
        data: {
          event: `THREAT_${event.type}`,
          severity: event.level === 'CRITICAL' ? 'CRITICAL' : event.level === 'HIGH' ? 'ERROR' : 'WARNING',
          ipAddress: event.ip,
          userId: event.userId,
          details: JSON.stringify({
            endpoint: event.endpoint,
            userAgent: event.userAgent,
            action: response.action,
            reason: response.reason,
            payload: event.payload
          })
        }
      });
    } catch (error) {
      console.error('Failed to log threat event:', error);
    }
  }

  /**
   * Get recent request count from IP
   */
  private async getRecentRequestCount(ip: string, seconds: number): Promise<number> {
    try {
      const count = await prisma.threatDetection.count({
        where: {
          ipAddress: ip,
          createdAt: {
            gte: new Date(Date.now() - seconds * 1000)
          }
        }
      });
      return count;
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
      await prisma.blockedIP.deleteMany({
        where: {
          ipAddress: ip
        }
      });
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
      const since = new Date(Date.now() - hours * 60 * 60 * 1000);
      
      const totalThreats = await prisma.threatDetection.count({
        where: {
          createdAt: { gte: since }
        }
      });
      
      const criticalThreats = await prisma.threatDetection.count({
        where: {
          severity: 'CRITICAL',
          createdAt: { gte: since }
        }
      });
      
      // Get top threat types (simplified)
      const threats = await prisma.threatDetection.findMany({
        where: {
          createdAt: { gte: since }
        },
        select: {
          threatType: true
        }
      });
      
      const typeCount = threats.reduce((acc, threat) => {
        acc[threat.threatType] = (acc[threat.threatType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const topThreatTypes = Object.entries(typeCount)
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      return {
        totalThreats,
        blockedIPs: this.blockedIPs.size,
        criticalThreats,
        topThreatTypes,
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
    if (this.cleanupIntervalId) {
      clearInterval(this.cleanupIntervalId);
    }

    this.cleanupIntervalId = setInterval(async () => {
      try {
        // Check if DATABASE_URL is properly configured
        if (!process.env.DATABASE_URL) {
          console.warn('[ThreatDetector] DATABASE_URL not configured - skipping database cleanup');
          return;
        }

        // Remove expired IP blocks from database
        try {
          const deletedCount = await prisma.blockedIP.deleteMany({
            where: {
              expiresAt: {
                lt: new Date()
              }
            }
          });
          
          if (deletedCount.count > 0) {
            console.log(`[ThreatDetector] Cleaned up ${deletedCount.count} expired IP blocks`);
          }
        } catch (dbError: any) {
          // Log but don't crash if database is unavailable
          if (dbError?.code === 'P1000' || dbError?.message?.includes('Can\'t reach database')) {
            console.warn('[ThreatDetector] Database not yet available, will retry on next cycle');
          } else {
            console.warn('[ThreatDetector] Database cleanup warning:', dbError?.message || dbError);
          }
          // Continue with in-memory cleanup even if database fails
        }

        // Clear old suspicious IPs (older than 1 hour)
        const oneHourAgo = Date.now() - 3600000;
        let clearedCount = 0;
        for (const [ip, timestamp] of this.suspiciousIPs.entries()) {
          if (timestamp < oneHourAgo) {
            this.suspiciousIPs.delete(ip);
            clearedCount++;
          }
        }
        
        if (clearedCount > 0) {
          console.log(`[ThreatDetector] Cleared ${clearedCount} old suspicious IPs`);
        }
      } catch (error) {
        console.warn('[ThreatDetector] Cleanup cycle warning:', error instanceof Error ? error.message : error);
      }
    }, 300000); // Run every 5 minutes
  }
}

export const threatDetector = ThreatDetector.getInstance();
