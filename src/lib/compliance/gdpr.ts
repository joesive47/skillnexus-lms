// GDPR Compliance Tools
import prisma from '@/lib/prisma'
import { Encryption } from '@/lib/security/encryption'

export class GDPR {
  static async exportUserData(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) throw new Error('User not found')

    const { password, ...userData } = user

    return {
      exportDate: new Date().toISOString(),
      userData,
      format: 'JSON',
      gdprCompliant: true
    }
  }

  static async deleteUserData(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        email: `deleted-${userId}@anonymized.local`,
        name: 'Deleted User',
        password: Encryption.hash('deleted')
      }
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
