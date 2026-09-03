import * as fs from 'fs';
import * as path from 'path';
import { z } from 'zod';

/**
 * Environment Security Validator
 * 
 * Validates and audits environment variables to prevent security issues
 */

// Define required environment variables schema
const EnvironmentSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required').regex(/^postgresql:\/\//, 'DATABASE_URL must be a valid PostgreSQL connection string'),
  
  // Authentication
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),
  NEXTAUTH_URL: z.string().url('NEXTAUTH_URL must be a valid URL'),
  
  // Encryption
  ENCRYPTION_KEY: z.string().length(32, 'ENCRYPTION_KEY must be exactly 32 characters'),
  
  // Security
  ALLOWED_ORIGINS: z.string().min(1, 'ALLOWED_ORIGINS is required'),
  
  // Optional but should be validated if present
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  REDIS_URL: z.string().url().optional().or(z.literal('')),
  RESEND_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().optional(),
  S3_BUCKET: z.string().optional(),
  AWS_S3_BACKUP_BUCKET: z.string().optional(),
  SENTRY_DSN: z.string().url().optional().or(z.literal('')),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional().or(z.literal('')),
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).optional(),
});

// Dangerous patterns to detect
const SECURITY_PATTERNS = {
  defaultSecrets: [
    'your-secret-key-here',
    'your-google-client-id',
    'your-sentry-dsn',
    'localhost',
    'example.com',
    'test-key',
    'demo-key',
  ],
  weakPasswords: /password123|admin|root|qwerty|12345/i,
  exposedKeys: /sk_live|pk_live|AKIA|AIza/,
  httpUrls: /http:\/\/(?!localhost)/,
};

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  criticalIssues: string[];
  recommendations: string[];
}

export function validateEnvironment(): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    criticalIssues: [],
    recommendations: [],
  };

  try {
    // Check if .env file exists
    const envPath = path.join(process.cwd(), '.env');
    if (!fs.existsSync(envPath)) {
      result.errors.push('.env file not found');
      result.isValid = false;
      return result;
    }

    // Validate against schema
    try {
      EnvironmentSchema.parse(process.env);
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          result.errors.push(`${err.path.join('.')}: ${err.message}`);
        });
        result.isValid = false;
      }
    }

    // Check for default/example values
    SECURITY_PATTERNS.defaultSecrets.forEach((pattern) => {
      Object.entries(process.env).forEach(([key, value]) => {
        if (value?.includes(pattern)) {
          result.criticalIssues.push(
            `🚨 CRITICAL: ${key} contains default/example value: "${pattern}"`
          );
          result.isValid = false;
        }
      });
    });

    // Check for production keys in development
    if (process.env.NODE_ENV !== 'production') {
      if (process.env.STRIPE_SECRET_KEY?.startsWith('sk_live')) {
        result.criticalIssues.push(
          '🚨 CRITICAL: Production Stripe key detected in non-production environment'
        );
      }
      if (process.env.DATABASE_URL?.includes('prod')) {
        result.warnings.push(
          '⚠️  WARNING: Production database URL detected in non-production environment'
        );
      }
    }

    // Check for HTTP URLs (should be HTTPS)
    Object.entries(process.env).forEach(([key, value]) => {
      if (value && SECURITY_PATTERNS.httpUrls.test(value)) {
        result.warnings.push(
          `⚠️  WARNING: ${key} uses HTTP instead of HTTPS: ${value}`
        );
      }
    });

    // Check NEXTAUTH_SECRET strength
    const nextAuthSecret = process.env.NEXTAUTH_SECRET;
    if (nextAuthSecret && nextAuthSecret.length < 32) {
      result.criticalIssues.push(
        '🚨 CRITICAL: NEXTAUTH_SECRET is too short (minimum 32 characters)'
      );
      result.isValid = false;
    }

    // Check ENCRYPTION_KEY format
    const encryptionKey = process.env.ENCRYPTION_KEY;
    if (encryptionKey && encryptionKey.length !== 32) {
      result.criticalIssues.push(
        '🚨 CRITICAL: ENCRYPTION_KEY must be exactly 32 characters'
      );
      result.isValid = false;
    }

    // Check for wildcard ALLOWED_ORIGINS
    const allowedOrigins = process.env.ALLOWED_ORIGINS;
    if (allowedOrigins?.includes('*')) {
      result.criticalIssues.push(
        '🚨 CRITICAL: ALLOWED_ORIGINS should not contain wildcard (*)'
      );
      result.isValid = false;
    }

    // Check DATABASE_URL for sensitive info exposure
    const databaseUrl = process.env.DATABASE_URL;
    if (databaseUrl && !databaseUrl.includes('localhost')) {
      if (databaseUrl.includes('@') && !databaseUrl.startsWith('postgresql://')) {
        result.warnings.push(
          '⚠️  WARNING: DATABASE_URL format may expose credentials'
        );
      }
    }

    // Recommendations
    if (!process.env.REDIS_URL) {
      result.recommendations.push(
        '💡 RECOMMENDATION: Setup Redis for caching to improve performance'
      );
    }
    if (!process.env.SENTRY_DSN) {
      result.recommendations.push(
        '💡 RECOMMENDATION: Setup Sentry for error monitoring'
      );
    }
    if (!process.env.AWS_S3_BACKUP_BUCKET) {
      result.recommendations.push(
        '💡 RECOMMENDATION: Setup S3 backup bucket for database backups'
      );
    }
    if (process.env.LOG_LEVEL === 'debug' && process.env.NODE_ENV === 'production') {
      result.warnings.push(
        '⚠️  WARNING: LOG_LEVEL is set to debug in production'
      );
    }

    // Check for exposed secrets in logs
    const hasDebugMode = process.env.LOG_LEVEL === 'debug';
    if (hasDebugMode) {
      result.warnings.push(
        '⚠️  WARNING: Debug mode enabled - be careful not to log sensitive data'
      );
    }

  } catch (error) {
    result.errors.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    result.isValid = false;
  }

  return result;
}

export function generateSecureKey(length: number = 32): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  let key = '';
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  
  for (let i = 0; i < length; i++) {
    key += charset[randomValues[i] % charset.length];
  }
  
  return key;
}

export function auditEnvironmentFile(envFilePath: string): {
  exposedSecrets: string[];
  recommendations: string[];
} {
  const result = {
    exposedSecrets: [] as string[],
    recommendations: [] as string[],
  };

  try {
    const content = fs.readFileSync(envFilePath, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // Check for secrets that might be committed
      if (SECURITY_PATTERNS.exposedKeys.test(line)) {
        result.exposedSecrets.push(
          `Line ${index + 1}: Potential exposed API key detected`
        );
      }

      // Check for weak passwords
      if (SECURITY_PATTERNS.weakPasswords.test(line)) {
        result.exposedSecrets.push(
          `Line ${index + 1}: Weak password pattern detected`
        );
      }

      // Check for default values
      SECURITY_PATTERNS.defaultSecrets.forEach((pattern) => {
        if (line.includes(pattern)) {
          result.exposedSecrets.push(
            `Line ${index + 1}: Default/example value detected: "${pattern}"`
          );
        }
      });

      // Check for commented secrets (still dangerous)
      if (line.trim().startsWith('#') && line.includes('=')) {
        const uncommented = line.replace(/^#\s*/, '');
        if (SECURITY_PATTERNS.exposedKeys.test(uncommented)) {
          result.recommendations.push(
            `Line ${index + 1}: Commented line still contains API key pattern - consider removing`
          );
        }
      }
    });

  } catch (error) {
    result.exposedSecrets.push(
      `Error reading file: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }

  return result;
}

// CLI tool
if (require.main === module) {
  console.log('🔐 Environment Security Audit\n');
  console.log('=' .repeat(50));
  console.log('');

  // Validate current environment
  const validation = validateEnvironment();

  if (validation.criticalIssues.length > 0) {
    console.log('🚨 CRITICAL ISSUES:\n');
    validation.criticalIssues.forEach((issue) => console.log(issue));
    console.log('');
  }

  if (validation.errors.length > 0) {
    console.log('❌ ERRORS:\n');
    validation.errors.forEach((error) => console.log(`  - ${error}`));
    console.log('');
  }

  if (validation.warnings.length > 0) {
    console.log('⚠️  WARNINGS:\n');
    validation.warnings.forEach((warning) => console.log(`  ${warning}`));
    console.log('');
  }

  if (validation.recommendations.length > 0) {
    console.log('💡 RECOMMENDATIONS:\n');
    validation.recommendations.forEach((rec) => console.log(`  ${rec}`));
    console.log('');
  }

  // Audit .env file
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const audit = auditEnvironmentFile(envPath);
    
    if (audit.exposedSecrets.length > 0) {
      console.log('🔍 EXPOSED SECRETS IN .env FILE:\n');
      audit.exposedSecrets.forEach((secret) => console.log(`  - ${secret}`));
      console.log('');
    }

    if (audit.recommendations.length > 0) {
      console.log('📝 FILE RECOMMENDATIONS:\n');
      audit.recommendations.forEach((rec) => console.log(`  - ${rec}`));
      console.log('');
    }
  }

  console.log('=' .repeat(50));
  
  if (validation.isValid && validation.criticalIssues.length === 0) {
    console.log('✅ Environment configuration is secure!');
    process.exit(0);
  } else {
    console.log('❌ Environment configuration has security issues!');
    console.log('');
    console.log('🔧 Quick fixes:');
    console.log('  1. Generate new secrets: node scripts/env-validator.ts --generate');
    console.log('  2. Rotate API keys that may be exposed');
    console.log('  3. Review and update .env file');
    console.log('  4. Never commit .env to version control');
    process.exit(1);
  }
}
