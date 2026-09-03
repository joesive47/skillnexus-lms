import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'

type LearningHistory = Prisma.WatchHistoryGetPayload<{
  include: { lesson: { include: { course: true } } }
}>

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth()
    const { userId } = await params
    if (!session?.user?.id || session.user.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const insights = await generateLearningInsights(userId)
    return NextResponse.json({ insights })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate insights' }, { status: 500 })
  }
}

async function generateLearningInsights(userId: string) {
  // Get user's watch history
  const watchHistory = await prisma.watchHistory.findMany({
    where: { userId },
    include: { lesson: { include: { course: true } } },
    orderBy: { updatedAt: 'desc' },
    take: 100
  })

  // Calculate total study time
  const totalStudyTime = watchHistory.reduce((sum, wh) => sum + (wh.watchTime || 0), 0)
  
  // Calculate average session time
  const sessions = groupBySession(watchHistory)
  const averageSessionTime = sessions.length > 0 
    ? Math.round(sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length / 60)
    : 0

  // Calculate completion rate
  const completedLessons = watchHistory.filter(wh => wh.completed).length
  const completionRate = watchHistory.length > 0 
    ? Math.round((completedLessons / watchHistory.length) * 100)
    : 0

  // Generate weekly progress
  const weeklyProgress = generateWeeklyProgress(watchHistory)
  
  // Analyze skills
  const skillDistribution = analyzeSkillDistribution(watchHistory)
  const strongestSkills = skillDistribution.slice(0, 3).map(s => s.skill)

  // Calculate learning streak (simplified)
  const learningStreak = calculateLearningStreak(watchHistory)

  return {
    totalStudyTime,
    averageSessionTime,
    preferredLearningTime: preferredLearningTime(watchHistory),
    strongestSkills,
    learningStreak,
    completionRate,
    weeklyProgress,
    skillDistribution
  }
}

function groupBySession(watchHistory: LearningHistory[]) {
  // Simple session grouping by date
  const sessions: { [key: string]: { duration: number } } = {}
  
  watchHistory.forEach(wh => {
    const date = wh.updatedAt.toDateString()
    if (!sessions[date]) {
      sessions[date] = { duration: 0 }
    }
    sessions[date].duration += wh.watchTime || 0
  })

  return Object.values(sessions)
}

function generateWeeklyProgress(watchHistory: LearningHistory[]) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (6 - index))
    return { date, key: date.toISOString().slice(0, 10), day: date.toLocaleDateString('en-US', { weekday: 'short' }), minutes: 0 }
  })
  const byDate = new Map(days.map(day => [day.key, day]))
  watchHistory.forEach(item => {
    const day = byDate.get(item.updatedAt.toISOString().slice(0, 10))
    if (day) day.minutes += Math.round((item.watchTime || 0) / 60)
  })
  return days.map(({ day, minutes }) => ({ day, minutes }))
}

function analyzeSkillDistribution(watchHistory: LearningHistory[]) {
  const totals = new Map<string, number>()
  watchHistory.forEach(item => {
    const skill = item.lesson.course.title
    totals.set(skill, (totals.get(skill) || 0) + (item.watchTime || 0))
  })
  const total = Array.from(totals.values()).reduce((sum, value) => sum + value, 0)
  return Array.from(totals.entries())
    .map(([skill, seconds]) => ({ skill, value: total > 0 ? Math.round((seconds / total) * 100) : 0 }))
    .sort((a, b) => b.value - a.value)
}

function calculateLearningStreak(watchHistory: LearningHistory[]) {
  const activeDays = new Set(watchHistory.filter(item => (item.watchTime || 0) > 0).map(item => item.updatedAt.toISOString().slice(0, 10)))
  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)
  if (!activeDays.has(cursor.toISOString().slice(0, 10))) cursor.setDate(cursor.getDate() - 1)
  let streak = 0
  while (activeDays.has(cursor.toISOString().slice(0, 10))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

function preferredLearningTime(watchHistory: LearningHistory[]) {
  if (watchHistory.length === 0) return 'No data'
  const averageHour = watchHistory.reduce((sum, item) => sum + item.updatedAt.getHours(), 0) / watchHistory.length
  if (averageHour < 6) return 'Late night'
  if (averageHour < 12) return 'Morning'
  if (averageHour < 18) return 'Afternoon'
  return 'Evening'
}
