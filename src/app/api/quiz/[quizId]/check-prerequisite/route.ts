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

    // 1. ดึงข้อมูล Quiz (ไม่ query prerequisiteQuizId เพราะ column อาจไม่มีใน DB)
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      select: {
        id: true,
        title: true,
        passScore: true
      }
    })

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      )
    }

    // 2. ชั่วคราว: ถ้า DB ไม่มี prerequisiteQuizId field, ให้เข้าได้เลย
    // TODO: Run migration to add prerequisiteQuizId column when ready
    return NextResponse.json({
      canAccess: true,
      message: 'No prerequisite check (feature pending migration)'
    })

  } catch (error) {
    console.error('Error checking quiz prerequisite:', error)
    // Return canAccess: true on error to not block users
    return NextResponse.json({
      canAccess: true,
      message: 'Prerequisite check skipped due to error'
    })
  }
}
