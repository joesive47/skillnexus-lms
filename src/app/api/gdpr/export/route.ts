import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { GDPR } from '@/lib/compliance/gdpr'

export async function GET() {
  const session = await auth()
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await GDPR.exportUserData(session.user.id)

  return NextResponse.json(data, {
    headers: {
      'Content-Disposition': `attachment; filename="user-data-${session.user.id}.json"`,
      'Content-Type': 'application/json'
    }
  })
}
