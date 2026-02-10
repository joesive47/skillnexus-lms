import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { courseId } = params

    // Get all lessons with progress
    const lessons = await prisma.lesson.findMany({
      where: { courseId },
      include: {
        module: {
          select: {
            id: true,
            title: true,
            order: true,
          },
        },
      },
      orderBy: [
        { moduleId: 'asc' },
        { order: 'asc' },
      ],
    })

    // Get watch histories
    const watchHistories = await prisma.watchHistory.findMany({
      where: {
        userId: session.user.id,
        lessonId: { in: lessons.map(l => l.id) },
      },
    })

    // Calculate progress
    const lessonsWithProgress = lessons.map(lesson => {
      const history = watchHistories.find(wh => wh.lessonId === lesson.id)
      const progressPercent = history?.totalTime 
        ? Math.round((history.watchTime / history.totalTime) * 100)
        : 0

      return {
        id: lesson.id,
        title: lesson.title,
        type: lesson.lessonType,
        isFinalExam: lesson.isFinalExam,
        module: lesson.module,
        completed: history?.completed || false,
        watchTime: history?.watchTime || 0,
        totalTime: history?.totalTime || 0,
        progressPercent,
        lastWatched: history?.updatedAt,
      }
    })

    const completedCount = lessonsWithProgress.filter(l => l.completed).length
    const totalCount = lessons.length
    const overallProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

    // Check final exam status
    const finalExam = lessonsWithProgress.find(l => l.isFinalExam)
    const finalExamPassed = finalExam?.completed || false

    // Check for certificate
    const certificate = await prisma.courseCertificate.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        },
      },
    })

    return NextResponse.json({
      progress: {
        completedLessons: completedCount,
        totalLessons: totalCount,
        percentage: overallProgress,
        isComplete: overallProgress >= 100 && finalExamPassed,
      },
      lessons: lessonsWithProgress,
      finalExam: finalExam ? {
        id: finalExam.id,
        title: finalExam.title,
        completed: finalExam.completed,
        passed: finalExamPassed,
      } : null,
      certificate,
      canIssueCertificate: overallProgress >= 100 && finalExamPassed && !certificate,
    })

  } catch (error) {
    console.error('Error fetching progress:', error)
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    )
  }
}
