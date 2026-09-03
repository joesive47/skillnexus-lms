import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

/**
 * API: Check Quiz Retry Cooldown
 * เช็คว่า user สามารถทำแบบทดสอบใหม่ได้หรือยัง (หลังจากสอบไม่ผ่าน)
 * 
 * GET /api/quiz/[quizId]/check-retry
 * 
 * Response:
 * - canRetry: true/false
 * - reason: เหตุผลที่ยังทำไม่ได้ (ถ้า canRetry = false)
 * - remainingSeconds: เวลาที่เหลือต้องรอ (วินาที)
 * - nextAvailableTime: เวลาที่สามารถทำใหม่ได้
 * - lastAttempt: ข้อมูล attempt ล่าสุด
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

    // 1. ดึงข้อมูล Quiz (ไม่ query retryDelayMinutes เพราะ column อาจไม่มีใน DB)
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

    // 2. ชั่วคราว: ถ้า DB ไม่มี retryDelayMinutes field, ให้ retry ได้เลย
    // TODO: Run migration to add retryDelayMinutes column when ready
    return NextResponse.json({
      canRetry: true,
      message: 'No retry delay (feature pending migration)'
    })

  } catch (error) {
    console.error('Error checking quiz retry status:', error)
    // Return canRetry: true on error to not block users
    return NextResponse.json({
      canRetry: true,
      message: 'Retry check skipped due to error'
    })
  }
}
