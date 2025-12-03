import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { AuditLogger } from '@/lib/security/audit-logger'

export async function GET() {
  const session = await auth()
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const suspicious = AuditLogger.getSuspiciousActivity(100)
  
  return NextResponse.json({
    success: true,
    data: suspicious,
    count: suspicious.length
  })
}
