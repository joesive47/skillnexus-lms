'use server'

import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { attemptFinalCertification } from './lesson'

export async function adminTestE2E(courseId: string) {
  try {
    const session = await auth()
    
    // Verify admin access
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized: Admin access required' }
    }

    const userId = session.user.id

    // Get course with all lessons and quizzes
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: {
            lessons: {
              orderBy: { order: 'asc' },
              include: {
                quiz: true
              }
            }
          },
          orderBy: { order: 'asc' }
        },
        quizzes: true
      }
    })

    if (!course) {
      return { success: false, error: 'Course not found' }
    }

    // Get all lessons from all modules
    const allLessons = course.modules.flatMap(m => m.lessons)

    if (allLessons.length === 0) {
      return { success: false, error: 'No lessons found in course' }
    }

    // Mark all lessons as completed
    const watchHistoryPromises = allLessons.map(lesson => 
      prisma.watchHistory.upsert({
        where: {
          userId_lessonId: { userId, lessonId: lesson.id }
        },
        update: {
          completed: true,
          watchTime: lesson.lessonType === 'VIDEO' ? (lesson.duration || 100) : 100
        },
        create: {
          userId,
          lessonId: lesson.id,
          completed: true,
          watchTime: lesson.lessonType === 'VIDEO' ? (lesson.duration || 100) : 100
        }
      })
    )

    await Promise.all(watchHistoryPromises)

    // Submit passing attempts for all quizzes
    const quizSubmissionPromises = allLessons
      .filter(lesson => lesson.quiz)
      .map(async lesson => {
        // Delete existing submissions first
        await prisma.studentSubmission.deleteMany({
          where: {
            userId,
            quizId: lesson.quiz!.id
          }
        })
        
        // Create new submission
        return prisma.studentSubmission.create({
          data: {
            userId,
            quizId: lesson.quiz!.id,
            score: 100, // Perfect score for testing
            passed: true,
            answers: JSON.stringify({}) // Empty answers for testing
          }
        })
      })

    await Promise.all(quizSubmissionPromises)

    // Also handle standalone course quizzes
    const courseQuizPromises = course.quizzes.map(async quiz => {
      // Delete existing submissions first
      await prisma.studentSubmission.deleteMany({
        where: {
          userId,
          quizId: quiz.id
        }
      })
      
      // Create new submission
      return prisma.studentSubmission.create({
        data: {
          userId,
          quizId: quiz.id,
          score: 100,
          passed: true,
          answers: JSON.stringify({})
        }
      })
    })

    await Promise.all(courseQuizPromises)

    // Find the final exam lesson
    const finalExamLesson = allLessons.find(lesson => lesson.isFinalExam)

    // Attempt final certification
    let certificate = null
    if (finalExamLesson) {
      certificate = await attemptFinalCertification(userId, courseId)
    } else {
      // If no final exam, still try to generate certificate
      certificate = await attemptFinalCertification(userId, courseId)
    }

    // Ensure enrollment exists
    await prisma.enrollment.upsert({
      where: {
        userId_courseId: { userId, courseId }
      },
      update: {},
      create: {
        userId,
        courseId
      }
    })

    revalidatePath('/dashboard')
    revalidatePath(`/courses/${courseId}`)

    return {
      success: true,
      message: `Successfully completed E2E test for course: ${course.title}`,
      completedLessons: allLessons.length,
      certificate: certificate ? {
        id: certificate.id,
        uniqueId: certificate.uniqueId,
        courseTitle: certificate.courseTitle,
        issuedAt: certificate.issuedAt
      } : null
    }

  } catch (error) {
    console.error('Error in admin E2E test:', error)
    return { 
      success: false, 
      error: 'Failed to complete E2E test: ' + (error instanceof Error ? error.message : 'Unknown error')
    }
  }
}

export async function resetCourseProgress(courseId: string, userId?: string) {
  try {
    const session = await auth()
    
    // Verify admin access
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized: Admin access required' }
    }

    const targetUserId = userId || session.user.id

    // Get course lessons
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: {
            lessons: true
          }
        },
        quizzes: true
      }
    })

    if (!course) {
      return { success: false, error: 'Course not found' }
    }

    const allLessons = course.modules.flatMap(m => m.lessons)

    // Delete watch history
    await prisma.watchHistory.deleteMany({
      where: {
        userId: targetUserId,
        lessonId: { in: allLessons.map(l => l.id) }
      }
    })

    // Delete quiz submissions
    const allQuizIds = [
      ...allLessons.filter(l => l.quizId).map(l => l.quizId!),
      ...course.quizzes.map(q => q.id)
    ]

    if (allQuizIds.length > 0) {
      await prisma.studentSubmission.deleteMany({
        where: {
          userId: targetUserId,
          quizId: { in: allQuizIds }
        }
      })
    }

    // Delete certificate
    await prisma.certificate.deleteMany({
      where: {
        userId: targetUserId,
        courseId
      }
    })

    revalidatePath('/dashboard')
    revalidatePath(`/courses/${courseId}`)

    return {
      success: true,
      message: `Successfully reset progress for course: ${course.title}`
    }

  } catch (error) {
    console.error('Error resetting course progress:', error)
    return { 
      success: false, 
      error: 'Failed to reset progress: ' + (error instanceof Error ? error.message : 'Unknown error')
    }
  }
}