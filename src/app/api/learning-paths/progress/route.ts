import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { learningPathService } from '@/lib/learning-path-service'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userPaths = await learningPathService.getUserPaths(session.user.id)

    return NextResponse.json({ paths: userPaths })
  } catch (error) {
    console.error('Error fetching user progress:', error)
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { stepId, score, timeSpent, difficulty, feedback } = await request.json()

    if (!stepId) {
      return NextResponse.json({ error: 'Step ID is required' }, { status: 400 })
    }

    const completion = await learningPathService.completeStep(
      session.user.id,
      stepId,
      { score, timeSpent, difficulty, feedback }
    )

    // Update learning streak
    await learningPathService.updateLearningStreak(session.user.id)

    return NextResponse.json({ completion })
  } catch (error) {
    console.error('Error updating progress:', error)
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    )
  }
}