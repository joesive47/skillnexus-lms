import { prisma } from '@/lib/prisma'

export interface Permission {
  resource: string
  action: string
  conditions?: Record<string, any>
}

export interface CreateRoleInput {
  tenantId?: string
  name: string
  description?: string
  permissions: Permission[]
}

export class RBACService {
  async createRole(input: CreateRoleInput) {
    const roleId = this.generateId()
    await prisma.$executeRaw`
      INSERT INTO custom_roles (id, tenantId, name, description, permissions, isSystem, createdAt, updatedAt)
      VALUES (${roleId}, ${input.tenantId || null}, ${input.name}, ${input.description || null}, 
              ${JSON.stringify(input.permissions)}, 0, datetime('now'), datetime('now'))
    `
    return { id: roleId, ...input }
  }

  async assignRole(userId: string, roleId: string, scope: string = 'global', assignedBy: string) {
    await prisma.$executeRaw`
      INSERT INTO role_assignments (id, userId, roleId, scope, assignedBy, assignedAt)
      VALUES (${this.generateId()}, ${userId}, ${roleId}, ${scope}, ${assignedBy}, datetime('now'))
    `
  }

  async checkPermission(userId: string, resource: string, action: string): Promise<boolean> {
    const roles = await prisma.$queryRaw<any[]>`
      SELECT cr.permissions FROM custom_roles cr
      JOIN role_assignments ra ON cr.id = ra.roleId
      WHERE ra.userId = ${userId} AND (ra.expiresAt IS NULL OR ra.expiresAt > datetime('now'))
    `

    for (const role of roles) {
      const permissions = JSON.parse(role.permissions) as Permission[]
      for (const perm of permissions) {
        if ((perm.resource === '*' || perm.resource === resource) &&
            (perm.action === '*' || perm.action === action)) {
          return true
        }
      }
    }

    return false
  }

  async getUserRoles(userId: string) {
    return await prisma.$queryRaw`
      SELECT cr.* FROM custom_roles cr
      JOIN role_assignments ra ON cr.id = ra.roleId
      WHERE ra.userId = ${userId} AND (ra.expiresAt IS NULL OR ra.expiresAt > datetime('now'))
    `
  }

  async revokeRole(userId: string, roleId: string) {
    await prisma.$executeRaw`
      DELETE FROM role_assignments WHERE userId = ${userId} AND roleId = ${roleId}
    `
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}

export const rbacService = new RBACService()
