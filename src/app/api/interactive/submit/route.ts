import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { lessonId, score, passed } = await request.json()

    if (!lessonId || score === undefined || passed === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Save interactive result
    const result = await prisma.interactiveResults.upsert({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId: lessonId
        }
      },
      update: {
        score,
        passed,
        completedAt: new Date()
      },
      create: {
        userId: session.user.id,
        lessonId,
        score,
        passed,
        completedAt: new Date()
      }
    })

    // If passed, unlock next lesson
    if (passed) {
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: { nextLesson: true }
      })

      if (lesson?.nextLesson) {
        // Mark next lesson as accessible by creating watch history
        await prisma.watchHistory.upsert({
          where: {
            userId_lessonId: {
              userId: session.user.id,
              lessonId: lesson.nextLesson.id
            }
          },
          update: {},
          create: {
            userId: session.user.id,
            lessonId: lesson.nextLesson.id,
            watchTime: 0,
            totalTime: 0,
            completed: false
          }
        })
      }
    }

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error('Interactive submit error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}