/**
 * Analytics API - Overview Dashboard
 * Provides aggregate stats for admin/teacher dashboard
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

    // Check if user is admin or teacher
    if (!['ADMIN', 'TEACHER'].includes(session.user.role || '')) {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '7' // days
    const periodDays = parseInt(period)

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - periodDays)

    // Parallel queries for better performance
    const [
      totalUsers,
      activeUsers,
      totalCourses,
      publishedCourses,
      totalEnrollments,
      recentEnrollments,
      completedLessons,
      totalQuizAttempts,
      passedQuizAttempts,
      certificatesIssued,
      recentCertificates,
      avgCourseProgress
    ] = await Promise.all([
      // Total users
      prisma.user.count(),

      // Active users (logged in within period)
      prisma.user.count({
        where: {
          lastLoginDate: {
            gte: startDate
          }
        }
      }),

      // Total courses
      prisma.course.count(),

      // Published courses
      prisma.course.count({
        where: { published: true }
      }),

      // Total enrollments
      prisma.enrollment.count(),

      // Recent enrollments
      prisma.enrollment.count({
        where: {
          createdAt: {
            gte: startDate
          }
        }
      }),

      // Completed lessons
      prisma.watchHistory.count({
        where: { completed: true }
      }),

      // Total quiz attempts
      prisma.quizAttemptRecord.count(),

      // Passed quiz attempts
      prisma.quizAttemptRecord.count({
        where: { passed: true }
      }),

      // Total certificates issued
      prisma.courseCertificate.count({
        where: { status: 'ACTIVE' }
      }),

      // Recent certificates
      prisma.courseCertificate.count({
        where: {
          issueDate: {
            gte: startDate
          },
          status: 'ACTIVE'
        }
      }),

      // Average course progress
      prisma.watchHistory.aggregate({
        _avg: {
          watchTime: true
        }
      })
    ])

    // Get enrollment trend (daily breakdown)
    const enrollmentTrend = await prisma.$queryRaw<Array<{ date: string; count: number }>>`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM enrollments
      WHERE created_at >= ${startDate}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `

    // Get popular courses (most enrollments)
    const popularCourses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        _count: {
          select: {
            enrollments: true
          }
        }
      },
      orderBy: {
        enrollments: {
          _count: 'desc'
        }
      },
      take: 5
    })

    // Recent activity
    const recentActivity = await prisma.watchHistory.findMany({
      where: {
        updatedAt: {
          gte: startDate
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        lesson: {
          select: {
            id: true,
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

    // Quiz performance
    const quizPassRate = totalQuizAttempts > 0
      ? ((passedQuizAttempts / totalQuizAttempts) * 100).toFixed(1)
      : 0

    return NextResponse.json({
      success: true,
      period: `Last ${periodDays} days`,
      overview: {
        users: {
          total: totalUsers,
          active: activeUsers,
          activeRate: totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(1) : 0
        },
        courses: {
          total: totalCourses,
          published: publishedCourses,
          publishRate: totalCourses > 0 ? ((publishedCourses / totalCourses) * 100).toFixed(1) : 0
        },
        enrollments: {
          total: totalEnrollments,
          recent: recentEnrollments,
          trend: enrollmentTrend
        },
        learning: {
          completedLessons,
          avgProgress: avgCourseProgress._avg.watchTime?.toFixed(1) || 0
        },
        quizzes: {
          totalAttempts: totalQuizAttempts,
          passedAttempts: passedQuizAttempts,
          passRate: quizPassRate
        },
        certificates: {
          total: certificatesIssued,
          recent: recentCertificates
        }
      },
      popularCourses: popularCourses.map(c => ({
        id: c.id,
        title: c.title,
        enrollments: c._count.enrollments
      })),
      recentActivity: recentActivity.map(a => ({
        user: a.user.name || a.user.email,
        lesson: a.lesson.title,
        course: a.lesson.course.title,
        completed: a.completed,
        progress: a.totalTime > 0 
          ? Math.round((a.watchTime / a.totalTime) * 100)
          : 0,
        timestamp: a.updatedAt
      }))
    })

  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
