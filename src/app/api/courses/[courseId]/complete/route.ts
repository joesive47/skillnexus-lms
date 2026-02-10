import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(
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

    // Check enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        },
      },
    })

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Not enrolled in this course' },
        { status: 403 }
      )
    }

    // Calculate course progress
    const courseProgress = await calculateCourseProgress(session.user.id, courseId)

    if (!courseProgress.isComplete) {
      return NextResponse.json({
        success: false,
        progress: courseProgress,
        message: `คุณยังเรียนไม่ครบ (${courseProgress.completedLessons}/${courseProgress.totalLessons} บทเรียน)`,
      })
    }

    // Check if certificate already issued
    let certificate = await prisma.courseCertificate.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        },
      },
      include: {
        course: {
          select: {
            title: true,
          },
        },
        definition: true,
      },
    })

    // Issue certificate if not exists
    if (!certificate) {
      certificate = await issueCertificate(session.user.id, courseId)
    }

    return NextResponse.json({
      success: true,
      courseComplete: true,
      progress: courseProgress,
      certificate,
      message: '🎉 ยินดีด้วย! คุณจบคอร์สนี้แล้ว',
    })

  } catch (error) {
    console.error('Error completing course:', error)
    return NextResponse.json(
      { error: 'Failed to complete course' },
      { status: 500 }
    )
  }
}

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

    const progress = await calculateCourseProgress(session.user.id, courseId)
    
    const certificate = await prisma.courseCertificate.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        },
      },
      include: {
        course: {
          select: {
            title: true,
          },
        },
      },
    })

    return NextResponse.json({
      progress,
      certificate,
      canIssueCertificate: progress.isComplete && !certificate,
    })

  } catch (error) {
    console.error('Error fetching course completion:', error)
    return NextResponse.json(
      { error: 'Failed to fetch completion status' },
      { status: 500 }
    )
  }
}

// Helper Functions
async function calculateCourseProgress(userId: string, courseId: string) {
  const lessons = await prisma.lesson.findMany({
    where: { courseId },
    select: { 
      id: true,
      isFinalExam: true,
    },
  })

  const watchHistories = await prisma.watchHistory.findMany({
    where: {
      userId,
      lessonId: { in: lessons.map(l => l.id) },
    },
  })

  const completedLessons = watchHistories.filter(wh => wh.completed).length
  const totalLessons = lessons.length
  const percentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

  // Check if final exam is completed
  const finalExamLesson = lessons.find(l => l.isFinalExam)
  const finalExamCompleted = finalExamLesson
    ? watchHistories.some(wh => wh.lessonId === finalExamLesson.id && wh.completed)
    : true // No final exam required

  return {
    totalLessons,
    completedLessons,
    percentage: Math.round(percentage),
    isComplete: percentage >= 100 && finalExamCompleted,
    finalExamCompleted,
    lessons: lessons.map(lesson => {
      const history = watchHistories.find(wh => wh.lessonId === lesson.id)
      return {
        id: lesson.id,
        isFinalExam: lesson.isFinalExam,
        completed: history?.completed || false,
        progress: history?.totalTime 
          ? Math.round((history.watchTime / history.totalTime) * 100)
          : 0,
      }
    }),
  }
}

async function issueCertificate(userId: string, courseId: string) {
  try {
    // Get certificate definition
    const definition = await prisma.courseCertificateDefinition.findUnique({
      where: { courseId },
    })

    if (!definition || !definition.isActive) {
      console.log('No active certificate definition for course:', courseId)
      return null
    }

    // Calculate expiry date
    const expiryDate = definition.expiryMonths
      ? new Date(Date.now() + definition.expiryMonths * 30 * 24 * 60 * 60 * 1000)
      : null

    // Issue certificate
    const certificate = await prisma.courseCertificate.create({
      data: {
        userId,
        courseId,
        definitionId: definition.id,
        expiryDate,
        status: 'ACTIVE',
      },
      include: {
        course: {
          select: {
            title: true,
          },
        },
        definition: true,
      },
    })

    // Create certification event
    await prisma.certificationEvent.create({
      data: {
        eventType: 'CERTIFICATE_ISSUED',
        userId,
        entityType: 'COURSE_CERTIFICATE',
        entityId: certificate.id,
        metadata: JSON.stringify({
          courseId,
          courseName: certificate.course.title,
          verificationCode: certificate.verificationCode,
        }),
      },
    })

    console.log(`✅ Certificate issued for user ${userId} on course ${courseId}`)

    return certificate

  } catch (error) {
    console.error('Error issuing certificate:', error)
    return null
  }
}
