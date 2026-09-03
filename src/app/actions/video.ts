'use server'

import { requireSelf, requireEnrollment, requireLessonAccess, publicError } from '@/lib/access-control'
import { recordVideoProgress, lessonCompleted } from '@/lib/learning-evidence'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function updateVideoProgress(userId: string, lessonId: string, watchedTime: number, _totalTime: number) {
  try { const result = await recordVideoProgress(userId, lessonId, watchedTime); return { success: true, ...result, isCompleted: result.completed } }
  catch (error) { return { success: false, error: publicError(error) } }
}

export async function updateLessonCompletionStatus(userId: string, lessonId: string, courseId: string) {
  try {
    await requireLessonAccess(userId, lessonId, courseId)
    if (!await lessonCompleted(userId, lessonId)) return { success: false, error: 'Learning requirements have not been met' }
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) { return { success: false, error: publicError(error) } }
}

export async function getCourseProgress(userId: string, courseId: string) {
  try {
    await requireSelf(userId)
    await requireEnrollment(userId, courseId)
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        lessons: {
          include: {
            watchHistory: {
              where: { userId }
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!course) return null

    const totalLessons = course.lessons.length
    const completedLessons = course.lessons.filter(
      lesson => lesson.watchHistory[0]?.completed
    ).length

    // Calculate total video duration from watch history (more accurate)
    const totalVideoDuration = course.lessons
      .filter(lesson => lesson.lessonType === 'VIDEO')
      .reduce((sum, lesson) => {
        const watchHistory = lesson.watchHistory[0]
        return sum + (watchHistory?.totalTime || lesson.duration || 0)
      }, 0)

    // Calculate actual watched duration
    const watchedDuration = course.lessons
      .filter(lesson => lesson.lessonType === 'VIDEO')
      .reduce((sum, lesson) => {
        const watchHistory = lesson.watchHistory[0]
        return sum + (watchHistory?.watchTime || 0)
      }, 0)

    // Calculate time-based progress percentage
    const timeProgressPercentage = totalVideoDuration > 0 
      ? (watchedDuration / totalVideoDuration) * 100 
      : 0

    return {
      courseName: course.title,
      totalLessons,
      completedLessons,
      totalVideoDuration,
      watchedDuration,
      completionPercentage: totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0,
      timeProgressPercentage
    }
  } catch (error) {
    console.error('Error getting course progress:', error)
    return null
  }
}