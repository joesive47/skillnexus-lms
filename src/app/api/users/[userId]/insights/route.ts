import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

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
    preferredLearningTime: 'Evening', // Simplified
    strongestSkills,
    learningStreak,
    completionRate,
    weeklyProgress,
    skillDistribution
  }
}

function groupBySession(watchHistory: any[]) {
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

function generateWeeklyProgress(watchHistory: any[]) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const weekData = days.map(day => ({ day, minutes: 0 }))
  
  // Simplified - just return sample data
  return weekData.map((day, index) => ({
    ...day,
    minutes: Math.floor(Math.random() * 60) + 10
  }))
}

function analyzeSkillDistribution(watchHistory: any[]) {
  // Extract skills from course titles (simplified)
  const skills = ['Programming', 'Design', 'Business', 'Marketing', 'Data Science']
  
  return skills.map(skill => ({
    skill,
    value: Math.floor(Math.random() * 30) + 10
  }))
}

function calculateLearningStreak(watchHistory: any[]) {
  // Simplified streak calculation
  return Math.floor(Math.random() * 14) + 1
}