import { jsPDF } from 'jspdf'

interface CertificateData {
  userName: string
  courseName: string
  certificateNumber: string
  issuedDate: string
  bardData?: string
  qrCodeUrl?: string
}

export async function generateCertificatePDF(data: CertificateData): Promise<ArrayBuffer> {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  })

  const W = 297 // A4 landscape width
  const H = 210 // A4 landscape height

  // ── Background gradient simulation ──────────────────────────────
  doc.setFillColor(245, 248, 255)
  doc.rect(0, 0, W, H, 'F')

  // Top accent bar
  doc.setFillColor(30, 64, 175) // blue-800
  doc.rect(0, 0, W, 8, 'F')

  // Bottom accent bar
  doc.setFillColor(30, 64, 175)
  doc.rect(0, H - 8, W, 8, 'F')

  // Outer border
  doc.setDrawColor(30, 64, 175)
  doc.setLineWidth(1.5)
  doc.rect(12, 12, W - 24, H - 24)

  // Inner decorative border
  doc.setDrawColor(147, 197, 253) // blue-300
  doc.setLineWidth(0.5)
  doc.rect(16, 16, W - 32, H - 32)

  // ── Corner ornaments ─────────────────────────────────────────────
  const corners = [[16, 16], [W - 16, 16], [16, H - 16], [W - 16, H - 16]]
  doc.setFillColor(30, 64, 175)
  corners.forEach(([x, y]) => {
    doc.circle(x, y, 2, 'F')
  })

  // ── Logo area ────────────────────────────────────────────────────
  doc.setFontSize(11)
  doc.setTextColor(30, 64, 175)
  doc.setFont('helvetica', 'bold')
  doc.text('upPowerSkill', W / 2, 26, { align: 'center' })

  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 116, 139)
  doc.text('AI-Powered Learning Platform', W / 2, 32, { align: 'center' })

  // Separator line
  doc.setDrawColor(226, 232, 240)
  doc.setLineWidth(0.3)
  doc.line(60, 36, W - 60, 36)

  // ── Main title ───────────────────────────────────────────────────
  doc.setFontSize(28)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(30, 64, 175)
  doc.text('Certificate of Completion', W / 2, 55, { align: 'center' })

  // ── Subtitle ─────────────────────────────────────────────────────
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 116, 139)
  doc.text('This is to certify that', W / 2, 66, { align: 'center' })

  // ── Recipient name ───────────────────────────────────────────────
  doc.setFontSize(26)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(15, 23, 42) // slate-900

  // Underline effect
  const nameWidth = doc.getTextWidth(data.userName)
  const nameX = W / 2 - nameWidth / 2
  doc.text(data.userName, W / 2, 82, { align: 'center' })
  doc.setDrawColor(30, 64, 175)
  doc.setLineWidth(0.6)
  doc.line(nameX, 84.5, nameX + nameWidth, 84.5)

  // ── Course label ─────────────────────────────────────────────────
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 116, 139)
  doc.text('has successfully completed the course', W / 2, 95, { align: 'center' })

  // ── Course name ──────────────────────────────────────────────────
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(30, 64, 175)

  // Word wrap for long course names
  const maxWidth = 200
  const courseLines = doc.splitTextToSize(data.courseName, maxWidth)
  const courseY = courseLines.length > 1 ? 108 : 113
  doc.text(courseLines, W / 2, courseY, { align: 'center' })

  // ── Decorative divider ───────────────────────────────────────────
  const dividerY = courseLines.length > 1 ? 122 : 124
  doc.setFillColor(147, 197, 253)
  doc.rect(W / 2 - 30, dividerY, 60, 0.8, 'F')

  // ── Info row ─────────────────────────────────────────────────────
  const infoY = dividerY + 12

  // Date (left)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(71, 85, 105)
  doc.text('DATE ISSUED', 80, infoY, { align: 'center' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(15, 23, 42)
  doc.text(data.issuedDate, 80, infoY + 6, { align: 'center' })

  // Certificate number (center)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(71, 85, 105)
  doc.text('CERTIFICATE NO.', W / 2, infoY, { align: 'center' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(15, 23, 42)
  doc.text(data.certificateNumber, W / 2, infoY + 6, { align: 'center' })

  // Signature area (right)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(71, 85, 105)
  doc.text('AUTHORIZED BY', W - 80, infoY, { align: 'center' })
  doc.setDrawColor(100, 116, 139)
  doc.setLineWidth(0.4)
  doc.line(W - 110, infoY + 8, W - 50, infoY + 8)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(100, 116, 139)
  doc.text('upPowerSkill Team', W - 80, infoY + 13, { align: 'center' })

  // ── QR code (if available) ───────────────────────────────────────
  if (data.qrCodeUrl && data.qrCodeUrl.startsWith('data:image')) {
    try {
      doc.addImage(data.qrCodeUrl, 'PNG', W - 42, H - 46, 24, 24)
      doc.setFontSize(6)
      doc.setTextColor(148, 163, 184)
      doc.text('Scan to verify', W - 30, H - 20, { align: 'center' })
    } catch {
      // ถ้า QR code ใส่ไม่ได้ก็ข้ามไป
    }
  }

  // ── Footer ───────────────────────────────────────────────────────
  doc.setFontSize(7)
  doc.setTextColor(148, 163, 184)
  doc.text(
    'This certificate is digitally signed and verified by upPowerSkill LMS | www.uppowerskill.com',
    W / 2,
    H - 13,
    { align: 'center' }
  )

  return doc.output('arraybuffer')
}
