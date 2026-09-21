import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { adminAccessDenied } from '@/lib/access-control'
import {
  buildDailyTrend,
  parseAnalyticsRange,
  percentage,
  type LearningAnalyticsPayload,
} from '@/lib/admin-learning-analytics'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const denied = await adminAccessDenied()
  if (denied) return denied

  try {
    const rangeDays = parseAnalyticsRange(request.nextUrl.searchParams.get('days'))
    const now = new Date()
    const since = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
    since.setUTCDate(since.getUTCDate() - rangeDays + 1)
    const inactiveSince = new Date(now)
    inactiveSince.setDate(inactiveSince.getDate() - 7)

    const [
      totalLearners,
      publishedCourses,
      enrollments,
      completions,
      activities,
      courseCertificates,
      verifiedCertificates,
      atRiskLearners,
      courses,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.course.count({ where: { published: true } }),
      prisma.enrollment.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
      prisma.courseProgressSummary.findMany({ where: { completedAt: { gte: since } }, select: { completedAt: true } }),
      prisma.courseTrackingEvent.findMany({ where: { occurredAt: { gte: since } }, select: { occurredAt: true, userId: true } }),
      prisma.courseCertificate.findMany({
        where: { issueDate: { gte: since }, status: 'ACTIVE' },
        select: { userId: true, courseId: true },
      }),
      prisma.certificate.findMany({
        where: { issuedAt: { gte: since }, status: 'ACTIVE' },
        select: { userId: true, courseId: true },
      }),
      prisma.courseProgressSummary.count({
        where: {
          completedAt: null,
          progressPercent: { gt: 0 },
          lastActivity: { lt: inactiveSince },
        },
      }),
      prisma.course.findMany({
        where: { published: true },
        select: {
          id: true,
          title: true,
          category: { select: { name: true, parent: { select: { name: true } } } },
          enrollments: { where: { createdAt: { gte: since } }, select: { id: true } },
          progressSummaries: {
            where: { lastActivity: { gte: since } },
            select: { progressPercent: true, completedAt: true },
          },
        },
      }),
    ])

    const certificatesIssued = new Set([
      ...courseCertificates.map((certificate) => `${certificate.userId}:${certificate.courseId}`),
      ...verifiedCertificates.map((certificate) => `${certificate.userId}:${certificate.courseId}`),
    ]).size
    const trend = buildDailyTrend(rangeDays, now, {
      enrollments: enrollments.map((item) => item.createdAt),
      completions: completions.flatMap((item) => item.completedAt ? [item.completedAt] : []),
      activities: activities.map((item) => item.occurredAt),
    })
    const activeLearners = new Set(activities.flatMap((item) => item.userId ? [item.userId] : [])).size
    const categoryMap = new Map<string, { enrollments: number; completions: number; progressTotal: number; progressCount: number }>()
    const courseFocus = courses.map((course) => {
      const categoryName = course.category?.parent?.name || course.category?.name || 'ยังไม่จัดหมวดหมู่'
      const completionsForCourse = course.progressSummaries.filter((item) => item.completedAt).length
      const averageProgress = course.progressSummaries.length
        ? Math.round(course.progressSummaries.reduce((sum, item) => sum + item.progressPercent, 0) / course.progressSummaries.length)
        : 0
      const category = categoryMap.get(categoryName) || { enrollments: 0, completions: 0, progressTotal: 0, progressCount: 0 }
      category.enrollments += course.enrollments.length
      category.completions += completionsForCourse
      category.progressTotal += course.progressSummaries.reduce((sum, item) => sum + item.progressPercent, 0)
      category.progressCount += course.progressSummaries.length
      categoryMap.set(categoryName, category)

      return {
        id: course.id,
        title: course.title,
        enrollments: course.enrollments.length,
        completions: completionsForCourse,
        averageProgress,
      }
    })
      .filter((course) => course.enrollments > 0 || course.averageProgress > 0)
      .sort((a, b) => a.averageProgress - b.averageProgress || b.enrollments - a.enrollments)
      .slice(0, 5)

    const categoryPerformance = [...categoryMap.entries()]
      .map(([name, category]) => ({
        name,
        enrollments: category.enrollments,
        completions: category.completions,
        averageProgress: category.progressCount ? Math.round(category.progressTotal / category.progressCount) : 0,
      }))
      .sort((a, b) => b.enrollments - a.enrollments || b.averageProgress - a.averageProgress)

    const peakDay = trend.reduce<(typeof trend)[number] | null>(
      (current, item) => !current || item.activities > current.activities ? item : current,
      null
    )
    const payload: LearningAnalyticsPayload = {
      rangeDays,
      lastUpdated: now.toISOString(),
      metrics: {
        totalLearners,
        activeLearners,
        publishedCourses,
        enrollments: enrollments.length,
        completionRate: percentage(completions.length, enrollments.length),
        certificatesIssued,
        atRiskLearners,
      },
      trend,
      categoryPerformance,
      courseFocus,
      insights: {
        peakDay: peakDay?.activities ? peakDay.label : null,
        topCategory: categoryPerformance[0]?.name || null,
      },
    }

    return NextResponse.json(payload, {
      headers: { 'Cache-Control': 'private, no-store, max-age=0' },
    })
  } catch (error) {
    console.error('[ADMIN_ANALYTICS]', error)
    return NextResponse.json({ error: 'Unable to load learning analytics' }, { status: 500 })
  }
}
