import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { AccessError, publicError, requireUser } from '@/lib/access-control'
import { generateCertificatePDF } from '@/lib/pdf-generator'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ certificateId: string }> }
) {
  try {
    const viewer = await requireUser()
    const { certificateId } = await params

    // ลอง Certificate model ก่อน (model หลักที่ใช้จริง)
    const certificate = await prisma.certificate.findUnique({
      where: { id: certificateId },
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { title: true } },
      },
    })
    if (!certificate) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 })
    }

    if (viewer.id !== certificate.userId && viewer.role !== 'ADMIN') {
      throw new AccessError('Access denied')
    }

    const userName = certificate.user.name || certificate.user.email || 'ผู้เรียน'
    const courseName = certificate.course.title
    const issuedDate = new Date(certificate.issuedAt).toLocaleDateString('th-TH', {
      year: 'numeric', month: 'long', day: 'numeric',
    })

    const pdfBuffer = await generateCertificatePDF({
      userName,
      courseName,
      certificateNumber: certificate.certificateNumber,
      issuedDate,
      bardData: certificate.bardData ?? '{}',
      qrCodeUrl: certificate.qrCodeUrl ?? undefined,
    })

    const fileName = `certificate-${certificate.certificateNumber}.pdf`
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'private, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Error generating certificate PDF:', error)
    return NextResponse.json(
      { error: publicError(error) },
      { status: error instanceof AccessError ? error.status : 500 }
    )
  }
}
