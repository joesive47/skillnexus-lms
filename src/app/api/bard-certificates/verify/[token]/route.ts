import { NextRequest, NextResponse } from 'next/server'
import { verifyCertificateSignature } from '@/lib/certificate-signature'
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

    if (!cert || cert.status !== 'ACTIVE' || (cert.expiresAt && cert.expiresAt <= new Date())) {
      return NextResponse.json({ valid: false }, { status: 404 })
    }

    const isValid = verifyCertificateSignature(cert)

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
