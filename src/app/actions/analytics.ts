'use server'

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"

export async function getStudentAnalytics() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const [enrollments, submissions, certificates, watchHistory] = await Promise.all([
    prisma.enrollment.count({ where: { userId: session.user.id } }),
    prisma.studentSubmission.findMany({
      where: { userId: session.user.id },
      include: { quiz: { select: { title: true } } }
    }),
    prisma.certificate.count({ where: { userId: session.user.id } }),
    prisma.watchHistory.findMany({
      where: { userId: session.user.id },
      include: { lesson: { include: { course: { select: { title: true } } } } }
    })
  ])

  const totalWatchTime = watchHistory.reduce((sum, w) => sum + w.watchTime, 0)
  const avgQuizScore = submissions.length > 0 
    ? submissions.reduce((sum, s) => sum + (s.score || 0), 0) / submissions.length 
    : 0

  const courseProgress = watchHistory.reduce((acc, w) => {
    const courseTitle = w.lesson.course.title
    if (!acc[courseTitle]) acc[courseTitle] = { completed: 0, total: 0, watchTime: 0 }
    acc[courseTitle].total++
    acc[courseTitle].watchTime += w.watchTime
    if (w.completed) acc[courseTitle].completed++
    return acc
  }, {} as Record<string, { completed: number, total: number, watchTime: number }>)

  return {
    totalCourses: enrollments,
    totalCertificates: certificates,
    totalWatchTime: Math.round(totalWatchTime),
    averageQuizScore: Math.round(avgQuizScore * 10) / 10,
    recentQuizzes: submissions.slice(-5).reverse().map(s => ({
      quiz: s.quiz,
      score: s.score || 0,
      passed: s.passed
    })),
    courseProgress: Object.entries(courseProgress).map(([title, data]) => ({
      title,
      progress: Math.round((data.completed / data.total) * 100),
      watchTime: Math.round(data.watchTime)
    }))
  }
}

export async function getAdminAnalytics() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") redirect("/login")

  const [users, courses, enrollments, submissions, certificates] = await Promise.all([
    prisma.user.count(),
    prisma.course.count({ where: { published: true } }),
    prisma.enrollment.findMany({
      include: { 
        course: { select: { title: true } },
        user: { select: { name: true, email: true } }
      }
    }),
    prisma.studentSubmission.findMany({
      include: { 
        quiz: { select: { title: true } },
        user: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    }),
    prisma.certificate.count()
  ])

  const popularCourses = enrollments.reduce((acc, e) => {
    const title = e.course.title
    acc[title] = (acc[title] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const monthlyEnrollments = enrollments.reduce((acc, e) => {
    const month = e.createdAt.toISOString().slice(0, 7)
    acc[month] = (acc[month] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const quizPerformance = submissions.reduce((acc, s) => {
    const quizTitle = s.quiz.title
    if (!acc[quizTitle]) acc[quizTitle] = { total: 0, passed: 0, avgScore: 0 }
    acc[quizTitle].total++
    if (s.passed) acc[quizTitle].passed++
    acc[quizTitle].avgScore += s.score || 0
    return acc
  }, {} as Record<string, { total: number, passed: number, avgScore: number }>)

  Object.keys(quizPerformance).forEach(quiz => {
    quizPerformance[quiz].avgScore = Math.round((quizPerformance[quiz].avgScore / quizPerformance[quiz].total) * 10) / 10
  })

  return {
    totalUsers: users,
    totalCourses: courses,
    totalEnrollments: enrollments.length,
    totalCertificates: certificates,
    popularCourses: Object.entries(popularCourses)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([title, count]) => ({ title, enrollments: count })),
    monthlyEnrollments: Object.entries(monthlyEnrollments)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({ month, count })),
    quizPerformance: Object.entries(quizPerformance)
      .map(([title, data]) => ({
        title,
        passRate: Math.round((data.passed / data.total) * 100),
        avgScore: data.avgScore,
        attempts: data.total
      })),
    recentSubmissions: submissions.slice(0, 10)
  }
}