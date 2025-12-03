import { NextRequest, NextResponse } from 'next/server'
import { aiContentGenerator } from '@/lib/ai/content-generator'
import { intelligentTutor } from '@/lib/ai/intelligent-tutor'

export async function POST(request: NextRequest) {
  try {
    const { action, ...params } = await request.json()

    switch (action) {
      case 'generateQuiz':
        const quiz = await aiContentGenerator.generateQuiz(
          params.topic,
          params.difficulty,
          params.questionCount
        )
        return NextResponse.json({ success: true, data: quiz })

      case 'generateLesson':
        const lesson = await aiContentGenerator.generateLessonContent(
          params.title,
          params.objectives,
          params.duration
        )
        return NextResponse.json({ success: true, data: lesson })

      case 'analyzeProgress':
        const analysis = await intelligentTutor.analyzeStudentProgress(params.studentId)
        return NextResponse.json({ success: true, data: analysis })

      case 'provideFeedback':
        const feedback = await intelligentTutor.provideFeedback(
          params.answer,
          params.question,
          params.correctAnswer
        )
        return NextResponse.json({ success: true, data: feedback })

      case 'suggestPath':
        const path = await intelligentTutor.suggestNextSteps(
          params.currentSkills,
          params.targetRole
        )
        return NextResponse.json({ success: true, data: path })

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('AI Assistant API Error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}