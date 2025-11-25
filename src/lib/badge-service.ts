import { prisma } from '@/lib/prisma'

export class BadgeService {
  async checkBadgeEligibility(userId: string, badgeId: string): Promise<boolean> {
    const badge = await prisma.badge.findUnique({
      where: { id: badgeId }
    })

    if (!badge || !badge.isActive) return false

    // Check if user already has this badge
    const existingBadge = await prisma.userBadge.findUnique({
      where: { userId_badgeId: { userId, badgeId } }
    })
    if (existingBadge) return false

    // For demo purposes, return true if user has any enrollments
    const enrollments = await prisma.enrollment.findMany({
      where: { userId }
    })

    return enrollments.length > 0
  }

  async issueBadge(userId: string, badgeId: string): Promise<string | null> {
    const isEligible = await this.checkBadgeEligibility(userId, badgeId)
    if (!isEligible) return null

    // Create user profile if it doesn't exist
    await prisma.userProfile.upsert({
      where: { userId },
      create: { userId },
      update: {}
    })

    const userBadge = await prisma.userBadge.create({
      data: {
        userId,
        badgeId
      }
    })

    return `VERIFY-${userBadge.id}`
  }

  async checkAllBadgesForUser(userId: string): Promise<string[]> {
    const badges = await prisma.badge.findMany({
      where: { isActive: true }
    })

    const issuedBadges: string[] = []

    for (const badge of badges) {
      const verifyCode = await this.issueBadge(userId, badge.id)
      if (verifyCode) {
        issuedBadges.push(verifyCode)
      }
    }

    return issuedBadges
  }

  async getUserBadges(userId: string) {
    return await prisma.userBadge.findMany({
      where: { userId },
      include: {
        badge: true
      },
      orderBy: { earnedAt: 'desc' }
    })
  }

  async getBadgeByVerifyCode(verifyCode: string) {
    // Extract badge ID from verify code
    const badgeId = verifyCode.replace('VERIFY-', '')
    
    const userBadge = await prisma.userBadge.findUnique({
      where: { id: badgeId },
      include: {
        badge: true
      }
    })

    if (!userBadge) return null

    // Get the user separately
    const user = await prisma.user.findUnique({
      where: { id: userBadge.userId }
    })

    return {
      ...userBadge,
      user
    }
  }
}