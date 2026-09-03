/**
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
