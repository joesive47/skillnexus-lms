/**
 * Phase 9: Multi-Factor Authentication Service
 * Support TOTP, SMS, Email, and Biometric authentication
 */

import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

export type MFAMethod = 'TOTP' | 'SMS' | 'EMAIL' | 'BIOMETRIC';

export interface MFASetupResult {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export interface MFAVerifyResult {
  success: boolean;
  method: MFAMethod;
  timestamp: Date;
}

export class MFAService {
  private static instance: MFAService;
  private readonly APP_NAME = 'SkillNexus LMS';

  private constructor() {
    // Configure TOTP
    authenticator.options = {
      window: 1, // Allow 1 step before/after
      step: 30, // 30 seconds validity
    };
  }

  static getInstance(): MFAService {
    if (!MFAService.instance) {
      MFAService.instance = new MFAService();
    }
    return MFAService.instance;
  }

  /**
   * Setup TOTP (Time-based One-Time Password)
   */
  async setupTOTP(userId: string, email: string): Promise<MFASetupResult> {
    try {
      // Generate secret
      const secret = authenticator.generateSecret();

      // Generate OTP Auth URL
      const otpauth = authenticator.keyuri(email, this.APP_NAME, secret);

      // Generate QR Code
      const qrCode = await QRCode.toDataURL(otpauth);

      // Generate backup codes
      const backupCodes = this.generateBackupCodes(8);

      // Store in database
      await prisma.$executeRaw`
        INSERT INTO mfa_settings (user_id, method, secret, backup_codes, is_enabled)
        VALUES (${userId}, 'TOTP', ${secret}, ${JSON.stringify(backupCodes)}, false)
        ON CONFLICT (user_id, method) 
        DO UPDATE SET secret = ${secret}, backup_codes = ${JSON.stringify(backupCodes)}, updated_at = CURRENT_TIMESTAMP
      `;

      return {
        secret,
        qrCode,
        backupCodes,
      };
    } catch (error) {
      console.error('TOTP setup failed:', error);
      throw new Error('Failed to setup TOTP authentication');
    }
  }

  /**
   * Verify TOTP code
   */
  async verifyTOTP(userId: string, token: string): Promise<MFAVerifyResult> {
    try {
      // Get user's TOTP secret
      const mfaSettings = await prisma.$queryRaw<any[]>`
        SELECT secret, backup_codes FROM mfa_settings 
        WHERE user_id = ${userId} AND method = 'TOTP' AND is_enabled = true
      `;

      if (!mfaSettings || mfaSettings.length === 0) {
        return { success: false, method: 'TOTP', timestamp: new Date() };
      }

      const { secret, backup_codes } = mfaSettings[0];

      // Verify TOTP token
      const isValid = authenticator.verify({ token, secret });

      if (isValid) {
        // Log successful verification
        await this.logMFAAttempt(userId, 'TOTP', true);
        return { success: true, method: 'TOTP', timestamp: new Date() };
      }

      // Check backup codes
      const backupCodesList = JSON.parse(backup_codes || '[]');
      const backupCodeIndex = backupCodesList.indexOf(token);

      if (backupCodeIndex !== -1) {
        // Remove used backup code
        backupCodesList.splice(backupCodeIndex, 1);
        await prisma.$executeRaw`
          UPDATE mfa_settings 
          SET backup_codes = ${JSON.stringify(backupCodesList)}, updated_at = CURRENT_TIMESTAMP
          WHERE user_id = ${userId} AND method = 'TOTP'
        `;

        await this.logMFAAttempt(userId, 'TOTP', true, 'backup_code');
        return { success: true, method: 'TOTP', timestamp: new Date() };
      }

      // Log failed attempt
      await this.logMFAAttempt(userId, 'TOTP', false);
      return { success: false, method: 'TOTP', timestamp: new Date() };
    } catch (error) {
      console.error('TOTP verification failed:', error);
      return { success: false, method: 'TOTP', timestamp: new Date() };
    }
  }

  /**
   * Enable MFA for user
   */
  async enableMFA(userId: string, method: MFAMethod, verificationCode: string): Promise<boolean> {
    try {
      // Verify the code first
      const verification = await this.verifyTOTP(userId, verificationCode);
      
      if (!verification.success) {
        return false;
      }

      // Enable MFA
      await prisma.$executeRaw`
        UPDATE mfa_settings 
        SET is_enabled = true, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ${userId} AND method = ${method}
      `;

      return true;
    } catch (error) {
      console.error('Failed to enable MFA:', error);
      return false;
    }
  }

  /**
   * Disable MFA for user
   */
  async disableMFA(userId: string, method: MFAMethod): Promise<boolean> {
    try {
      await prisma.$executeRaw`
        UPDATE mfa_settings 
        SET is_enabled = false, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ${userId} AND method = ${method}
      `;
      return true;
    } catch (error) {
      console.error('Failed to disable MFA:', error);
      return false;
    }
  }

  /**
   * Check if user has MFA enabled
   */
  async isMFAEnabled(userId: string): Promise<boolean> {
    try {
      const result = await prisma.$queryRaw<any[]>`
        SELECT COUNT(*) as count FROM mfa_settings 
        WHERE user_id = ${userId} AND is_enabled = true
      `;
      return result[0]?.count > 0;
    } catch (error) {
      console.error('Failed to check MFA status:', error);
      return false;
    }
  }

  /**
   * Get user's MFA methods
   */
  async getUserMFAMethods(userId: string): Promise<MFAMethod[]> {
    try {
      const methods = await prisma.$queryRaw<any[]>`
        SELECT method FROM mfa_settings 
        WHERE user_id = ${userId} AND is_enabled = true
      `;
      return methods.map(m => m.method as MFAMethod);
    } catch (error) {
      console.error('Failed to get MFA methods:', error);
      return [];
    }
  }

  /**
   * Generate backup codes
   */
  private generateBackupCodes(count: number = 8): string[] {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      const code = crypto.randomBytes(4).toString('hex').toUpperCase();
      codes.push(`${code.slice(0, 4)}-${code.slice(4, 8)}`);
    }
    return codes;
  }

  /**
   * Log MFA attempt
   */
  private async logMFAAttempt(
    userId: string,
    method: MFAMethod,
    success: boolean,
    note?: string
  ): Promise<void> {
    try {
      await prisma.$executeRaw`
        INSERT INTO mfa_logs (user_id, method, success, note, created_at)
        VALUES (${userId}, ${method}, ${success}, ${note || null}, CURRENT_TIMESTAMP)
      `;
    } catch (error) {
      console.error('Failed to log MFA attempt:', error);
    }
  }

  /**
   * Get MFA statistics for user
   */
  async getMFAStats(userId: string): Promise<{
    totalAttempts: number;
    successfulAttempts: number;
    failedAttempts: number;
    lastSuccess: Date | null;
  }> {
    try {
      const stats = await prisma.$queryRaw<any[]>`
        SELECT 
          COUNT(*) as total_attempts,
          SUM(CASE WHEN success = true THEN 1 ELSE 0 END) as successful_attempts,
          SUM(CASE WHEN success = false THEN 1 ELSE 0 END) as failed_attempts,
          MAX(CASE WHEN success = true THEN created_at ELSE NULL END) as last_success
        FROM mfa_logs
        WHERE user_id = ${userId}
      `;

      const result = stats[0] || {};
      return {
        totalAttempts: parseInt(result.total_attempts || '0'),
        successfulAttempts: parseInt(result.successful_attempts || '0'),
        failedAttempts: parseInt(result.failed_attempts || '0'),
        lastSuccess: result.last_success ? new Date(result.last_success) : null,
      };
    } catch (error) {
      console.error('Failed to get MFA stats:', error);
      return {
        totalAttempts: 0,
        successfulAttempts: 0,
        failedAttempts: 0,
        lastSuccess: null,
      };
    }
  }
}

export const mfaService = MFAService.getInstance();
