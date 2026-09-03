import prisma from './prisma'

export interface AuditLog {
  userId?: string
  action: string
  resource: string
  resourceId?: string
  details?: Record<string, any>
  ipAddress?: string
  userAgent?: string
}

export async function logAuditEvent(event: AuditLog) {
  try {
    // In production, use a dedicated audit table or external service
    console.log('[AUDIT]', {
      timestamp: new Date().toISOString(),
      ...event
    })
    
    // For now, we'll use console logging
    // TODO: Implement proper audit table in database
  } catch (error) {
    console.error('[AUDIT ERROR]', error)
  }
}

export function createAuditLogger(userId?: string, ipAddress?: string, userAgent?: string) {
  return {
    log: (action: string, resource: string, resourceId?: string, details?: Record<string, any>) => {
      return logAuditEvent({
        userId,
        action,
        resource,
        resourceId,
        details,
        ipAddress,
        userAgent
      })
    }
  }
}