import { NextRequest, NextResponse } from 'next/server'
import { biService } from '@/lib/enterprise/bi-service'
import { auth } from '@/auth'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const tenantId = searchParams.get('tenantId') || 'default'

    const kpis = await biService.getExecutiveKPIs(tenantId)
    return NextResponse.json({ kpis })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
