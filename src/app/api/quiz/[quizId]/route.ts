import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getQuizForStudent } from '@/app/actions/quiz'
import prisma from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { quizId } = await params

    // Get quiz details
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      select: {
        id: true,
        title: true,
        passScore: true,
        lesson: {
          select: {
            courseId: true
          }
        }
      }
    })

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    // Check enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: quiz.lesson.courseId
        }
      }
    })

    const hasAccess = enrollment || session.user.role === 'ADMIN' || session.user.role === 'TEACHER'
    if (!hasAccess) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Get randomized/filtered questions
    const quizDataResult = await getQuizForStudent(quizId)
    
    if (!quizDataResult.success || !quizDataResult.questions) {
      return NextResponse.json({ error: quizDataResult.error || 'Failed to load quiz' }, { status: 500 })
    }

    // Return sanitized data
    return NextResponse.json({
      id: quiz.id,
      title: quiz.title,
      passScore: quiz.passScore || 80,
      questions: quizDataResult.questions
    })
  } catch (error) {
    console.error('[QUIZ_API_ERROR]', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
