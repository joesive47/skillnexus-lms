import { NextRequest, NextResponse } from 'next/server'
import { submitQuizSession } from '@/lib/quiz-session'
import prisma from '@/lib/prisma'
import { AccessError, publicError, requireUser } from '@/lib/access-control'
import { issueCertificateOnCompletion } from '@/lib/issue-certificate'
export async function POST(request: NextRequest) {
  try {
    const user = await requireUser()
    const { quizId, lessonId, answers, attemptId } = await request.json()
    if (typeof quizId !== 'string' || typeof lessonId !== 'string' || typeof attemptId !== 'string') throw new AccessError('Quiz, lesson and attempt IDs are required', 400)
    const result = await submitQuizSession(quizId, lessonId, answers, attemptId)
    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId }, select: { courseId: true } })
    const certificate = result.passed && lesson ? await issueCertificateOnCompletion(user.id, lesson.courseId) : null
    return NextResponse.json({ ...result, certificate })
  } catch (error) { return NextResponse.json({ error: publicError(error) }, { status: error instanceof AccessError ? error.status : 500 }) }
}
