import { prisma } from './prisma'

export interface CreateLearningPathData {
  title: string
  description?: string
  careerId?: string
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
  estimatedHours?: number
  isPublic?: boolean
  tags?: string[]
  imageUrl?: string
  createdBy?: string
}

export interface CreatePathStepData {
  title: string
  description?: string
  type: 'COURSE' | 'SKILL_ASSESSMENT' | 'PROJECT' | 'QUIZ' | 'READING' | 'VIDEO'
  targetId?: string
  targetType?: string
  isRequired?: boolean
  estimatedHours?: number
  points?: number
  prerequisites?: string[]
  order: number
}

export class LearningPathService {
  
  async createLearningPath(data: CreateLearningPathData) {
    return prisma.learningPath.create({
      data: {
        ...data,
        tags: data.tags ? JSON.stringify(data.tags) : null
      },
      include: {
        career: true,
        creator: { select: { id: true, name: true, email: true } },
        steps: { orderBy: { order: 'asc' } },
        _count: { select: { enrollments: true, reviews: true } }
      }
    })
  }

  async addStepToPath(pathId: string, stepData: CreatePathStepData) {
    return prisma.learningPathStep.create({
      data: {
        ...stepData,
        pathId,
        prerequisites: JSON.stringify(stepData.prerequisites || [])
      }
    })
  }

  async enrollUserInPath(userId: string, pathId: string, options?: {
    learningStyle?: string
    timeGoal?: number
  }) {
    return prisma.learningPathEnrollment.create({
      data: {
        userId,
        pathId,
        learningStyle: options?.learningStyle,
        timeGoal: options?.timeGoal
      }
    })
  }

  async completeStep(userId: string, stepId: string, data?: {
    score?: number
    timeSpent?: number
    difficulty?: number
    feedback?: string
  }) {
    const completion = await prisma.stepCompletion.upsert({
      where: { userId_stepId: { userId, stepId } },
      update: {
        completedAt: new Date(),
        score: data?.score,
        timeSpent: data?.timeSpent,
        difficulty: data?.difficulty,
        feedback: data?.feedback,
        attempts: { increment: 1 }
      },
      create: {
        userId,
        stepId,
        score: data?.score,
        timeSpent: data?.timeSpent,
        difficulty: data?.difficulty,
        feedback: data?.feedback
      }
    })

    // Update path progress
    await this.updatePathProgress(userId, stepId)
    
    return completion
  }

  async updatePathProgress(userId: string, stepId: string) {
    const step = await prisma.learningPathStep.findUnique({
      where: { id: stepId },
      include: { path: { include: { steps: true } } }
    })

    if (!step) return null

    const completedSteps = await prisma.stepCompletion.count({
      where: {
        userId,
        step: { pathId: step.pathId }
      }
    })

    const totalSteps = step.path.steps.length
    const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0

    return prisma.learningPathEnrollment.update({
      where: { userId_pathId: { userId, pathId: step.pathId } },
      data: {
        progress,
        lastAccessAt: new Date(),
        completedAt: progress >= 100 ? new Date() : null
      }
    })
  }

  async getUserPaths(userId: string) {
    return prisma.learningPathEnrollment.findMany({
      where: { userId },
      include: {
        path: {
          include: {
            career: true,
            steps: {
              orderBy: { order: 'asc' },
              include: {
                completions: { where: { userId } }
              }
            },
            _count: { select: { enrollments: true } }
          }
        }
      },
      orderBy: { lastAccessAt: 'desc' }
    })
  }

  async getPathById(pathId: string, userId?: string) {
    return prisma.learningPath.findUnique({
      where: { id: pathId },
      include: {
        career: true,
        creator: { select: { id: true, name: true } },
        steps: {
          orderBy: { order: 'asc' },
          include: userId ? {
            completions: { where: { userId } }
          } : undefined
        },
        enrollments: userId ? {
          where: { userId }
        } : undefined,
        reviews: {
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        _count: { select: { enrollments: true, reviews: true } }
      }
    })
  }

  async getPublicPaths(filters?: {
    careerId?: string
    difficulty?: string
    tags?: string[]
    limit?: number
    offset?: number
  }) {
    const where: any = { isPublic: true, isActive: true }
    
    if (filters?.careerId) where.careerId = filters.careerId
    if (filters?.difficulty) where.difficulty = filters.difficulty
    if (filters?.tags?.length) {
      where.OR = filters.tags.map(tag => ({
        tags: { contains: tag }
      }))
    }

    return prisma.learningPath.findMany({
      where,
      include: {
        career: true,
        creator: { select: { name: true } },
        _count: { select: { enrollments: true, reviews: true } }
      },
      orderBy: { enrollments: { _count: 'desc' } },
      take: filters?.limit || 20,
      skip: filters?.offset || 0
    })
  }

  async addPathReview(userId: string, pathId: string, rating: number, comment?: string) {
    return prisma.pathReview.upsert({
      where: { userId_pathId: { userId, pathId } },
      update: { rating, comment },
      create: { userId, pathId, rating, comment }
    })
  }

  async getPathStats(pathId: string) {
    const [enrollmentCount, completionCount, avgRating, reviews] = await Promise.all([
      prisma.learningPathEnrollment.count({ where: { pathId } }),
      prisma.learningPathEnrollment.count({ 
        where: { pathId, completedAt: { not: null } } 
      }),
      prisma.pathReview.aggregate({
        where: { pathId },
        _avg: { rating: true }
      }),
      prisma.pathReview.count({ where: { pathId } })
    ])

    return {
      enrollments: enrollmentCount,
      completions: completionCount,
      completionRate: enrollmentCount > 0 ? (completionCount / enrollmentCount) * 100 : 0,
      avgRating: avgRating._avg.rating || 0,
      reviewCount: reviews
    }
  }

  async updateLearningStreak(userId: string) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const streak = await prisma.learningStreak.findUnique({
      where: { userId }
    })

    if (!streak) {
      return prisma.learningStreak.create({
        data: {
          userId,
          currentStreak: 1,
          longestStreak: 1,
          lastActivity: new Date()
        }
      })
    }

    const lastActivity = new Date(streak.lastActivity)
    lastActivity.setHours(0, 0, 0, 0)
    
    const daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24))

    let newCurrentStreak = streak.currentStreak
    if (daysDiff === 1) {
      newCurrentStreak += 1
    } else if (daysDiff > 1) {
      newCurrentStreak = 1
    }

    return prisma.learningStreak.update({
      where: { userId },
      data: {
        currentStreak: newCurrentStreak,
        longestStreak: Math.max(streak.longestStreak, newCurrentStreak),
        lastActivity: new Date()
      }
    })
  }
}

export const learningPathService = new LearningPathService()