import { prisma } from '@/lib/prisma'

export interface AuditLogInput {
  tenantId?: string
  userId?: string
  action: string
  resource: string
  resourceId?: string
  details?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  status?: string
}

export class AuditService {
  async log(input: AuditLogInput) {
    await prisma.$executeRaw`
      INSERT INTO audit_logs (id, tenantId, userId, action, resource, resourceId, details, ipAddress, userAgent, status, createdAt)
      VALUES (${this.generateId()}, ${input.tenantId || null}, ${input.userId || null}, 
              ${input.action}, ${input.resource}, ${input.resourceId || null}, 
              ${input.details ? JSON.stringify(input.details) : null}, 
              ${input.ipAddress || null}, ${input.userAgent || null}, 
              ${input.status || 'success'}, datetime('now'))
    `
  }

  async getAuditLogs(tenantId: string, limit: number = 100) {
    return await prisma.$queryRaw`
      SELECT * FROM audit_logs 
      WHERE tenantId = ${tenantId} 
      ORDER BY createdAt DESC 
      LIMIT ${limit}
    `
  }

  async getUserActivity(userId: string, limit: number = 50) {
    return await prisma.$queryRaw`
      SELECT * FROM audit_logs 
      WHERE userId = ${userId} 
      ORDER BY createdAt DESC 
      LIMIT ${limit}
    `
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}

export const auditService = new AuditService()
