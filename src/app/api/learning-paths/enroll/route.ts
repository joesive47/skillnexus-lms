import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { learningPathService } from '@/lib/learning-path-service'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { pathId, learningStyle, timeGoal } = await request.json()

    if (!pathId) {
      return NextResponse.json({ error: 'Path ID is required' }, { status: 400 })
    }

    const enrollment = await learningPathService.enrollUserInPath(
      session.user.id,
      pathId,
      { learningStyle, timeGoal }
    )

    return NextResponse.json({ enrollment }, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Already enrolled in this path' },
        { status: 409 }
      )
    }
    
    console.error('Error enrolling in learning path:', error)
    return NextResponse.json(
      { error: 'Failed to enroll in learning path' },
      { status: 500 }
    )
  }
}