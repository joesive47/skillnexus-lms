import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'
import prisma from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params

    const cert = await prisma.certificate.findUnique({
      where: { verificationToken: token },
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { title: true, description: true } }
      }
    })

    if (!cert || cert.status !== 'ACTIVE') {
      return NextResponse.json({ valid: false }, { status: 404 })
    }

    const expectedSig = createHmac('sha256', process.env.CERT_SIGNING_KEY || 'default-key')
      .update(cert.bardData)
      .digest('hex')

    const isValid = expectedSig === cert.digitalSignature

    return NextResponse.json({
      valid: isValid,
      certificate: {
        certificateNumber: cert.certificateNumber,
        holder: cert.user.name,
        course: cert.course.title,
        issuedAt: cert.issuedAt,
        expiresAt: cert.expiresAt,
        bardSummary: JSON.parse(cert.bardData)
      }
    })
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json({ valid: false }, { status: 500 })
  }
}
