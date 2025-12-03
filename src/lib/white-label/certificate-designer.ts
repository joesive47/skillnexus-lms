import { jsPDF } from 'jspdf'
import { BrandingConfig } from './branding'

export async function generateBrandedCertificate(
  data: {
    userName: string
    courseName: string
    certificateNumber: string
    issuedDate: string
  },
  branding: BrandingConfig
): Promise<ArrayBuffer> {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  })

  doc.setFillColor(255, 255, 255)
  doc.rect(0, 0, 297, 210, 'F')

  const primaryRGB = hexToRgb(branding.primaryColor)
  doc.setDrawColor(primaryRGB.r, primaryRGB.g, primaryRGB.b)
  doc.setLineWidth(2)
  doc.rect(10, 10, 277, 190)

  doc.setFontSize(40)
  doc.setTextColor(primaryRGB.r, primaryRGB.g, primaryRGB.b)
  doc.text('Certificate of Completion', 148.5, 50, { align: 'center' })

  doc.setFontSize(16)
  doc.setTextColor(100, 100, 100)
  doc.text('This is to certify that', 148.5, 70, { align: 'center' })

  doc.setFontSize(32)
  doc.setTextColor(0, 0, 0)
  doc.text(data.userName, 148.5, 90, { align: 'center' })

  doc.setFontSize(16)
  doc.setTextColor(100, 100, 100)
  doc.text('has successfully completed', 148.5, 105, { align: 'center' })

  doc.setFontSize(24)
  doc.setTextColor(primaryRGB.r, primaryRGB.g, primaryRGB.b)
  doc.text(data.courseName, 148.5, 120, { align: 'center' })

  doc.setFontSize(12)
  doc.setTextColor(100, 100, 100)
  doc.text(`Date: ${data.issuedDate}`, 148.5, 145, { align: 'center' })
  doc.text(`Certificate No: ${data.certificateNumber}`, 148.5, 155, { align: 'center' })

  doc.setFontSize(10)
  doc.text(`${branding.name} - Verified Certificate`, 148.5, 180, { align: 'center' })

  return doc.output('arraybuffer')
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 59, g: 130, b: 246 }
}
