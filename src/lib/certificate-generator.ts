import { createHmac, randomBytes } from 'crypto'
import QRCode from 'qrcode'
import prisma from './prisma'
import { BARDScorer } from './bard-scorer'
import { sendCertificateEmail } from './email'

export class CertificateGenerator {
  async generateCertificate(userId: string, courseId: string) {
    const scorer = new BARDScorer()
    
    const competencies = await scorer.scoreUserByCourse(userId, courseId)
    const careerReadiness = await scorer.calculateCareerFit(userId, courseId)
    
    const year = new Date().getFullYear()
    const timestamp = Date.now().toString().slice(-6)
    const certNumber = `BARD-${year}-TH-${timestamp}`
    const verificationToken = randomBytes(16).toString('hex')
    
    const bardData = { competencies, careerReadiness }
    
    const signature = createHmac('sha256', process.env.CERT_SIGNING_KEY || 'default-key')
      .update(JSON.stringify(bardData))
      .digest('hex')
    
    const verifyUrl = `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/bard-verify/${verificationToken}`
    const qrCodeUrl = await QRCode.toDataURL(verifyUrl)
    
    const expiresAt = new Date()
    expiresAt.setFullYear(expiresAt.getFullYear() + 3)
    
    const certificate = await prisma.certificate.create({
      data: {
        certificateNumber: certNumber,
        userId,
        courseId,
        verificationToken,
        digitalSignature: signature,
        qrCodeUrl,
        bardData: JSON.stringify(bardData),
        expiresAt
      },
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { title: true } }
      }
    })

    // Send certificate email
    await sendCertificateEmail(
      certificate.user.email,
      certificate.user.name || 'Student',
      certificate.course.title,
      certNumber
    )

    return certificate
  }
}
