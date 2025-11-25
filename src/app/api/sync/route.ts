import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { validateInput } from '@/middleware/security'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { watchProgress, quizAnswers } = validateInput(body)

    // Sync watch progress
    if (watchProgress && Array.isArray(watchProgress)) {
      for (const progress of watchProgress) {
        await prisma.watchHistory.upsert({
          where: {
            userId_lessonId: {
              userId: session.user.id,
              lessonId: progress.lessonId
            }
          },
          update: {
            watchTime: progress.watchTime,
            completed: progress.completed
          },
          create: {
            userId: session.user.id,
            lessonId: progress.lessonId,
            watchTime: progress.watchTime,
            completed: progress.completed
          }
        })
      }
    }

    // Sync quiz answers
    if (quizAnswers && Array.isArray(quizAnswers)) {
      for (const answer of quizAnswers) {
        await prisma.studentSubmission.create({
          data: {
            userId: session.user.id,
            quizId: answer.quizId,
            answers: JSON.stringify(answer.answers),
            score: answer.score,
            passed: answer.passed
          }
        })
      }
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 })
  }
}