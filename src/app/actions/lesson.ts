'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { isValidYouTubeID } from '@/lib/video'

export async function updateLessonProgress(
  userId: string,
  lessonId: string,
  watchTime: number
) {
  try {
    // Validate inputs
    if (!userId || !lessonId) {
      throw new Error('Missing required parameters')
    }

    // Handle invalid watchTime values
    if (!isFinite(watchTime) || watchTime < 0) {
      watchTime = 0
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      throw new Error('User not found')
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: true
          }
        }
      }
    })

    if (!lesson) throw new Error('Lesson not found')

    // Calculate completion (assume 80% for video completion)
    const isCompleted = lesson.type === 'VIDEO' ? watchTime >= 30 : watchTime > 0

    // Update progress
    const progress = await prisma.watchHistory.upsert({
      where: {
        userId_lessonId: { userId, lessonId }
      },
      update: {
        watchTime,
        completed: isCompleted
      },
      create: {
        userId,
        lessonId,
        watchTime,
        completed: isCompleted
      }
    })

    const courseId = lesson.module?.course?.id
    if (courseId) {
      // Revalidate paths to update UI
      revalidatePath(`/courses/${courseId}`)
      revalidatePath(`/courses/${courseId}/lessons/${lessonId}`)
      revalidatePath('/dashboard')
    }

    return { success: true, progress, completed: isCompleted }

  } catch (error) {
    console.error('Error updating lesson progress:', error)
    return { success: false, error: 'Failed to update progress' }
  }
}

export async function checkAndUnlockNextLesson(userId: string, currentLessonId: string) {
  try {
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
      
      if (nextLesson) {
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
    // Check if user has completed all required lessons and quizzes
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: {
            lessons: {
              include: {
                watchHistory: {
                  where: { userId }
                }
              }
            }
          }
        },
        quizzes: {
          include: {
            submissions: {
              where: { userId, passed: true }
            }
          }
        }
      }
    })

    if (!course) throw new Error('Course not found')

    // Check all lessons completed
    const allLessons = course.modules.flatMap(m => m.lessons)
    const completedLessons = allLessons.filter(l => 
      l.watchHistory.some(wh => wh.completed)
    )

    // Check all quizzes passed
    const allQuizzesPassed = course.quizzes.every(quiz => 
      quiz.submissions.length > 0
    )

    if (completedLessons.length === allLessons.length && allQuizzesPassed) {
      // Check if certificate already exists
      const existingCertificate = await prisma.certificate.findUnique({
        where: {
          userId_courseId: { userId, courseId }
        }
      })

      if (!existingCertificate) {
        const certificate = await prisma.certificate.create({
          data: {
            certificateNumber: `CERT-${Date.now()}`,
            userId,
            courseId,
            verificationToken: require('crypto').randomBytes(16).toString('hex'),
            digitalSignature: 'legacy-cert',
            bardData: '{}'
          }
        })

        return {
          id: certificate.id,
          uniqueId: certificate.verificationToken,
          courseTitle: course.title,
          issuedAt: certificate.issuedAt
        }
      }
    }

    return null
  } catch (error) {
    console.error('Error generating certificate:', error)
    return null
  }
}

export async function getLessonWithProgress(lessonId: string, userId: string) {
  try {
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
    await prisma.lesson.delete({
      where: { id: lessonId }
    })

    return { success: true }
  } catch (error) {
    console.error('Error deleting lesson:', error)
    return { success: false, error: 'Failed to delete lesson' }
  }
}

export async function reorderLessons(courseId: string, lessonOrders: { id: string, order: number }[]) {
  try {
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