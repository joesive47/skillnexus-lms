import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId

    // Get user gamification data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: {
          include: {
            badges: {
              include: {
                badge: true
              }
            },
            achievements: {
              include: {
                badge: true
              }
            }
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Calculate level and XP
    const totalXP = user.profile?.totalPoints || 0
    const level = user.profile?.level || 1
    const currentLevelXP = totalXP % 1000
    const xpToNext = 1000 - currentLevelXP

    // Get achievements
    const allBadges = await prisma.badge.findMany()
    const userBadgeIds = user.profile?.badges.map(ub => ub.badgeId) || []

    const achievements = allBadges.map(badge => ({
      id: badge.id,
      name: badge.name,
      description: badge.description,
      icon: badge.icon,
      unlocked: userBadgeIds.includes(badge.id),
      unlockedAt: user.profile?.badges.find(ub => ub.badgeId === badge.id)?.earnedAt
    }))

    // Get leaderboard rank
    const higherRankedUsers = await prisma.userProfile.count({
      where: {
        totalPoints: {
          gt: totalXP
        }
      }
    })

    const stats = {
      level,
      xp: currentLevelXP,
      xpToNext,
      totalXP,
      streak: user.profile?.streak || 0,
      achievements,
      badges: user.profile?.badges || [],
      leaderboardRank: higherRankedUsers + 1
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error('Gamification stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch gamification stats' },
      { status: 500 }
    )
  }
}