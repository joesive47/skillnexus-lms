import { NextRequest, NextResponse } from 'next/server'
import { tenantService } from '@/lib/enterprise/tenant-service'
import { auth } from '@/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()
    const tenant = await tenantService.createTenant(data)

    return NextResponse.json({ success: true, tenant })
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
    const tenantId = searchParams.get('tenantId')
    const domain = searchParams.get('domain')

    if (tenantId) {
      const tenant = await tenantService.getTenant(tenantId)
      return NextResponse.json({ tenant })
    }

    if (domain) {
      const tenant = await tenantService.getTenantByDomain(domain)
      return NextResponse.json({ tenant })
    }

    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
