import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

export async function GET(
  request: NextRequest,
  { params }: { params: { certificationId: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const certificationId = params.certificationId

    // Get user certification
    const userCert = await prisma.userCertification.findUnique({
      where: { id: certificationId },
      include: {
        certification: true,
        user: true
      }
    })

    if (!userCert) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 })
    }

    // Verify ownership
    if (userCert.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Generate PDF Certificate
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([842, 595]) // A4 landscape
    
    const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman)
    const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
    
    const { width, height } = page.getSize()

    // Border
    page.drawRectangle({
      x: 30,
      y: 30,
      width: width - 60,
      height: height - 60,
      borderColor: rgb(0.1, 0.3, 0.6),
      borderWidth: 3
    })

    // Inner border
    page.drawRectangle({
      x: 40,
      y: 40,
      width: width - 80,
      height: height - 80,
      borderColor: rgb(0.7, 0.7, 0.7),
      borderWidth: 1
    })

    // Title: CERTIFICATE OF ACHIEVEMENT
    page.drawText('CERTIFICATE OF ACHIEVEMENT', {
      x: width / 2 - 200,
      y: height - 100,
      size: 32,
      font: timesRomanBold,
      color: rgb(0.1, 0.3, 0.6)
    })

    // Decorative line
    page.drawLine({
      start: { x: width / 2 - 150, y: height - 110 },
      end: { x: width / 2 + 150, y: height - 110 },
      thickness: 2,
      color: rgb(0.7, 0.5, 0.1)
    })

    // "This is to certify that"
    page.drawText('This is to certify that', {
      x: width / 2 - 80,
      y: height - 180,
      size: 16,
      font: helvetica,
      color: rgb(0.3, 0.3, 0.3)
    })

    // Student Name
    const studentName = userCert.user.name || 'Student'
    page.drawText(studentName, {
      x: width / 2 - (studentName.length * 8),
      y: height - 220,
      size: 28,
      font: timesRomanBold,
      color: rgb(0, 0, 0)
    })

    // Underline name
    page.drawLine({
      start: { x: width / 2 - 200, y: height - 225 },
      end: { x: width / 2 + 200, y: height - 225 },
      thickness: 1,
      color: rgb(0.5, 0.5, 0.5)
    })

    // "has successfully completed"
    page.drawText('has successfully completed', {
      x: width / 2 - 90,
      y: height - 270,
      size: 14,
      font: helvetica,
      color: rgb(0.3, 0.3, 0.3)
    })

    // Certificate Name
    const certName = userCert.certification.certificationName
    const certNameLines = wrapText(certName, 60)
    certNameLines.forEach((line, index) => {
      page.drawText(line, {
        x: width / 2 - (line.length * 6),
        y: height - 310 - (index * 25),
        size: 20,
        font: timesRomanBold,
        color: rgb(0.1, 0.3, 0.6)
      })
    })

    // Description
    if (userCert.certification.description) {
      const descLines = wrapText(userCert.certification.description, 80)
      descLines.forEach((line, index) => {
        page.drawText(line, {
          x: width / 2 - (line.length * 3),
          y: height - 370 - (index * 18),
          size: 11,
          font: helvetica,
          color: rgb(0.4, 0.4, 0.4)
        })
      })
    }

    // Date issued
    const dateStr = new Date(userCert.issueDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    page.drawText(`Date of Issue: ${dateStr}`, {
      x: 80,
      y: 100,
      size: 12,
      font: helvetica,
      color: rgb(0.3, 0.3, 0.3)
    })

    // Certificate ID
    const shortId = userCert.id.substring(0, 12).toUpperCase()
    page.drawText(`Certificate ID: ${shortId}`, {
      x: 80,
      y: 80,
      size: 10,
      font: helvetica,
      color: rgb(0.5, 0.5, 0.5)
    })

    // Digital Signature (if exists)
    if (userCert.digitalSignature) {
      page.drawText('Digitally Verified', {
        x: width - 200,
        y: 100,
        size: 12,
        font: helvetica,
        color: rgb(0.1, 0.6, 0.1)
      })
      
      // Add checkmark or seal representation
      page.drawText('✓', {
        x: width - 90,
        y: 95,
        size: 24,
        font: timesRomanBold,
        color: rgb(0.1, 0.6, 0.1)
      })
    }

    // SkillNexus logo/text
    page.drawText('SkillNexus Learning Platform', {
      x: width / 2 - 100,
      y: 50,
      size: 14,
      font: timesRomanBold,
      color: rgb(0.1, 0.3, 0.6)
    })

    const pdfBytes = await pdfDoc.save()

    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${certName.replace(/\s+/g, '_')}_Certificate.pdf"`
      }
    })
  } catch (error) {
    console.error('Certificate generation error:', error)
    return NextResponse.json({ error: 'Failed to generate certificate' }, { status: 500 })
  }
}

function wrapText(text: string, maxLength: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''

  words.forEach(word => {
    if ((currentLine + word).length <= maxLength) {
      currentLine += (currentLine ? ' ' : '') + word
    } else {
      if (currentLine) lines.push(currentLine)
      currentLine = word
    }
  })
  
  if (currentLine) lines.push(currentLine)
  return lines
}
