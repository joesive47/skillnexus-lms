import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { AccessError, publicError, requireUser } from '@/lib/access-control'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ certificateId: string }> }
) {
  try {
    const viewer = await requireUser()
    const { certificateId } = await params

    const certificate = await prisma.courseCertificate.findUnique({
      where: { id: certificateId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            title: true,
          },
        },
        definition: true,
      },
    })

    if (!certificate) {
      return NextResponse.json(
        { error: 'Certificate not found' },
        { status: 404 }
      )
    }

    if (viewer.id !== certificate.userId && viewer.role !== 'ADMIN') {
      throw new AccessError('Access denied')
    }

    // TODO: Generate PDF using a library like pdf-lib or puppeteer
    // For now, return JSON data that can be used to generate PDF client-side

    return NextResponse.json({
      certificate: {
        id: certificate.id,
        verificationCode: certificate.verificationCode,
        recipientName: certificate.user.name,
        courseName: certificate.course.title,
        issueDate: certificate.issueDate,
        expiryDate: certificate.expiryDate,
        issuer: {
          name: certificate.definition.issuerName,
          title: certificate.definition.issuerTitle,
        },
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
