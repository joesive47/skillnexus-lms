import { jsPDF } from 'jspdf'

interface CertificateData {
  userName: string
  courseName: string
  certificateNumber: string
  issuedDate: string
  bardData: any
}

export async function generateCertificatePDF(data: CertificateData): Promise<ArrayBuffer> {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  })

  // Background
  doc.setFillColor(255, 255, 255)
  doc.rect(0, 0, 297, 210, 'F')

  // Border
  doc.setDrawColor(41, 128, 185)
  doc.setLineWidth(2)
  doc.rect(10, 10, 277, 190)

  // Title
  doc.setFontSize(40)
  doc.setTextColor(41, 128, 185)
  doc.text('Certificate of Completion', 148.5, 50, { align: 'center' })

  // Subtitle
  doc.setFontSize(16)
  doc.setTextColor(100, 100, 100)
  doc.text('This is to certify that', 148.5, 70, { align: 'center' })

  // Name
  doc.setFontSize(32)
  doc.setTextColor(0, 0, 0)
  doc.text(data.userName, 148.5, 90, { align: 'center' })

  // Course
  doc.setFontSize(16)
  doc.setTextColor(100, 100, 100)
  doc.text('has successfully completed', 148.5, 105, { align: 'center' })

  doc.setFontSize(24)
  doc.setTextColor(41, 128, 185)
  doc.text(data.courseName, 148.5, 120, { align: 'center' })

  // Date and Certificate Number
  doc.setFontSize(12)
  doc.setTextColor(100, 100, 100)
  doc.text(`Date: ${data.issuedDate}`, 148.5, 145, { align: 'center' })
  doc.text(`Certificate No: ${data.certificateNumber}`, 148.5, 155, { align: 'center' })

  // Footer
  doc.setFontSize(10)
  doc.text('SkillNexus LMS - Verified Certificate', 148.5, 180, { align: 'center' })

  return doc.output('arraybuffer')
}
