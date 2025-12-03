import { NextRequest, NextResponse } from 'next/server'
import { auditService } from '@/lib/enterprise/audit-service'
import { auth } from '@/auth'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const tenantId = searchParams.get('tenantId')
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '100')

    if (userId) {
      const logs = await auditService.getUserActivity(userId, limit)
      return NextResponse.json({ logs })
    }

    if (tenantId) {
      const logs = await auditService.getAuditLogs(tenantId, limit)
      return NextResponse.json({ logs })
    }

    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
