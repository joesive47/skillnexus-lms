/**
 * Phase 9: Security Scanner Script
 * Run comprehensive security checks
 */

import type { PrismaClient } from '@prisma/client';

interface SecurityIssue {
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category: string;
  description: string;
  recommendation: string;
}

async function runSecurityScan() {
  const [{ prisma }, { threatDetector }] = await Promise.all([
    import('../../src/lib/prisma'),
    import('../../src/lib/security/threat-detector')
  ]);
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
  const dbIssues = await checkDatabaseSecurity(prisma);
  issues.push(...dbIssues);
  score -= dbIssues.length * 10;

  // 3. Check authentication security
  console.log('🔐 Checking authentication security...');
  const authIssues = await checkAuthenticationSecurity(prisma);
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

  process.exit(issues.some(i => i.severity === 'CRITICAL' || i.severity === 'HIGH') ? 1 : 0);
}

function checkEnvironmentVariables(): SecurityIssue[] {
  const issues: SecurityIssue[] = [];

  const authSecret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  if (!authSecret || authSecret.length < 32) {
    issues.push({
      severity: 'CRITICAL',
      category: 'Environment',
      description: 'AUTH_SECRET is missing or too short',
      recommendation: 'Generate a unique secret of at least 32 characters and store it in the deployment secret manager',
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

async function checkDatabaseSecurity(prisma: PrismaClient): Promise<SecurityIssue[]> {
  const issues: SecurityIssue[] = [];

  try {
    const count = await prisma.user.count({ where: { role: { in: ['ADMIN', 'TEACHER'] } } });
    if (count > 0) {
      issues.push({
        severity: process.env.NODE_ENV === 'production' ? 'HIGH' : 'MEDIUM',
        category: 'Authentication',
        description: `MFA enforcement is unavailable for ${count} privileged account(s)`,
        recommendation: 'Keep external production access disabled until privileged-account MFA is implemented and verified',
      });
    }

    // Check for weak passwords (if we had password strength stored)
    // This is a placeholder for actual password strength checking
    
  } catch {
    console.error('Database security check failed');
    issues.push({
      severity: 'HIGH', category: 'Scanner',
      description: 'Database security checks could not complete',
      recommendation: 'Fix database connectivity/schema compatibility; do not treat this scan as passing'
    });
  }

  return issues;
}

async function checkAuthenticationSecurity(prisma: PrismaClient): Promise<SecurityIssue[]> {
  const issues: SecurityIssue[] = [];

  try {
    // Confirm the core account table can be queried. Failed-login auditing is
    // reported separately until a durable security-event store is implemented.
    await prisma.user.count();
    if (process.env.SECURITY_AUDIT_STORE !== 'configured') issues.push({
      severity: 'MEDIUM',
      category: 'Authentication',
      description: 'Durable failed-login audit storage is not configured',
      recommendation: 'Send authentication failures to a centralized append-only audit store'
    });

  } catch {
    console.error('Authentication security check failed');
    issues.push({
      severity: 'HIGH', category: 'Scanner',
      description: 'Authentication security checks could not complete',
      recommendation: 'Fix the scanner before accepting a security gate'
    });
  }

  return issues;
}

function printIssue(issue: SecurityIssue) {
  console.log(`   [${issue.category}] ${issue.description}`);
  console.log(`   → ${issue.recommendation}\n`);
}

// Run the scan
runSecurityScan().catch(error => {
  console.error('Security scan failed:', error instanceof Error ? error.message : 'Unknown error');
  process.exit(1);
});
