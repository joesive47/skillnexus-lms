/**
 * Development Security Configuration
 * ปิดใช้งาน security features ที่ไม่จำเป็นใน development
 */

export const DEV_SECURITY_CONFIG = {
  // ปิด threat detection ใน development
  THREAT_DETECTION_ENABLED: process.env.NODE_ENV === 'production',
  
  // ลด audit logging ใน development
  AUDIT_LOGGING_ENABLED: process.env.NODE_ENV === 'production',
  
  // ลด rate limiting ใน development
  RATE_LIMITING: {
    ENABLED: true,
    MAX_REQUESTS: process.env.NODE_ENV === 'production' ? 100 : 1000,
    WINDOW_MS: 60000
  },
  
  // ปิด encryption ใน development (ใช้ plain text)
  ENCRYPTION_ENABLED: process.env.NODE_ENV === 'production',
  
  // ลด MFA requirements ใน development
  MFA_REQUIRED: process.env.NODE_ENV === 'production',
  
  // ปิด IP blocking ใน development
  IP_BLOCKING_ENABLED: process.env.NODE_ENV === 'production',
  
  // ลด session validation ใน development
  SESSION_VALIDATION: {
    FINGERPRINT_CHECK: process.env.NODE_ENV === 'production',
    DEVICE_TRUST: process.env.NODE_ENV === 'production'
  }
}

export function isSecurityFeatureEnabled(feature: keyof typeof DEV_SECURITY_CONFIG): boolean {
  return DEV_SECURITY_CONFIG[feature] as boolean
}

export default DEV_SECURITY_CONFIG