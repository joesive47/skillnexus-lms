// Phase 3: Advanced Gamification System
import { prisma } from './prisma'

export interface GamificationEvent {
  userId: string
  action: string
  points: number
  metadata?: any
}

export class GamificationEngine {
  // Award points and check for achievements
  static async awardPoints(event: GamificationEvent) {
    const { userId, action, points, metadata } = event

    // Update user profile
    const profile = await prisma.userProfile.upsert({
      where: { userId },
      create: {
        userId,
        experience: points,
        totalPoints: points,
        level: 1
      },
      update: {
        experience: { increment: points },
        totalPoints: { increment: points },
        lastActivity: new Date()
      }
    })

    // Calculate new level
    const newLevel = Math.floor(profile.experience / 1000) + 1
    if (newLevel > profile.level) {
      await prisma.userProfile.update({
        where: { userId },
        data: { level: newLevel }
      })
    }

    // Check for achievements
    await this.checkAchievements(userId, action, metadata)

    // Update leaderboards
    await this.updateLeaderboards(userId, points)

    return { points, newLevel, totalPoints: profile.totalPoints + points }
  }

  // Check and award achievements
  static async checkAchievements(userId: string, action: string, metadata?: any) {
    const badges = await prisma.badge.findMany({ where: { isActive: true } })
    
    for (const badge of badges) {
      const criteria = JSON.parse(badge.criteria || '{}')
      
      if (await this.meetsAchievementCriteria(userId, action, criteria, metadata)) {
        // Check if user already has this badge
        const existing = await prisma.userAchievement.findUnique({
          where: { userId_badgeId: { userId, badgeId: badge.id } }
        })

        if (!existing) {
          await prisma.userAchievement.create({
            data: {
              userId,
              badgeId: badge.id,
              progress: 100,
              metadata: JSON.stringify(metadata)
            }
          })

          // Award badge points
          await this.awardPoints({
            userId,
            action: 'badge_earned',
            points: badge.points,
            metadata: { badgeId: badge.id }
          })
        }
      }
    }
  }

  // Check if user meets achievement criteria
  static async meetsAchievementCriteria(userId: string, action: string, criteria: any, metadata?: any): Promise<boolean> {
    switch (criteria.type) {
      case 'course_completion':
        const completedCourses = await prisma.enrollment.count({
          where: { userId, /* add completion check */ }
        })
        return completedCourses >= criteria.count

      case 'lesson_streak':
        const profile = await prisma.userProfile.findUnique({ where: { userId } })
        return (profile?.streak || 0) >= criteria.days

      case 'quiz_score':
        const highScores = await prisma.studentSubmission.count({
          where: { userId, score: { gte: criteria.minScore } }
        })
        return highScores >= criteria.count

      default:
        return false
    }
  }

  // Update leaderboards
  static async updateLeaderboards(userId: string, points: number) {
    const now = new Date()
    const weekPeriod = `${now.getFullYear()}-W${Math.ceil(now.getDate() / 7)}`
    const monthPeriod = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`

    // Weekly leaderboard
    await prisma.leaderboardEntry.upsert({
      where: { userId_category_period: { userId, category: 'weekly', period: weekPeriod } },
      create: { userId, category: 'weekly', period: weekPeriod, points },
      update: { points: { increment: points }, updatedAt: now }
    })

    // Monthly leaderboard
    await prisma.leaderboardEntry.upsert({
      where: { userId_category_period: { userId, category: 'monthly', period: monthPeriod } },
      create: { userId, category: 'monthly', period: monthPeriod, points },
      update: { points: { increment: points }, updatedAt: now }
    })

    // All-time leaderboard
    await prisma.leaderboardEntry.upsert({
      where: { userId_category_period: { userId, category: 'all_time', period: 'all' } },
      create: { userId, category: 'all_time', period: 'all', points },
      update: { points: { increment: points }, updatedAt: now }
    })
  }

  // Get user's gamification status
  static async getUserStatus(userId: string) {
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
      include: {
        badges: true,
        achievements: { include: { badge: true } },
        leaderboards: { orderBy: { points: 'desc' } }
      }
    })

    if (!profile) {
      return {
        level: 1,
        experience: 0,
        totalPoints: 0,
        streak: 0,
        badges: [],
        achievements: [],
        leaderboardRank: null
      }
    }

    return profile
  }

  // Get leaderboard
  static async getLeaderboard(category: string = 'all_time', limit: number = 10) {
    return await prisma.leaderboardEntry.findMany({
      where: { category },
      orderBy: { points: 'desc' },
      take: limit,
      include: {
        profile: {
          include: { user: { select: { name: true, email: true } } }
        }
      }
    })
  }
}