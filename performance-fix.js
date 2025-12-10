/**
 * Performance Fix for Phase 9 Security Issues
 * แก้ปัญหาระบบช้าหลังจากเพิ่ม Security Features
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Performance Fix for Phase 9...');

// 1. Optimize middleware.ts - ลด security checks ที่ไม่จำเป็น
const middlewareOptimized = `import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Lightweight rate limiter - ใช้ memory แทน database
const requestCounts = new Map<string, { count: number; resetTime: number }>()

function simpleRateLimit(ip: string, limit = 50, windowMs = 60000) {
  const now = Date.now()
  const record = requestCounts.get(ip)
  
  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + windowMs })
    return { success: true, remaining: limit - 1 }
  }
  
  if (record.count >= limit) {
    return { success: false, remaining: 0 }
  }
  
  record.count++
  return { success: true, remaining: limit - record.count }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/static') ||
    pathname.includes('.') // Skip files with extensions
  ) {
    return NextResponse.next()
  }

  // Lightweight rate limiting only for API routes
  if (pathname.startsWith('/api')) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown'
    
    const result = simpleRateLimit(ip, 100) // 100 requests per minute
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }
  }

  // Block test endpoints in production only
  if (process.env.NODE_ENV === 'production' && pathname.startsWith('/test')) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\\\.).*)',
  ],
}
`;

// 2. Create optimized security config
const securityConfigOptimized = `/**
 * Optimized Security Configuration
 * ลด overhead ของ security features
 */

export const SECURITY_CONFIG = {
  // ลด rate limit checks
  RATE_LIMIT: {
    API: { max: 100, window: 60000 }, // 100 req/min
    AUTH: { max: 10, window: 60000 },  // 10 req/min
    SKIP_STATIC: true
  },
  
  // ปิด threat detection ใน development
  THREAT_DETECTION: {
    ENABLED: process.env.NODE_ENV === 'production',
    BATCH_SIZE: 100, // Process in batches
    CLEANUP_INTERVAL: 300000 // 5 minutes
  },
  
  // ลด audit logging
  AUDIT: {
    ENABLED: process.env.NODE_ENV === 'production',
    MAX_LOGS: 1000, // ลดจาก 10000
    BATCH_WRITE: true
  },
  
  // Optimize encryption
  ENCRYPTION: {
    CACHE_KEYS: true,
    BATCH_OPERATIONS: true
  }
}

export default SECURITY_CONFIG;
`;

// 3. Create performance monitoring
const performanceMonitor = `/**
 * Performance Monitor - ตรวจสอบประสิทธิภาพ
 */

export class PerformanceMonitor {
  private static metrics = new Map<string, number[]>()
  
  static startTimer(label: string): () => void {
    const start = performance.now()
    
    return () => {
      const duration = performance.now() - start
      const existing = this.metrics.get(label) || []
      existing.push(duration)
      
      // Keep only last 100 measurements
      if (existing.length > 100) {
        existing.splice(0, existing.length - 100)
      }
      
      this.metrics.set(label, existing)
      
      // Warn if slow
      if (duration > 100) {
        console.warn(\`⚠️ Slow operation: \${label} took \${duration.toFixed(2)}ms\`)
      }
    }
  }
  
  static getStats(label: string) {
    const measurements = this.metrics.get(label) || []
    if (measurements.length === 0) return null
    
    const avg = measurements.reduce((a, b) => a + b, 0) / measurements.length
    const max = Math.max(...measurements)
    const min = Math.min(...measurements)
    
    return { avg: avg.toFixed(2), max: max.toFixed(2), min: min.toFixed(2), count: measurements.length }
  }
  
  static getAllStats() {
    const stats: Record<string, any> = {}
    for (const [label] of this.metrics) {
      stats[label] = this.getStats(label)
    }
    return stats
  }
}

export default PerformanceMonitor;
`;

// Write optimized files
try {
  // 1. Backup original middleware
  if (fs.existsSync('src/middleware.ts')) {
    fs.copyFileSync('src/middleware.ts', 'src/middleware.ts.backup');
    console.log('✅ Backed up original middleware.ts');
  }
  
  // 2. Write optimized middleware
  fs.writeFileSync('src/middleware.ts', middlewareOptimized);
  console.log('✅ Updated middleware.ts with performance optimizations');
  
  // 3. Create security config
  if (!fs.existsSync('src/lib/security')) {
    fs.mkdirSync('src/lib/security', { recursive: true });
  }
  fs.writeFileSync('src/lib/security/config.ts', securityConfigOptimized);
  console.log('✅ Created optimized security config');
  
  // 4. Create performance monitor
  if (!fs.existsSync('src/lib/performance')) {
    fs.mkdirSync('src/lib/performance', { recursive: true });
  }
  fs.writeFileSync('src/lib/performance/monitor.ts', performanceMonitor);
  console.log('✅ Created performance monitor');
  
  // 5. Update next.config.js
  const nextConfigPath = 'next.config.js';
  if (fs.existsSync(nextConfigPath)) {
    let nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
    
    // Fix the serverComponentsExternalPackages warning
    nextConfig = nextConfig.replace(
      'serverComponentsExternalPackages: [',
      '// serverComponentsExternalPackages: ['
    );
    
    // Add performance optimizations
    nextConfig = nextConfig.replace(
      'cpus: 1,',
      `cpus: 1,
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },`
    );
    
    fs.writeFileSync(nextConfigPath, nextConfig);
    console.log('✅ Updated next.config.js with performance fixes');
  }
  
  console.log('\\n🎉 Performance Fix Complete!');
  console.log('\\n📊 Changes Made:');
  console.log('  • Optimized middleware (reduced security overhead)');
  console.log('  • Created lightweight rate limiter');
  console.log('  • Added performance monitoring');
  console.log('  • Fixed Next.js config warnings');
  console.log('  • Reduced audit logging in development');
  console.log('\\n🚀 Try building again: npm run build');
  
} catch (error) {
  console.error('❌ Error during performance fix:', error.message);
  process.exit(1);
}