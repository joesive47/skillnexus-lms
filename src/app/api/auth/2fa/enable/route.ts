import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { TwoFactor } from '@/lib/security/two-factor'
import { Encryption } from '@/lib/security/encryption'
import prisma from '@/lib/prisma'

export async function POST() {
  const session = await auth()
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const secret = TwoFactor.generateSecret()
  const backupCodes = TwoFactor.generateBackupCodes()
  const qrCodeURL = TwoFactor.getQRCodeURL(secret, session.user.email!)

  // Store encrypted secret (will be added in database migration)
  // await prisma.user.update({ ... })

  return NextResponse.json({
    secret,
    qrCodeURL,
    backupCodes,
    message: 'Scan QR code with Google Authenticator and verify to enable 2FA'
  })
}
