import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

/**
 * API: Check Quiz Prerequisite
 * ตรวจสอบว่า user ผ่านเงื่อนไขที่ต้องทำก่อนหรือยัง
 * 
 * GET /api/quiz/[quizId]/check-prerequisite
 * 
 * Response:
 * - canAccess: true/false
 * - reason: เหตุผลที่ล็อค (ถ้า canAccess = false)
 * - prerequisiteQuizTitle: ชื่อ Quiz ที่ต้องทำก่อน
 * - requiredScore: คะแนนที่ต้องได้
 * - userBestScore: คะแนนสูงสุดที่ user เคยได้
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { quizId } = await params

    // 1. ดึงข้อมูล Quiz พร้อม prerequisite
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        prerequisiteQuiz: {
          select: {
            id: true,
            title: true,
            passScore: true
          }
        }
      }
    })

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      )
    }

    // 2. ถ้าไม่มี prerequisite ให้เข้าได้เลย
    if (!quiz.prerequisiteQuizId || !quiz.prerequisiteQuiz) {
      return NextResponse.json({
        canAccess: true,
        message: 'No prerequisite required'
      })
    }

    // 3. เช็คว่า user เคยทำ prerequisite quiz หรือยัง
    const prerequisiteAttempt = await prisma.quizAttemptRecord.findFirst({
      where: {
        userId: session.user.id,
        quizId: quiz.prerequisiteQuizId,
        passed: true
      },
      orderBy: {
        score: 'desc' // เอาคะแนนสูงสุด
      }
    })

    // 4. ถ้ายังไม่เคยทำหรือไม่ผ่าน
    if (!prerequisiteAttempt) {
      return NextResponse.json({
        canAccess: false,
        reason: 'prerequisite_not_passed',
        prerequisiteQuiz: {
          id: quiz.prerequisiteQuiz.id,
          title: quiz.prerequisiteQuiz.title,
          requiredScore: quiz.prerequisiteQuiz.passScore,
          userBestScore: null
        },
        message: `ต้องทำ "${quiz.prerequisiteQuiz.title}" ให้ผ่านก่อน (คะแนนขั้นต่ำ: ${quiz.prerequisiteQuiz.passScore}%)`
      })
    }

    // 5. ผ่านแล้ว ให้เข้าได้
    return NextResponse.json({
      canAccess: true,
      prerequisiteQuiz: {
        id: quiz.prerequisiteQuiz.id,
        title: quiz.prerequisiteQuiz.title,
        requiredScore: quiz.prerequisiteQuiz.passScore,
        userBestScore: prerequisiteAttempt.score
      },
      message: 'Prerequisite passed'
    })

  } catch (error) {
    console.error('Error checking quiz prerequisite:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
