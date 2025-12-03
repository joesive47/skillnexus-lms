import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { WebAuthn } from '@/lib/security/webauthn'

export async function POST(req: NextRequest) {
  const session = await auth()
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { credential, challenge } = await req.json()

  const isValid = WebAuthn.verifyRegistration(credential, challenge)

  if (!isValid) {
    return NextResponse.json({ error: 'Invalid credential' }, { status: 400 })
  }

  // Store credential in database
  // await prisma.webAuthnCredential.create({ ... })

  return NextResponse.json({
    success: true,
    message: 'Biometric authentication registered'
  })
}
