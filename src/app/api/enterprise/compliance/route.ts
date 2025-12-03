import { NextRequest, NextResponse } from 'next/server'
import { complianceService } from '@/lib/enterprise/compliance-service'
import { auth } from '@/auth'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const tenantId = searchParams.get('tenantId') || 'default'
    const standard = searchParams.get('standard') || 'GDPR'

    const report = await complianceService.runComplianceCheck(tenantId, standard)
    return NextResponse.json({ report })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action, tenantId, data } = await req.json()

    if (action === 'enable_encryption') {
      const result = await complianceService.enableDataEncryption(tenantId)
      return NextResponse.json({ success: true, result })
    }

    if (action === 'configure_dlp') {
      const result = await complianceService.configureDLP(tenantId, data.rules)
      return NextResponse.json({ success: true, result })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
