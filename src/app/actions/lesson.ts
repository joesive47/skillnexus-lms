'use server'

import { requireSelf, requireAdmin, requireEnrollment, requireLessonAccess, publicError } from '@/lib/access-control'
import { recordVideoProgress, lessonCompleted } from '@/lib/learning-evidence'
import { issueVerifiedCertificate } from '@/lib/issue-certificate'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { isValidYouTubeID } from '@/lib/video'

export async function updateLessonProgress(userId: string, lessonId: string, watchTime: number) {
  try { return { success: true, ...await recordVideoProgress(userId, lessonId, watchTime) } }
  catch (error) { return { success: false, error: publicError(error) } }
}

export async function checkAndUnlockNextLesson(userId: string, currentLessonId: string) {
  try {
    await requireLessonAccess(userId, currentLessonId)
    if (!await lessonCompleted(userId, currentLessonId)) return { nextLessonUnlocked: false, certificate: null }
    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      throw new Error('User not found')
    }

    const currentLesson = await prisma.lesson.findUnique({
      where: { id: currentLessonId },
      include: {
        module: {
          include: {
            course: true
          }
        }
      }
    })

    if (!currentLesson) throw new Error('Current lesson not found')

    let nextLessonUnlocked = false
    let certificate = null

    // If current lesson has a defined next lesson, unlock it
    if (currentLesson.nextLessonId) {
      // Verify next lesson exists
      const nextLesson = await prisma.lesson.findUnique({
        where: { id: currentLesson.nextLessonId }
      })
      
      if (nextLesson && nextLesson.courseId === currentLesson.courseId) {
        // Create watch history entry for next lesson to "unlock" it
        await prisma.watchHistory.upsert({
          where: {
            userId_lessonId: { userId, lessonId: currentLesson.nextLessonId }
          },
          update: {},
          create: {
            userId,
            lessonId: currentLesson.nextLessonId,
            watchTime: 0,
            completed: false
          }
        })
        nextLessonUnlocked = true
      }
    }

    // Check if this is a final exam
    if (currentLesson.isFinalExam && currentLesson.module?.course?.id) {
      certificate = await attemptFinalCertification(userId, currentLesson.module.course.id)
    }

    return { nextLessonUnlocked, certificate }
  } catch (error) {
    console.error('Error checking next lesson:', error)
    return { nextLessonUnlocked: false, certificate: null }
  }
}

export async function attemptFinalCertification(userId: string, courseId: string) {
  try {
    const cert = await issueVerifiedCertificate(userId, courseId)
    return { id: cert.id, uniqueId: cert.verificationToken, certificateNumber: cert.certificateNumber, courseTitle: cert.course.title, issuedAt: cert.issuedAt }
  } catch { return null }
}

export async function getLessonWithProgress(lessonId: string, userId: string) {
  try {
    await requireLessonAccess(userId, lessonId)
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        course: {
          include: {
            lessons: {
              orderBy: { order: 'asc' }
            }
          }
        },
        module: {
          include: {
            course: true,
            lessons: {
              orderBy: { order: 'asc' }
            }
          }
        },
        watchHistory: {
          where: { userId }
        }
      }
    })

    return { success: true, lesson }
  } catch (error) {
    console.error('Error fetching lesson:', error)
    return { success: false, error: 'Failed to fetch lesson' }
  }
}

export async function createLesson(courseId: string, lessonData: any) {
  try {
    await requireAdmin()
    let youtubeUrl = lessonData.youtubeUrl
    
    // Validate YouTube Video ID if it's a video lesson
    if (lessonData.type === 'VIDEO' && youtubeUrl) {
      if (!isValidYouTubeID(youtubeUrl)) {
        return { success: false, error: 'Invalid YouTube Video ID format. Must be exactly 11 characters.' }
      }
    }

    // Clear youtubeUrl for non-video lessons
    if (lessonData.type !== 'VIDEO') {
      youtubeUrl = null
    }

    const lesson = await prisma.lesson.create({
      data: {
        courseId,
        type: lessonData.type,
        lessonType: lessonData.type,
        order: lessonData.order,
        title: lessonData.title,
        youtubeUrl,
        launchUrl: lessonData.launchUrl || null,
        content: lessonData.content || null,
        requiredCompletionPercentage: lessonData.requiredPct || 80,
        duration: lessonData.durationMin || lessonData.duration || null,
        durationMin: lessonData.durationMin || lessonData.duration || null,
        quizId: lessonData.quizId || null,
      }
    })

    return { success: true, lesson }
  } catch (error) {
    console.error('Error creating lesson:', error)
    return { success: false, error: 'Failed to create lesson' }
  }
}

export async function updateLesson(lessonId: string, lessonData: any) {
  try {
    await requireAdmin()
    let youtubeUrl = lessonData.youtubeUrl
    
    // Validate YouTube Video ID if it's a video lesson
    if (lessonData.type === 'VIDEO' && youtubeUrl) {
      if (!isValidYouTubeID(youtubeUrl)) {
        return { success: false, error: 'Invalid YouTube Video ID format. Must be exactly 11 characters.' }
      }
    }

    // Clear youtubeUrl for non-video lessons
    if (lessonData.type !== 'VIDEO') {
      youtubeUrl = null
    }

    const lesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        type: lessonData.type,
        lessonType: lessonData.type,
        order: lessonData.order,
        title: lessonData.title,
        youtubeUrl,
        requiredCompletionPercentage: lessonData.requiredPct || 80,
        duration: lessonData.durationMin ? lessonData.durationMin * 60 : null,
        quizId: lessonData.quizId || null,
      }
    })

    return { success: true, lesson }
  } catch (error) {
    console.error('Error updating lesson:', error)
    return { success: false, error: 'Failed to update lesson' }
  }
}

export async function deleteLesson(lessonId: string) {
  try {
    await requireAdmin()
    // Get the lesson first to find the courseId
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { courseId: true }
    })

    if (!lesson) {
      return { success: false, error: 'Lesson not found' }
    }

    // Delete the lesson
    await prisma.lesson.delete({
      where: { id: lessonId }
    })

    // Revalidate the course edit page
    revalidatePath(`/dashboard/admin/courses/${lesson.courseId}/edit`)
    revalidatePath(`/dashboard/admin/courses/${lesson.courseId}`)

    return { success: true }
  } catch (error) {
    console.error('Error deleting lesson:', error)
    return { success: false, error: 'Failed to delete lesson' }
  }
}

export async function reorderLessons(courseId: string, lessonOrders: { id: string, order: number }[]) {
  try {
    await requireAdmin()
    await prisma.$transaction(
      lessonOrders.map(({ id, order }) =>
        prisma.lesson.update({
          where: { id },
          data: { order }
        })
      )
    )

    return { success: true }
  } catch (error) {
    console.error('Error reordering lessons:', error)
    return { success: false, error: 'Failed to reorder lessons' }
  }
}
