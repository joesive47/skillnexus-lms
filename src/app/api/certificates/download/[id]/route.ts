import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { generateCertificatePDF } from '@/lib/pdf-generator'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('Looking for certificate:', id)

    // Try to find by certificateNumber first, then by id
    let certificate = await prisma.certificate.findUnique({
      where: { certificateNumber: id },
      include: {
        user: { select: { name: true } },
        course: { select: { title: true } }
      }
    })

    // If not found, try by id
    if (!certificate) {
      certificate = await prisma.certificate.findUnique({
        where: { id },
        include: {
          user: { select: { name: true } },
          course: { select: { title: true } }
        }
      })
    }

    console.log('Certificate found:', certificate ? 'Yes' : 'No')

    if (!certificate) {
      console.error('Certificate not found:', id)
      return NextResponse.json({ error: 'Certificate not found', id }, { status: 404 })
    }

    const bardData = certificate.bardData ? JSON.parse(certificate.bardData) : {}
    console.log('Generating PDF for:', certificate.certificateNumber)
    
    const pdfBuffer = await generateCertificatePDF({
      userName: certificate.user.name || 'Student',
      courseName: certificate.course.title,
      certificateNumber: certificate.certificateNumber,
      issuedDate: new Date(certificate.issuedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      bardData
    })

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Certificate-${certificate.certificateNumber}.pdf"`
      }
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 })
  }
}
