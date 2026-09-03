// Certification Engine - Full Implementation
// File: src/lib/certification/certification-engine.ts

import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export interface CertificationProgress {
  certificationId: string
  certificationName: string
  progress: number
  earned: number
  total: number
  badges: Array<{
    badgeId: string
    badgeName: string
    earned: boolean
    isRequired: boolean
  }>
}

export class CertificationEngine {
  /**
   * ตรวจสอบและออก Certifications อัตโนมัติ
   */
  static async checkAndIssueCertifications(userId: string): Promise<string[]> {
    try {
      const issuedCertIds: string[] = []

      console.log(`🎓 Checking certifications for user: ${userId}`)

      // 1. ดึง certifications ทั้งหมด
      const certifications = await prisma.skillCertification.findMany({
        where: { isActive: true },
        include: {
          requiredBadges: {
            include: { badge: true }
          }
        }
      })

      console.log(`Found ${certifications.length} active certifications`)

      // 2. ดึง badges ของ user
      const userBadges = await prisma.userSkillBadge.findMany({
        where: {
          userId,
          status: 'ACTIVE'
        },
        include: { badge: true }
      })

      console.log(`User has ${userBadges.length} active badges`)

      // 3. ตรวจสอบแต่ละ certification
      for (const cert of certifications) {
        // เช็คว่ามีแล้วหรือไม่
        const existing = await prisma.userCertification.findFirst({
          where: {
            userId,
            certificationId: cert.id,
            status: 'ACTIVE'
          }
        })

        if (existing) {
          console.log(`Already has certification: ${cert.certificationName}`)
          continue
        }

        // เช็คว่าครบ badges หรือไม่
        const { eligible, missingBadges } = this.checkEligibility(cert, userBadges)

        if (eligible) {
          console.log(`✅ Eligible for certification: ${cert.certificationName}`)
          const certId = await this.issueCertification(userId, cert.id)
          if (certId) {
            issuedCertIds.push(certId)
            console.log(`🎓 Certification issued: ${cert.certificationName}`)
          }
        } else {
          console.log(
            `❌ Not eligible for ${cert.certificationName}. Missing ${missingBadges?.length || 0} badges`
          )
        }
      }

      return issuedCertIds
    } catch (error) {
      console.error('Error checking certifications:', error)
      return []
    }
  }

  /**
   * ตรวจสอบว่าผ่านเกณฑ์หรือไม่
   */
  static checkEligibility(
    certification: any,
    userBadges: any[]
  ): { eligible: boolean; missingBadges?: string[] } {
    const requiredBadgeIds = certification.requiredBadges
      .filter((rb: any) => rb.isRequired)
      .map((rb: any) => rb.badgeId)

    const userBadgeIds = new Set(userBadges.map((ub) => ub.badgeId))

    const missingBadges = requiredBadgeIds.filter(
      (id: string) => !userBadgeIds.has(id)
    )

    // ตรวจสอบ level (ถ้ามี)
    if (certification.minimumBadgeLevel) {
      const levelOrder = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']
      const minLevelIdx = levelOrder.indexOf(certification.minimumBadgeLevel)

      for (const userBadge of userBadges) {
        const badgeLevel = userBadge.badge.level
        const badgeLevelIdx = levelOrder.indexOf(badgeLevel)

        if (badgeLevelIdx < minLevelIdx) {
          return {
            eligible: false,
            missingBadges: [`Badge ${userBadge.badge.badgeName} level too low`]
          }
        }
      }
    }

    return {
      eligible: missingBadges.length === 0,
      missingBadges: missingBadges.length > 0 ? missingBadges : undefined
    }
  }

  /**
   * ออก Certification
   */
  static async issueCertification(
    userId: string,
    certificationId: string
  ): Promise<string | null> {
    try {
      const certification = await prisma.skillCertification.findUnique({
        where: { id: certificationId },
        include: {
          requiredBadges: {
            include: { badge: true }
          }
        }
      })

      if (!certification) {
        console.log('Certification not found')
        return null
      }

      const user = await prisma.user.findUnique({
        where: { id: userId }
      })

      if (!user) {
        console.log('User not found')
        return null
      }

      // 1. คำนวณ expiry
      const expiryDate = certification.validityMonths
        ? new Date(
            Date.now() + certification.validityMonths * 30 * 24 * 60 * 60 * 1000
          )
        : null

      // 2. สร้าง verification codes
      const certificationNumber = this.generateCertificationNumber()
      const verificationCode = this.generateVerificationCode()
      const digitalSignature = this.generateDigitalSignature(
        userId,
        certificationId,
        verificationCode
      )

      // 3. Snapshot badges
      const userBadges = await prisma.userSkillBadge.findMany({
        where: { userId, status: 'ACTIVE' }
      })
      const badgeSnapshot = JSON.stringify(userBadges.map((ub) => ub.badgeId))

      // 4. สร้าง UserCertification
      const userCert = await prisma.userCertification.create({
        data: {
          userId,
          certificationId,
          issueDate: new Date(),
          expiryDate,
          certificationNumber,
          verificationCode,
          digitalSignature,
          earnedBadgesSnapshot: badgeSnapshot,
          status: 'ACTIVE'
        }
      })

      // 5. สร้าง verification URL
      const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify/certificate/${verificationCode}`
      await prisma.userCertification.update({
        where: { id: userCert.id },
        data: { verificationUrl }
      })

      // 6. Log event
      await prisma.certificationEvent.create({
        data: {
          eventType: 'CERT_ISSUED',
          userId,
          entityType: 'CERTIFICATION',
          entityId: userCert.id,
          metadata: JSON.stringify({ 
            certificationId,
            certificationName: certification.certificationName
          })
        }
      })

      // TODO: 7. Generate PDF (implement separately)
      // const pdfUrl = await generateCertificatePDF({ userCert, user, certification })

      return userCert.id
    } catch (error) {
      console.error('Error issuing certification:', error)
      return null
    }
  }

  /**
   * ดู Progress
   */
  static async getCertificationProgress(
    userId: string,
    certificationId: string
  ): Promise<CertificationProgress | null> {
    try {
      const certification = await prisma.skillCertification.findUnique({
        where: { id: certificationId },
        include: {
          requiredBadges: {
            include: { badge: true }
          }
        }
      })

      if (!certification) return null

      const userBadges = await prisma.userSkillBadge.findMany({
        where: { userId, status: 'ACTIVE' },
        include: { badge: true }
      })

      const userBadgeIds = new Set(userBadges.map((ub) => ub.badgeId))

      const requiredBadges = certification.requiredBadges.filter(
        (rb) => rb.isRequired
      )

      const earnedCount = requiredBadges.filter((rb) =>
        userBadgeIds.has(rb.badgeId)
      ).length

      const progress =
        requiredBadges.length > 0
          ? Math.round((earnedCount / requiredBadges.length) * 100)
          : 0

      return {
        certificationId,
        certificationName: certification.certificationName,
        progress,
        earned: earnedCount,
        total: requiredBadges.length,
        badges: requiredBadges.map((rb) => ({
          badgeId: rb.badgeId,
          badgeName: rb.badge.badgeName,
          earned: userBadgeIds.has(rb.badgeId),
          isRequired: rb.isRequired
        }))
      }
    } catch (error) {
      console.error('Error getting certification progress:', error)
      return null
    }
  }

  /**
   * ดึงทุก Certifications ของ User
   */
  static async getUserCertifications(userId: string) {
    return await prisma.userCertification.findMany({
      where: { userId, status: 'ACTIVE' },
      include: { certification: true },
      orderBy: { issueDate: 'desc' }
    })
  }

  /**
   * ดู Progress ทุก Certifications
   */
  static async getAllProgress(userId: string): Promise<CertificationProgress[]> {
    const certifications = await prisma.skillCertification.findMany({
      where: { isActive: true }
    })

    const progressList: CertificationProgress[] = []

    for (const cert of certifications) {
      const progress = await this.getCertificationProgress(userId, cert.id)
      if (progress) {
        progressList.push(progress)
      }
    }

    return progressList
  }

  /**
   * Verify Certificate
   */
  static async verifyCertificate(verificationCode: string) {
    const cert = await prisma.userCertification.findUnique({
      where: { verificationCode },
      include: {
        user: true,
        certification: true
      }
    })

    if (!cert) return null

    // Verify signature
    const isValid = this.verifySignature(cert)

    return {
      valid: isValid && cert.status === 'ACTIVE',
      certificationNumber: cert.certificationNumber,
      certificationName: cert.certification.certificationName,
      holderName: cert.user.name,
      holderEmail: cert.user.email,
      issueDate: cert.issueDate,
      expiryDate: cert.expiryDate,
      status: cert.status,
      issuer: cert.certification.issuerName
    }
  }

  // Helper methods
  private static generateCertificationNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substr(2, 8).toUpperCase()
    return `CERT-${timestamp}-${random}`
  }

  private static generateVerificationCode(): string {
    return crypto.randomBytes(16).toString('hex').toUpperCase()
  }

  private static generateDigitalSignature(
    userId: string,
    certId: string,
    code: string
  ): string {
    const data = `${userId}:${certId}:${code}:${process.env.CERT_SECRET || 'default-secret'}`
    return crypto.createHash('sha256').update(data).digest('hex')
  }

  private static verifySignature(cert: any): boolean {
    const expectedSignature = this.generateDigitalSignature(
      cert.userId,
      cert.certificationId,
      cert.verificationCode
    )
    return cert.digitalSignature === expectedSignature
  }
}

export default CertificationEngine
