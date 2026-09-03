import { NextRequest, NextResponse } from 'next/server'
import { submitQuizSession } from '@/lib/quiz-session'
import { AccessError, publicError } from '@/lib/access-control'
export async function POST(request: NextRequest) {
  try {
    const { quizId, lessonId, answers, attemptId } = await request.json()
    if (typeof quizId !== 'string' || typeof lessonId !== 'string' || typeof attemptId !== 'string') throw new AccessError('Quiz, lesson and attempt IDs are required', 400)
    return NextResponse.json(await submitQuizSession(quizId, lessonId, answers, attemptId))
  } catch (error) { return NextResponse.json({ error: publicError(error) }, { status: error instanceof AccessError ? error.status : 500 }) }
}
