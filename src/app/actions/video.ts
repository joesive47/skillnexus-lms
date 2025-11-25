'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function updateVideoProgress(
  userId: string,
  lessonId: string,
  watchedTime: number,
  totalTime: number
) {
  try {
    // Validate inputs
    if (!userId || !lessonId) {
      console.error('Missing required parameters:', { userId, lessonId })
      return { success: false, error: 'Missing required parameters' }
    }
    
    if (!isFinite(watchedTime) || watchedTime < 0) watchedTime = 0
    if (!isFinite(totalTime) || totalTime <= 0) totalTime = 1
    
    // Verify user and lesson exist before creating watch history
    const [user, lesson] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.lesson.findUnique({ where: { id: lessonId } })
    ])
    
    if (!user) {
      console.error('User not found:', userId)
      return { success: false, error: 'User not found' }
    }
    
    if (!lesson) {
      console.error('Lesson not found:', lessonId)
      return { success: false, error: 'Lesson not found' }
    }
    
    // Calculate progress percentage
    const progressPercentage = (watchedTime / totalTime) * 100
    const isCompleted = progressPercentage >= 80 // 80% completion threshold

    await prisma.watchHistory.upsert({
      where: {
        userId_lessonId: { userId, lessonId }
      },
      update: {
        watchTime: watchedTime,
        totalTime: totalTime,
        completed: isCompleted
      },
      create: {
        userId,
        lessonId,
        watchTime: watchedTime,
        totalTime: totalTime,
        completed: isCompleted
      }
    })

    return { success: true, progressPercentage, isCompleted }
  } catch (error) {
    console.error('Error updating video progress:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function updateLessonCompletionStatus(
  userId: string,
  lessonId: string,
  courseId: string
) {
  try {
    // Validate inputs
    if (!userId || !lessonId || !courseId) {
      console.error('Missing required parameters:', { userId, lessonId, courseId })
      return { success: false, error: 'Missing required parameters' }
    }

    // Verify user and lesson exist
    const [user, lesson] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.lesson.findUnique({ where: { id: lessonId } })
    ])
    
    if (!user) {
      console.error('User not found:', userId)
      return { success: false, error: 'User not found' }
    }
    
    if (!lesson) {
      console.error('Lesson not found:', lessonId)
      return { success: false, error: 'Lesson not found' }
    }

    await prisma.watchHistory.upsert({
      where: {
        userId_lessonId: { userId, lessonId }
      },
      update: {
        completed: true
      },
      create: {
        userId,
        lessonId,
        watchTime: 100,
        completed: true
      }
    })

    revalidatePath(`/courses/${courseId}`)
    revalidatePath(`/courses/${courseId}/lessons/${lessonId}`)
    revalidatePath('/dashboard')

    return { success: true }
  } catch (error) {
    console.error('Error updating lesson completion:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function getCourseProgress(userId: string, courseId: string) {
  try {
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