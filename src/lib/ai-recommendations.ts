// AI Recommendation Engine - Simple but effective
import prisma from './prisma'
import { isFeatureEnabled } from './feature-flags'

export async function generateRecommendations(userId: string, limit = 5) {
  if (!(await isFeatureEnabled('ai_recommendations'))) {
    return []
  }

  try {
    // Get user's learning history
    const userHistory = await getUserLearningHistory(userId)
    
    // Generate different types of recommendations
    const [similarCourses, popularCourses, skillBased] = await Promise.all([
      getSimilarCourses(userId, userHistory, 2),
      getPopularCourses(userId, 2),
      getSkillBasedRecommendations(userId, 1)
    ])

    const recommendations = [
      ...similarCourses,
      ...popularCourses, 
      ...skillBased
    ].slice(0, limit)

    // Save recommendations
    await saveRecommendations(userId, recommendations)
    
    return recommendations
  } catch (error) {
    console.error('AI recommendation error:', error)
    return []
  }
}

async function getUserLearningHistory(userId: string) {
  return prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        select: { id: true, title: true, description: true, price: true }
      }
    },
    take: 10
  })
}

async function getSimilarCourses(userId: string, history: any[], limit: number) {
  if (history.length === 0) return []

  // Simple similarity: courses with similar titles/descriptions
  const enrolledCourseIds = history.map(h => h.courseId)
  const keywords = extractKeywords(history.map(h => h.course.title).join(' '))

  const similar = await prisma.course.findMany({
    where: {
      AND: [
        { published: true },
        { id: { notIn: enrolledCourseIds } },
        {
          OR: keywords.map(keyword => ({
            OR: [
              { title: { contains: keyword, mode: 'insensitive' } },
              { description: { contains: keyword, mode: 'insensitive' } }
            ]
          }))
        }
      ]
    },
    take: limit,
    include: { _count: { select: { enrollments: true } } }
  })

  return similar.map(course => ({
    courseId: course.id,
    score: 0.8,
    reason: 'Similar to your completed courses',
    type: 'similar',
    course
  }))
}

async function getPopularCourses(userId: string, limit: number) {
  const enrolledCourses = await prisma.enrollment.findMany({
    where: { userId },
    select: { courseId: true }
  })
  
  const enrolledIds = enrolledCourses.map(e => e.courseId)

  const popular = await prisma.course.findMany({
    where: {
      AND: [
        { published: true },
        { id: { notIn: enrolledIds } }
      ]
    },
    include: { _count: { select: { enrollments: true } } },
    orderBy: { enrollments: { _count: 'desc' } },
    take: limit
  })

  return popular.map(course => ({
    courseId: course.id,
    score: 0.6,
    reason: `Popular with ${course._count.enrollments} students`,
    type: 'popular',
    course
  }))
}

async function getSkillBasedRecommendations(userId: string, limit: number) {
  // Simple skill-based: recommend based on incomplete courses
  const incomplete = await prisma.enrollment.findMany({
    where: { 
      userId,
      // Add logic for incomplete courses
    },
    include: { course: true },
    take: limit
  })

  return incomplete.map(enrollment => ({
    courseId: enrollment.courseId,
    score: 0.9,
    reason: 'Continue your learning journey',
    type: 'skill-based',
    course: enrollment.course
  }))
}

function extractKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3)
    .slice(0, 5)
}

async function saveRecommendations(userId: string, recommendations: any[]) {
  // Recommendations are not persisted since the model doesn't exist
  // This is a placeholder for future implementation
  console.log(`Generated ${recommendations.length} recommendations for user ${userId}`)
}

export async function trackUserActivity(
  userId: string,
  action: string,
  target: string,
  targetId: string,
  metadata?: any
) {
  if (!(await isFeatureEnabled('ai_recommendations'))) {
    return
  }

  // User activity tracking is not implemented since the model doesn't exist
  console.log(`User ${userId} performed ${action} on ${target}:${targetId}`)
}