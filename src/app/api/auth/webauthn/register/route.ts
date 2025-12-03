import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { WebAuthn } from '@/lib/security/webauthn'

export async function POST() {
  const session = await auth()
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const options = WebAuthn.createRegistrationOptions(
    session.user.id!,
    session.user.name || 'User',
    session.user.email!
  )

  return NextResponse.json(options)
}
