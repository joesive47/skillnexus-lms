/**
 * Analytics API - User-specific analytics
 * For student dashboard - their personal learning stats
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Get user stats
    const [
      enrollments,
      completedLessons,
      quizAttempts,
      passedQuizzes,
      certificates,
      totalXP,
      achievements,
      currentStreak
    ] = await Promise.all([
      // Enrollments
      prisma.enrollment.findMany({
        where: { userId },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              imageUrl: true
            }
          }
        }
      }),

      // Completed lessons
      prisma.watchHistory.count({
        where: {
          userId,
          completed: true
        }
      }),

      // Quiz attempts
      prisma.quizAttemptRecord.count({
        where: { userId }
      }),

      // Passed quizzes
      prisma.quizAttemptRecord.count({
        where: {
          userId,
          passed: true
        }
      }),

      // Certificates
      prisma.courseCertificate.count({
        where: {
          userId,
          status: 'ACTIVE'
        }
      }),

      // User XP
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          totalXP: true,
          level: true,
          currentStreak: true,
          maxStreak: true
        }
      }),

      // Achievements
      prisma.userAchievementNew.count({
        where: { userId }
      }),

      // Learning streak
      prisma.learningStreak.findUnique({
        where: { userId }
      })
    ])

    // Calculate course progress for each enrollment
    const coursesProgress = await Promise.all(
      enrollments.map(async (enrollment) => {
        const lessons = await prisma.lesson.findMany({
          where: { courseId: enrollment.courseId }
        })

        const completed = await prisma.watchHistory.count({
          where: {
            userId,
            lessonId: { in: lessons.map(l => l.id) },
            completed: true
          }
        })

        const percentage = lessons.length > 0
          ? Math.round((completed / lessons.length) * 100)
          : 0

        return {
          courseId: enrollment.course.id,
          courseName: enrollment.course.title,
          courseImage: enrollment.course.imageUrl,
          totalLessons: lessons.length,
          completedLessons: completed,
          progress: percentage,
          enrolledAt: enrollment.createdAt
        }
      })
    )

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const recentActivity = await prisma.watchHistory.findMany({
      where: {
        userId,
        updatedAt: {
          gte: sevenDaysAgo
        }
      },
      include: {
        lesson: {
          select: {
            title: true,
            course: {
              select: {
                title: true
              }
            }
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: 10
    })

    // Learning time (daily breakdown for last 7 days)
    const learningTimeStats = await prisma.$queryRaw<Array<{ date: string; minutes: number }>>`
      SELECT 
        DATE(updated_at) as date,
        SUM(watch_time) / 60 as minutes
      FROM watch_history
      WHERE user_id = ${userId}
        AND updated_at >= ${sevenDaysAgo}
      GROUP BY DATE(updated_at)
      ORDER BY date ASC
    `

    // Quiz performance breakdown
    const quizPerformance = await prisma.quizAttemptRecord.findMany({
      where: { userId },
      select: {
        score: true,
        passed: true,
        submittedAt: true,
        quiz: {
          select: {
            title: true
          }
        }
      },
      orderBy: {
        submittedAt: 'desc'
      },
      take: 10
    })

    return NextResponse.json({
      success: true,
      stats: {
        enrollments: enrollments.length,
        completedLessons,
        coursesInProgress: coursesProgress.filter(c => c.progress > 0 && c.progress < 100).length,
        coursesCompleted: coursesProgress.filter(c => c.progress === 100).length,
        quizAttempts,
        quizPassRate: quizAttempts > 0 
          ? ((passedQuizzes / quizAttempts) * 100).toFixed(1)
          : 0,
        certificates,
        totalXP: totalXP?.totalXP || 0,
        level: totalXP?.level || 1,
        currentStreak: currentStreak?.currentStreak || 0,
        longestStreak: currentStreak?.longestStreak || 0,
        achievements
      },
      coursesProgress,
      recentActivity: recentActivity.map(a => ({
        lessonTitle: a.lesson.title,
        courseName: a.lesson.course.title,
        completed: a.completed,
        progress: a.totalTime > 0 
          ? Math.round((a.watchTime / a.totalTime) * 100)
          : 0,
        timestamp: a.updatedAt
      })),
      learningTime: {
        daily: learningTimeStats,
        totalMinutes: learningTimeStats.reduce((sum, day) => sum + Number(day.minutes), 0)
      },
      quizPerformance: quizPerformance.map(q => ({
        quizTitle: q.quiz.title,
        score: q.score,
        passed: q.passed,
        date: q.submittedAt
      }))
    })

  } catch (error) {
    console.error('User analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user analytics' },
      { status: 500 }
    )
  }
}
