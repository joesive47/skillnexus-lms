import { NextRequest, NextResponse } from 'next/server'
import { certificationService } from '@/lib/certification/certification-service'

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params

    if (!code) {
      return NextResponse.json({ error: 'Verification code required' }, { status: 400 })
    }

    const verification = await certificationService.verifyByCode(code)

    if (!verification) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 404 })
    }

    // Return public verification data (privacy-safe)
    return NextResponse.json({
      valid: true,
      recipientName: verification.recipientName,
      issuerName: verification.issuerName,
      issueDate: verification.issueDate,
      expiryDate: verification.expiryDate,
      status: verification.status,
      entityType: verification.entityType
    })

  } catch (error) {
    console.error('Error in verification:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}