import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { GDPR } from '@/lib/compliance/gdpr'

export async function POST(req: NextRequest) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { confirm } = await req.json()

  if (confirm !== 'DELETE_MY_DATA') {
    return NextResponse.json({ error: 'Confirmation required' }, { status: 400 })
  }

  await GDPR.deleteUserData(session.user.id)

  return NextResponse.json({
    success: true,
    message: 'Your data has been anonymized'
  })
}
