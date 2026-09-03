import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { AccessError, publicError, requireSelfOrAdmin } from '@/lib/access-control'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params
    await requireSelfOrAdmin(userId)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Get daily missions
    const missions = await prisma.dailyMission.findMany({
      where: { isActive: true },
      include: {
        completions: {
          where: {
            userId,
            date: {
              gte: today
            }
          }
        }
      }
    })

    // Format missions with progress
    const formattedMissions = missions.map(mission => {
      const completion = mission.completions[0]
      return {
        id: mission.id,
        title: mission.title,
        description: mission.description,
        type: mission.type,
        target: mission.target,
        xpReward: mission.xpReward,
        creditReward: mission.creditReward,
        progress: completion?.progress || 0,
        completed: completion?.completed || false
      }
    })

    return NextResponse.json({ missions: formattedMissions })
  } catch (error) {
    console.error('Get missions error:', error)
    return NextResponse.json(
      { error: publicError(error) },
      { status: error instanceof AccessError ? error.status : 500 }
    )
  }
}
