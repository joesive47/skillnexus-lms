import { NextRequest, NextResponse } from 'next/server'
import { aiContentGenerator } from '@/lib/ai/content-generator'
import { intelligentTutor } from '@/lib/ai/intelligent-tutor'

export async function POST(request: NextRequest) {
  try {
    const { action, topic, difficulty, questionCount, title, objectives, duration, studentId, answer, question, correctAnswer, currentSkills, targetRole } = await request.json()

    switch (action) {
      case 'generateQuiz':
        const quiz = await aiContentGenerator.generateQuiz(
          topic,
          difficulty,
          questionCount
        )
        return NextResponse.json({ success: true, data: quiz })

      case 'generateLesson':
        const lesson = await aiContentGenerator.generateLessonContent(
          title,
          objectives,
          duration
        )
        return NextResponse.json({ success: true, data: lesson })

      case 'analyzeProgress':
        const analysis = await intelligentTutor.analyzeStudentProgress(studentId)
        return NextResponse.json({ success: true, data: analysis })

      case 'provideFeedback':
        const feedback = await intelligentTutor.provideFeedback(
          answer,
          question,
          correctAnswer
        )
        return NextResponse.json({ success: true, data: feedback })

      case 'suggestPath':
        const path = await intelligentTutor.suggestNextSteps(
          currentSkills,
          targetRole
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