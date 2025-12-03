import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { predictCareerSuccess } from '@/lib/career/ai-engine'

export async function POST(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { targetCareer, currentSkills, learningVelocity } = body

    if (!targetCareer) {
      return NextResponse.json(
        { success: false, error: 'Missing target career' },
        { status: 400 }
      )
    }

    const analysis = predictCareerSuccess(
      currentSkills || [],
      targetCareer,
      learningVelocity || 1.0
    )

    return NextResponse.json({
      success: true,
      data: analysis
    })
  } catch (error) {
    console.error('Error predicting career:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to predict career success' },
      { status: 500 }
    )
  }
}