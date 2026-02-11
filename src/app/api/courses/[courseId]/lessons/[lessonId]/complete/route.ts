import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: { courseId: string; lessonId: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { courseId, lessonId } = params
    const body = await req.json()
    const { watchTime, totalTime, completed = false } = body

    // Validate lesson belongs to course
    const lesson = await prisma.lesson.findFirst({
      where: {
        id: lessonId,
        courseId,
      },
    })

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      )
    }

    // Update or create watch history
    const watchHistory = await prisma.watchHistory.upsert({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId,
        },
      },
      update: {
        watchTime: watchTime || 0,
        totalTime: totalTime || 0,
        completed: completed || (watchTime && totalTime ? watchTime / totalTime >= 0.8 : false),
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        lessonId,
        watchTime: watchTime || 0,
        totalTime: totalTime || 0,
        completed: completed || (watchTime && totalTime ? watchTime / totalTime >= 0.8 : false),
      },
    })

    // Check if this was a final exam
    if (lesson.isFinalExam && watchHistory.completed) {
      // Check course completion for certificate
      const courseProgress = await calculateCourseProgress(session.user.id, courseId)
      
      if (courseProgress.isComplete) {
        // Issue certificate
        const certificate = await issueCertificate(session.user.id, courseId)
        
        return NextResponse.json({
          success: true,
          watchHistory,
          courseComplete: true,
          certificate,
          message: '🎉 ยินดีด้วย! คุณผ่านสอบไฟนอลและจบคอร์สแล้ว'
        })
      }
    }

    return NextResponse.json({
      success: true,
      watchHistory,
      message: completed ? '✅ บันทึกความก้าวหน้าสำเร็จ' : '📊 อัพเดทความก้าวหน้า',
    })

  } catch (error) {
    console.error('Error updating lesson progress:', error)
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    )
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { courseId: string; lessonId: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { lessonId } = params

    const watchHistory = await prisma.watchHistory.findUnique({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId,
        },
      },
    })

    return NextResponse.json({
      watchHistory: watchHistory || null,
      progress: watchHistory?.totalTime 
        ? Math.round((watchHistory.watchTime / watchHistory.totalTime) * 100)
        : 0,
    })

  } catch (error) {
    console.error('Error fetching lesson progress:', error)
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    )
  }
}

// Helper Functions
async function calculateCourseProgress(userId: string, courseId: string) {
  const lessons = await prisma.lesson.findMany({
    where: { courseId },
    select: { id: true },
  })

  const completedLessons = await prisma.watchHistory.count({
    where: {
      userId,
      lessonId: { in: lessons.map(l => l.id) },
      completed: true,
    },
  })

  const totalLessons = lessons.length
  const percentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

  return {
    totalLessons,
    completedLessons,
    percentage: Math.round(percentage),
    isComplete: percentage >= 100,
  }
}

async function issueCertificate(userId: string, courseId: string) {
  try {
    // Check if certificate already exists
    const existing = await prisma.courseCertificate.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    })

    if (existing) {
      return existing
    }

    // Get certificate definition
    const definition = await prisma.courseCertificateDefinition.findUnique({
      where: { courseId },
    })

    if (!definition) {
      console.log('No certificate definition for course:', courseId)
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
        }),
      },
    })

    return certificate

  } catch (error) {
    console.error('Error issuing certificate:', error)
    return null
  }
}
