// Advanced Role-Based Access Control - Phase 6 Enterprise Feature
interface Permission {
  id: string
  name: string
  resource: string
  action: string
  conditions?: Record<string, any>
}

interface Role {
  id: string
  name: string
  description: string
  permissions: Permission[]
  tenantId: string
  isSystemRole: boolean
}

interface UserRole {
  userId: string
  roleId: string
  scope: string // department, team, global
  assignedBy: string
  assignedAt: Date
  expiresAt?: Date
}

interface AccessContext {
  userId: string
  tenantId: string
  resource: string
  action: string
  context?: Record<string, any>
}

export class RBACManager {
  private roles: Map<string, Role> = new Map()
  private userRoles: Map<string, UserRole[]> = new Map()
  private permissions: Map<string, Permission> = new Map()

  constructor() {
    this.initializeSystemRoles()
  }

  async createCustomRole(
    tenantId: string,
    name: string,
    description: string,
    permissions: Permission[]
  ): Promise<Role> {
    const roleId = `role-${Date.now()}`
    
    const role: Role = {
      id: roleId,
      name,
      description,
      permissions,
      tenantId,
      isSystemRole: false
    }

    this.roles.set(roleId, role)
    return role
  }

  async assignRoleToUser(
    userId: string,
    roleId: string,
    scope: string,
    assignedBy: string,
    expiresAt?: Date
  ): Promise<void> {
    const userRole: UserRole = {
      userId,
      roleId,
      scope,
      assignedBy,
      assignedAt: new Date(),
      expiresAt
    }

    const existingRoles = this.userRoles.get(userId) || []
    existingRoles.push(userRole)
    this.userRoles.set(userId, existingRoles)
  }

  async checkPermission(context: AccessContext): Promise<boolean> {
    const userRoles = this.userRoles.get(context.userId) || []
    
    for (const userRole of userRoles) {
      // Check if role is expired
      if (userRole.expiresAt && userRole.expiresAt < new Date()) {
        continue
      }

      const role = this.roles.get(userRole.roleId)
      if (!role) continue

      // Check tenant isolation
      if (role.tenantId !== context.tenantId && !role.isSystemRole) {
        continue
      }

      // Check permissions
      for (const permission of role.permissions) {
        if (this.matchesPermission(permission, context)) {
          return true
        }
      }
    }

    return false
  }

  async getUserRoles(userId: string, tenantId: string): Promise<Role[]> {
    const userRoles = this.userRoles.get(userId) || []
    const roles: Role[] = []

    for (const userRole of userRoles) {
      const role = this.roles.get(userRole.roleId)
      if (role && (role.tenantId === tenantId || role.isSystemRole)) {
        roles.push(role)
      }
    }

    return roles
  }

  async revokeUserRole(userId: string, roleId: string): Promise<void> {
    const userRoles = this.userRoles.get(userId) || []
    const filteredRoles = userRoles.filter(ur => ur.roleId !== roleId)
    this.userRoles.set(userId, filteredRoles)
  }

  async createPermission(
    name: string,
    resource: string,
    action: string,
    conditions?: Record<string, any>
  ): Promise<Permission> {
    const permissionId = `perm-${Date.now()}`
    
    const permission: Permission = {
      id: permissionId,
      name,
      resource,
      action,
      conditions
    }

    this.permissions.set(permissionId, permission)
    return permission
  }

  async getEffectivePermissions(userId: string, tenantId: string): Promise<Permission[]> {
    const roles = await this.getUserRoles(userId, tenantId)
    const permissions: Permission[] = []

    for (const role of roles) {
      permissions.push(...role.permissions)
    }

    // Remove duplicates
    return permissions.filter((perm, index, self) => 
      index === self.findIndex(p => p.id === perm.id)
    )
  }

  private matchesPermission(permission: Permission, context: AccessContext): boolean {
    // Check resource match
    if (permission.resource !== '*' && permission.resource !== context.resource) {
      return false
    }

    // Check action match
    if (permission.action !== '*' && permission.action !== context.action) {
      return false
    }

    // Check conditions if any
    if (permission.conditions && context.context) {
      for (const [key, value] of Object.entries(permission.conditions)) {
        if (context.context[key] !== value) {
          return false
        }
      }
    }

    return true
  }

  private initializeSystemRoles(): void {
    // Super Admin Role
    const superAdminRole: Role = {
      id: 'super-admin',
      name: 'Super Administrator',
      description: 'Full system access across all tenants',
      permissions: [{
        id: 'super-admin-perm',
        name: 'All Permissions',
        resource: '*',
        action: '*'
      }],
      tenantId: '*',
      isSystemRole: true
    }

    // Tenant Admin Role
    const tenantAdminRole: Role = {
      id: 'tenant-admin',
      name: 'Tenant Administrator',
      description: 'Full access within tenant',
      permissions: [
        {
          id: 'tenant-admin-users',
          name: 'Manage Users',
          resource: 'users',
          action: '*'
        },
        {
          id: 'tenant-admin-courses',
          name: 'Manage Courses',
          resource: 'courses',
          action: '*'
        },
        {
          id: 'tenant-admin-reports',
          name: 'View Reports',
          resource: 'reports',
          action: 'read'
        }
      ],
      tenantId: '*',
      isSystemRole: true
    }

    this.roles.set(superAdminRole.id, superAdminRole)
    this.roles.set(tenantAdminRole.id, tenantAdminRole)
  }
}

export const rbacManager = new RBACManager()