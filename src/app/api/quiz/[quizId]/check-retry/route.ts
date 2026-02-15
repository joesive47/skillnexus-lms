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

    // 1. ดึงข้อมูล Quiz พร้อม retry delay setting
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      select: {
        id: true,
        title: true,
        retryDelayMinutes: true,
        passScore: true
      }
    })

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      )
    }

    // 2. ถ้าไม่มีการตั้ง retry delay หรือเป็น 0 ให้ทำได้เลย
    if (!quiz.retryDelayMinutes || quiz.retryDelayMinutes === 0) {
      return NextResponse.json({
        canRetry: true,
        message: 'No retry delay configured'
      })
    }

    // 3. หา attempt ล่าสุดของ user
    const lastAttempt = await prisma.quizAttemptRecord.findFirst({
      where: {
        userId: session.user.id,
        quizId: quizId
      },
      orderBy: {
        submittedAt: 'desc'
      },
      select: {
        id: true,
        score: true,
        passed: true,
        submittedAt: true,
        attemptNumber: true
      }
    })

    // 4. ถ้ายังไม่เคยทำให้ทำได้เลย
    if (!lastAttempt) {
      return NextResponse.json({
        canRetry: true,
        message: 'No previous attempts'
      })
    }

    // 5. ถ้าทำผ่านแล้วให้ทำได้เลย (ไม่จำกัด)
    if (lastAttempt.passed) {
      return NextResponse.json({
        canRetry: true,
        lastAttempt: {
          score: lastAttempt.score,
          passed: lastAttempt.passed,
          submittedAt: lastAttempt.submittedAt
        },
        message: 'Already passed, can retry without restriction'
      })
    }

    // 6. ถ้าทำไม่ผ่าน เช็คว่าต้องรอหรือยัง
    const now = new Date()
    const lastSubmitTime = new Date(lastAttempt.submittedAt)
    const delayMilliseconds = quiz.retryDelayMinutes * 60 * 1000
    const nextAvailableTime = new Date(lastSubmitTime.getTime() + delayMilliseconds)
    const remainingMilliseconds = nextAvailableTime.getTime() - now.getTime()

    // 7. ถ้าเวลาผ่านไปแล้วให้ทำได้
    if (remainingMilliseconds <= 0) {
      return NextResponse.json({
        canRetry: true,
        lastAttempt: {
          score: lastAttempt.score,
          passed: lastAttempt.passed,
          submittedAt: lastAttempt.submittedAt,
          attemptNumber: lastAttempt.attemptNumber
        },
        message: 'Cooldown expired, can retry now'
      })
    }

    // 8. ยังต้องรอต่อ
    const remainingSeconds = Math.ceil(remainingMilliseconds / 1000)
    const remainingMinutes = Math.floor(remainingSeconds / 60)
    const remainingSecondsDisplay = remainingSeconds % 60

    return NextResponse.json({
      canRetry: false,
      reason: 'cooldown_active',
      remainingSeconds: remainingSeconds,
      remainingMinutes: remainingMinutes,
      remainingSecondsDisplay: remainingSecondsDisplay,
      nextAvailableTime: nextAvailableTime.toISOString(),
      lastAttempt: {
        score: lastAttempt.score,
        passed: lastAttempt.passed,
        submittedAt: lastAttempt.submittedAt,
        attemptNumber: lastAttempt.attemptNumber
      },
      quiz: {
        title: quiz.title,
        retryDelayMinutes: quiz.retryDelayMinutes,
        passScore: quiz.passScore
      },
      message: `กรุณารออีก ${remainingMinutes} นาที ${remainingSecondsDisplay} วินาที ก่อนทำแบบทดสอบใหม่`
    })

  } catch (error) {
    console.error('Error checking quiz retry cooldown:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
