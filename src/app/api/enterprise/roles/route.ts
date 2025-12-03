import { NextRequest, NextResponse } from 'next/server'
import { rbacService } from '@/lib/enterprise/rbac-service'
import { auth } from '@/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()

    if (data.action === 'create') {
      const role = await rbacService.createRole({
        tenantId: data.tenantId,
        name: data.name,
        description: data.description,
        permissions: data.permissions
      })
      return NextResponse.json({ success: true, role })
    }

    if (data.action === 'assign') {
      await rbacService.assignRole(
        data.userId,
        data.roleId,
        data.scope || 'global',
        session.user.id!
      )
      return NextResponse.json({ success: true })
    }

    if (data.action === 'revoke') {
      await rbacService.revokeRole(data.userId, data.roleId)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (userId) {
      const roles = await rbacService.getUserRoles(userId)
      return NextResponse.json({ roles })
    }

    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
