import { NextRequest, NextResponse } from 'next/server'
import { integrationHub } from '@/lib/enterprise/integration-hub'
import { auth } from '@/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { tenantId, config } = await req.json()
    const integrationId = await integrationHub.registerIntegration(tenantId, config)

    return NextResponse.json({ success: true, integrationId })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
