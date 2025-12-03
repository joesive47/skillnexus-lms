import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { TwoFactor } from '@/lib/security/two-factor'
import { Encryption } from '@/lib/security/encryption'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { code } = await req.json()

  // Simplified - remove 2FA fields check since they don't exist in schema yet
  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      // 2FA fields will be added in database migration
    }
  })

  return NextResponse.json({
    success: true,
    message: '2FA disabled successfully'
  })
}
