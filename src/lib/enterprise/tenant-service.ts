import { prisma } from '@/lib/prisma'

export interface CreateTenantInput {
  name: string
  domain: string
  subdomain?: string
  plan?: string
  maxUsers?: number
  contactName?: string
  contactEmail: string
  contactPhone?: string
}

export interface TenantStats {
  activeUsers: number
  totalCourses: number
  storageUsed: number
  bandwidthUsed: number
  completionRate: number
  engagementScore: number
}

export class TenantService {
  async createTenant(input: CreateTenantInput) {
    const tenant = await prisma.$queryRaw`
      INSERT INTO tenants (id, name, domain, subdomain, plan, maxUsers, contactName, contactEmail, contactPhone, createdAt, updatedAt)
      VALUES (${this.generateId()}, ${input.name}, ${input.domain}, ${input.subdomain || null}, 
              ${input.plan || 'basic'}, ${input.maxUsers || 100}, ${input.contactName || null}, 
              ${input.contactEmail}, ${input.contactPhone || null}, datetime('now'), datetime('now'))
    `
    return tenant
  }

  async getTenant(tenantId: string) {
    const tenant = await prisma.$queryRaw`
      SELECT * FROM tenants WHERE id = ${tenantId} AND status = 'active'
    `
    return tenant
  }

  async getTenantByDomain(domain: string) {
    const tenant = await prisma.$queryRaw`
      SELECT * FROM tenants WHERE (domain = ${domain} OR subdomain = ${domain}) AND status = 'active'
    `
    return tenant
  }

  async getTenantStats(tenantId: string): Promise<TenantStats> {
    const usage = await prisma.$queryRaw<any[]>`
      SELECT * FROM tenant_usage WHERE tenantId = ${tenantId} ORDER BY date DESC LIMIT 1
    `

    return {
      activeUsers: usage[0]?.activeUsers || 0,
      totalCourses: usage[0]?.totalCourses || 0,
      storageUsed: usage[0]?.storageUsed || 0,
      bandwidthUsed: usage[0]?.bandwidthUsed || 0,
      completionRate: 0,
      engagementScore: 0
    }
  }

  async updateTenantUsage(tenantId: string, usage: Partial<TenantStats>) {
    await prisma.$executeRaw`
      INSERT INTO tenant_usage (id, tenantId, date, activeUsers, totalCourses, storageUsed, bandwidthUsed)
      VALUES (${this.generateId()}, ${tenantId}, date('now'), ${usage.activeUsers || 0}, 
              ${usage.totalCourses || 0}, ${usage.storageUsed || 0}, ${usage.bandwidthUsed || 0})
      ON CONFLICT(tenantId, date) DO UPDATE SET
        activeUsers = ${usage.activeUsers || 0},
        totalCourses = ${usage.totalCourses || 0},
        storageUsed = ${usage.storageUsed || 0},
        bandwidthUsed = ${usage.bandwidthUsed || 0}
    `
  }

  async addUserToTenant(tenantId: string, userId: string, role: string = 'member') {
    await prisma.$executeRaw`
      INSERT INTO tenant_users (id, tenantId, userId, role, joinedAt)
      VALUES (${this.generateId()}, ${tenantId}, ${userId}, ${role}, datetime('now'))
    `
  }

  async checkTenantAccess(userId: string, tenantId: string): Promise<boolean> {
    const access = await prisma.$queryRaw<any[]>`
      SELECT * FROM tenant_users WHERE userId = ${userId} AND tenantId = ${tenantId} AND status = 'active'
    `
    return access.length > 0
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}

export const tenantService = new TenantService()
