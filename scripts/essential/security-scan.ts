/**
 * Phase 9: Security Scanner Script
 * Run comprehensive security checks
 */

import { prisma } from '../../src/lib/prisma';
import { threatDetector } from '../../src/lib/security/threat-detector';

interface SecurityIssue {
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category: string;
  description: string;
  recommendation: string;
}

async function runSecurityScan() {
  console.log('🛡️  Starting Security Scan...\n');
  
  const issues: SecurityIssue[] = [];
  let score = 100;

  // 1. Check environment variables
  console.log('📋 Checking environment variables...');
  const envIssues = checkEnvironmentVariables();
  issues.push(...envIssues);
  score -= envIssues.length * 5;

  // 2. Check database security
  console.log('🗄️  Checking database security...');
  const dbIssues = await checkDatabaseSecurity();
  issues.push(...dbIssues);
  score -= dbIssues.length * 10;

  // 3. Check authentication security
  console.log('🔐 Checking authentication security...');
  const authIssues = await checkAuthenticationSecurity();
  issues.push(...authIssues);
  score -= authIssues.length * 15;

  // 4. Check threat detection status
  console.log('🚨 Checking threat detection...');
  const threatStats = await threatDetector.getThreatStats(24);
  console.log(`   - Total threats (24h): ${threatStats.totalThreats}`);
  console.log(`   - Blocked IPs: ${threatStats.blockedIPs}`);
  console.log(`   - Critical threats: ${threatStats.criticalThreats}`);

  // 5. Generate report
  console.log('\n' + '='.repeat(60));
  console.log('🛡️  SECURITY SCAN REPORT');
  console.log('='.repeat(60));
  console.log(`\n📊 Security Score: ${Math.max(score, 0)}/100`);
  
  if (issues.length === 0) {
    console.log('\n✅ No security issues found!');
  } else {
    console.log(`\n⚠️  Found ${issues.length} security issues:\n`);
    
    const critical = issues.filter(i => i.severity === 'CRITICAL');
    const high = issues.filter(i => i.severity === 'HIGH');
    const medium = issues.filter(i => i.severity === 'MEDIUM');
    const low = issues.filter(i => i.severity === 'LOW');

    if (critical.length > 0) {
      console.log(`🔴 CRITICAL (${critical.length}):`);
      critical.forEach(issue => printIssue(issue));
    }

    if (high.length > 0) {
      console.log(`\n🟠 HIGH (${high.length}):`);
      high.forEach(issue => printIssue(issue));
    }

    if (medium.length > 0) {
      console.log(`\n🟡 MEDIUM (${medium.length}):`);
      medium.forEach(issue => printIssue(issue));
    }

    if (low.length > 0) {
      console.log(`\n🟢 LOW (${low.length}):`);
      low.forEach(issue => printIssue(issue));
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ Security scan completed!\n');

  process.exit(issues.filter(i => i.severity === 'CRITICAL').length > 0 ? 1 : 0);
}

function checkEnvironmentVariables(): SecurityIssue[] {
  const issues: SecurityIssue[] = [];

  if (!process.env.NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET.length < 32) {
    issues.push({
      severity: 'CRITICAL',
      category: 'Environment',
      description: 'NEXTAUTH_SECRET is missing or too short',
      recommendation: 'Generate a strong secret: openssl rand -base64 32',
    });
  }

  if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL?.includes('postgresql')) {
    issues.push({
      severity: 'HIGH',
      category: 'Database',
      description: 'Using SQLite in production',
      recommendation: 'Switch to PostgreSQL for production',
    });
  }

  if (!process.env.REDIS_URL) {
    issues.push({
      severity: 'MEDIUM',
      category: 'Caching',
      description: 'Redis is not configured',
      recommendation: 'Setup Redis for better performance and security',
    });
  }

  return issues;
}

async function checkDatabaseSecurity(): Promise<SecurityIssue[]> {
  const issues: SecurityIssue[] = [];

  try {
    // Check for users without MFA
    const usersWithoutMFA = await prisma.$queryRaw<any[]>`
      SELECT COUNT(*) as count FROM users u
      WHERE u.role IN ('ADMIN', 'TEACHER')
      AND NOT EXISTS (
        SELECT 1 FROM mfa_settings m 
        WHERE m.user_id = u.id AND m.is_enabled = 1
      )
    `;

    const count = parseInt(usersWithoutMFA[0]?.count || '0');
    if (count > 0) {
      issues.push({
        severity: 'HIGH',
        category: 'Authentication',
        description: `${count} admin/teacher accounts without MFA`,
        recommendation: 'Enable MFA for all privileged accounts',
      });
    }

    // Check for weak passwords (if we had password strength stored)
    // This is a placeholder for actual password strength checking
    
  } catch (error) {
    console.error('Database security check failed:', error);
  }

  return issues;
}

async function checkAuthenticationSecurity(): Promise<SecurityIssue[]> {
  const issues: SecurityIssue[] = [];

  try {
    // Check for recent failed login attempts
    const recentFailures = await prisma.$queryRaw<any[]>`
      SELECT COUNT(*) as count FROM mfa_logs
      WHERE success = 0 
      AND created_at >= datetime('now', '-1 hour')
    `;

    const failureCount = parseInt(recentFailures[0]?.count || '0');
    if (failureCount > 50) {
      issues.push({
        severity: 'HIGH',
        category: 'Authentication',
        description: `${failureCount} failed login attempts in the last hour`,
        recommendation: 'Investigate potential brute force attack',
      });
    }

  } catch (error) {
    console.error('Authentication security check failed:', error);
  }

  return issues;
}

function printIssue(issue: SecurityIssue) {
  console.log(`   [${issue.category}] ${issue.description}`);
  console.log(`   → ${issue.recommendation}\n`);
}

// Run the scan
runSecurityScan().catch(console.error);
