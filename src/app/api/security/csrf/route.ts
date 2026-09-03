import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { CSRF } from '@/lib/security/csrf'

export async function GET() {
  const session = await auth()
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = CSRF.generate(session.user.id)
  
  return NextResponse.json({ token })
}
