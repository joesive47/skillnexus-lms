import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { generateCertificatePDF } from '@/lib/pdf-generator'
import { AccessError, publicError, requireUser } from '@/lib/access-control'
import QRCode from 'qrcode'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const viewer = await requireUser()
    const { id } = await params

    // Internal database IDs are deliberately not accepted as public identifiers.
    const certificate = await prisma.certificate.findUnique({
      where: { certificateNumber: id },
      include: {
        user: { select: { name: true } },
        course: { select: { title: true } }
      }
    })

    if (!certificate) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 })
    }

    if (viewer.id !== certificate.userId && viewer.role !== 'ADMIN') {
      throw new AccessError('Access denied')
    }

    const bardData = certificate.bardData ? JSON.parse(certificate.bardData) : {}
    const baseUrl = (process.env.NEXT_PUBLIC_URL || process.env.AUTH_URL || 'https://www.uppowerskill.com').replace(/\/$/, '')
    const qrCodeUrl = await QRCode.toDataURL(`${baseUrl}/certificates/verify/${certificate.verificationToken}`)
    const pdfBuffer = await generateCertificatePDF({
      userName: certificate.user.name || 'Student',
      courseName: certificate.course.title,
      certificateNumber: certificate.certificateNumber,
      issuedDate: new Date(certificate.issuedAt).toLocaleString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Bangkok',
      }),
      bardData,
      qrCodeUrl,
    })

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Certificate-${certificate.certificateNumber}.pdf"`
      }
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json(
      { error: publicError(error) },
      { status: error instanceof AccessError ? error.status : 500 }
    )
  }
}
