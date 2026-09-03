// GDPR Compliance Tools
import prisma from '@/lib/prisma'
import { Encryption } from '@/lib/security/encryption'
import { randomBytes } from 'crypto'

export class GDPR {
  static async exportUserData(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        enrollments: true,
        payments: true,
        transactions: true,
        assessmentResults: true,
        skillAssessments: true,
        submissions: true,
        watchHistory: true,
        pathEnrollments: true,
        stepCompletions: true,
        learningGoals: true,
        interactiveResults: true,
        scormProgress: true,
        voiceSubmissions: true,
        rewards: true,
        xpLogs: true,
        missionCompletions: true,
        creditPurchases: true,
        certificates: true,
        courseCertificates: true,
        courseBadges: true,
        careerCertificates: true,
        careerBadges: true,
        userSkillBadges: true,
        userCertifications: true,
        nodeProgress: true,
        videoSegments: true,
        scormRuntimeData: true,
        quizAttemptRecords: true,
        unlockLogs: true,
        certificateFiles: true,
        progressSummaries: true,
        notifications: true,
        courseTrackingEvents: true,
        profile: true,
        chatSessions: { include: { messages: true } }
      }
    })

    if (!user) throw new Error('User not found')

    const userData = Object.fromEntries(Object.entries(user).filter(([key]) => key !== 'password'))

    return {
      exportDate: new Date().toISOString(),
      userData,
      format: 'JSON',
      exportVersion: 2,
      note: 'Secrets and password hashes are intentionally excluded.'
    }
  }

  static async deleteUserData(userId: string) {
    const anonymizedId = randomBytes(16).toString('hex')
    await prisma.$transaction(async tx => {
      // Remove content that may contain free-form personal data or active credentials.
      await tx.apiKey.deleteMany({ where: { userId } })
      await tx.webhook.deleteMany({ where: { userId } })
      await tx.chatSession.deleteMany({ where: { userId } })
      await tx.voiceSubmission.deleteMany({ where: { studentId: userId } })
      await tx.notification.deleteMany({ where: { userId } })
      await tx.courseTrackingEvent.updateMany({ where: { userId }, data: { userId: null } })

      // Retain referential and legally relevant records under a pseudonymous account.
      await tx.user.update({
        where: { id: userId },
        data: {
          email: `deleted-${anonymizedId}@anonymized.invalid`,
          password: Encryption.hash(randomBytes(32).toString('hex')),
          name: 'Deleted User',
          nameEn: null,
          phone: null,
          birthDate: null,
          gender: null,
          education: null,
          occupation: null,
          address: null,
          province: null,
          postalCode: null,
          stripeCustomerId: null,
          certificateTemplate: null,
          credits: 0,
          totalXP: 0,
          level: 1,
          currentStreak: 0,
          maxStreak: 0,
          lastLoginDate: null
        }
      })
    })

    return { success: true, message: 'User data anonymized' }
  }

  static async checkRetention(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { createdAt: true, updatedAt: true }
    })

    if (!user) return null

    const retentionDays = parseInt(process.env.DATA_RETENTION_DAYS || '365')
    const daysSinceUpdate = Math.floor(
      (Date.now() - user.updatedAt.getTime()) / (1000 * 60 * 60 * 24)
    )

    return {
      shouldDelete: daysSinceUpdate > retentionDays,
      daysSinceUpdate,
      retentionDays
    }
  }
}
