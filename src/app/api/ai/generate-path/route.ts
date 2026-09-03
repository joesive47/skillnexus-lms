import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { aiPathGenerator } from '@/lib/ai-path-generator'
import { learningPathService } from '@/lib/learning-path-service'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const {
      careerId,
      skillIds,
      difficulty,
      timeCommitment,
      learningStyle,
      goals,
      autoEnroll = false
    } = data

    // Generate AI-powered learning path
    const generatedPath = await aiPathGenerator.generatePersonalizedPath({
      userId: session.user.id,
      careerId,
      skillIds,
      difficulty,
      timeCommitment,
      learningStyle,
      goals
    })

    // Optionally create and enroll in the path
    let createdPath = null
    if (autoEnroll) {
      createdPath = await learningPathService.createLearningPath({
        title: generatedPath.title,
        description: generatedPath.description,
        careerId,
        difficulty: generatedPath.difficulty,
        estimatedHours: generatedPath.estimatedHours,
        isPublic: false,
        createdBy: session.user.id
      })

      // Add steps to the created path
      for (const step of generatedPath.steps) {
        await learningPathService.addStepToPath(createdPath.id, {
          title: step.title,
          description: step.description,
          type: step.type,
          targetId: step.targetId,
          estimatedHours: step.estimatedHours,
          order: step.order,
          prerequisites: step.prerequisites
        })
      }

      // Enroll user in the path
      await learningPathService.enrollUserInPath(
        session.user.id,
        createdPath.id,
        { learningStyle, timeGoal: timeCommitment }
      )
    }

    return NextResponse.json({
      generatedPath,
      createdPath,
      enrolled: autoEnroll
    })

  } catch (error) {
    console.error('Error generating learning path:', error)
    return NextResponse.json(
      { error: 'Failed to generate learning path' },
      { status: 500 }
    )
  }
}