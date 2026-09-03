import prisma from './prisma'
import { isFeatureEnabled } from './feature-flags'
import { safeExecute } from './fallback'

export class GamificationService {
  static async awardPoints(userId: string, points: number, source: string) {
    if (!(await isFeatureEnabled('gamification'))) return null

    return safeExecute(
      async () => {
        const user = await prisma.user.update({
          where: { id: userId },
          data: {
            credits: { increment: points }
          }
        })
        
        console.log(`Points awarded: ${points} to ${userId} for ${source}`)
        return user
      },
      () => null
    )
  }

  static async getUserStats(userId: string) {
    if (!(await isFeatureEnabled('gamification'))) return null

    return safeExecute(
      async () => {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { credits: true }
        })
        
        return {
          points: user?.credits || 0,
          level: Math.floor((user?.credits || 0) / 100) + 1,
          nextLevelPoints: ((Math.floor((user?.credits || 0) / 100) + 1) * 100) - (user?.credits || 0)
        }
      },
      () => ({ points: 0, level: 1, nextLevelPoints: 100 })
    )
  }
}

export const awardPoints = GamificationService.awardPoints