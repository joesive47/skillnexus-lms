import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getQuizForStudent } from '@/app/actions/quiz'
import prisma from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    console.log('[QUIZ_API] Request received')
    
    const session = await auth()
    if (!session?.user?.id) {
      console.log('[QUIZ_API] Unauthorized - no session')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.log('[QUIZ_API] User authenticated:', session.user.id)

    const { quizId } = await params
    console.log('[QUIZ_API] Quiz ID:', quizId)

    // Get quiz details
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      select: {
        id: true,
        title: true,
        passScore: true,
        courseId: true
      }
    })

    if (!quiz || !quiz.courseId) {
      console.log('[QUIZ_API] Quiz not found:', quizId)
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }
    console.log('[QUIZ_API] Quiz found:', quiz.title, 'courseId:', quiz.courseId)

    // Check enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: quiz.courseId
        }
      }
    })

    const hasAccess = enrollment || session.user.role === 'ADMIN' || session.user.role === 'TEACHER'
    if (!hasAccess) {
      console.log('[QUIZ_API] Access denied for user:', session.user.id, 'courseId:', quiz.courseId)
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }
    console.log('[QUIZ_API] Access granted, fetching questions...')

    // Get randomized/filtered questions
    const quizDataResult = await getQuizForStudent(quizId)
    
    if (!quizDataResult.success || !quizDataResult.questions) {
      console.log('[QUIZ_API] Failed to get questions:', quizDataResult.error)
      return NextResponse.json({ error: quizDataResult.error || 'Failed to load quiz' }, { status: 500 })
    }
    console.log('[QUIZ_API] Questions loaded:', quizDataResult.questions.length)

    // Return sanitized data
    return NextResponse.json({
      id: quiz.id,
      title: quiz.title,
      passScore: quiz.passScore || 80,
      questions: quizDataResult.questions
    })
  } catch (error) {
    console.error('[QUIZ_API_ERROR]', error instanceof Error ? error.message : 'Unknown error')
    console.error('[QUIZ_API_ERROR] Stack:', error instanceof Error ? error.stack : '')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
