import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

/**
 * API Route: Check if SCORM content is unlocked for a lesson
 * 
 * Requirements:
 * - User must watch the video lesson to 80% or more
 * - Uses WatchHistory model to track video progress
 * 
 * Returns:
 * - canAccess: boolean - whether user can access SCORM content
 * - videoProgress: number - percentage of video watched (0-100)
 * - requiredProgress: number - required percentage (80)
 * - watchHistory: object - current watch history data
 * - message: string - user-friendly message
 */

const REQUIRED_VIDEO_PROGRESS = 80 // 80% video completion required

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    // 1. Authenticate user
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login' },
        { status: 401 }
      )
    }

    const { lessonId } = await params
    const userId = session.user.id

    // 2. Get lesson with SCORM package
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        scormPackage: true,
        course: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      )
    }

    // 3. Check if lesson has SCORM content
    if (!lesson.scormPackage) {
      return NextResponse.json({
        canAccess: false,
        reason: 'NO_SCORM',
        message: 'This lesson does not have SCORM content',
        videoProgress: 0,
        requiredProgress: REQUIRED_VIDEO_PROGRESS
      })
    }

    // 4. Check enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: lesson.courseId
        }
      }
    })

    if (!enrollment && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Not enrolled in this course' },
        { status: 403 }
      )
    }

    // 5. Get video watch history
    const watchHistory = await prisma.watchHistory.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId
        }
      }
    })

    // 6. Calculate video progress percentage
    let videoProgress = 0
    if (watchHistory && watchHistory.totalTime > 0) {
      videoProgress = Math.round((watchHistory.watchTime / watchHistory.totalTime) * 100)
      // Cap at 100%
      videoProgress = Math.min(videoProgress, 100)
    }

    // 7. Check if video progress meets requirement
    const canAccess = videoProgress >= REQUIRED_VIDEO_PROGRESS

    // 8. Prepare response
    if (canAccess) {
      return NextResponse.json({
        canAccess: true,
        videoProgress,
        requiredProgress: REQUIRED_VIDEO_PROGRESS,
        watchHistory: {
          watchTime: watchHistory?.watchTime || 0,
          totalTime: watchHistory?.totalTime || 0,
          completed: watchHistory?.completed || false
        },
        message: 'SCORM content unlocked! You can now access the interactive content.',
        lesson: {
          id: lesson.id,
          title: lesson.title,
          courseId: lesson.courseId,
          courseTitle: lesson.course.title
        }
      })
    } else {
      return NextResponse.json({
        canAccess: false,
        reason: 'VIDEO_NOT_COMPLETE',
        videoProgress,
        requiredProgress: REQUIRED_VIDEO_PROGRESS,
        watchHistory: {
          watchTime: watchHistory?.watchTime || 0,
          totalTime: watchHistory?.totalTime || 0,
          completed: watchHistory?.completed || false
        },
        message: `กรุณาดูวิดีโอให้ครบ ${REQUIRED_VIDEO_PROGRESS}% ก่อนเข้าถึงเนื้อหา SCORM (ดูแล้ว ${videoProgress}%)`,
        lesson: {
          id: lesson.id,
          title: lesson.title,
          courseId: lesson.courseId,
          courseTitle: lesson.course.title
        }
      })
    }

  } catch (error) {
    console.error('Error checking SCORM unlock status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
