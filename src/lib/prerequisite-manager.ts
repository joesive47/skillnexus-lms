import { prisma } from './prisma'

interface PrerequisiteCheck {
  stepId: string
  isUnlocked: boolean
  missingPrerequisites: string[]
  completionRate: number
}

interface LearningSequence {
  steps: any[]
  dependencies: Map<string, string[]>
  recommendedOrder: string[]
}

export class PrerequisiteManager {
  
  async checkStepPrerequisites(userId: string, stepId: string): Promise<PrerequisiteCheck> {
    const step = await prisma.learningPathStep.findUnique({
      where: { id: stepId },
      include: { path: { include: { steps: true } } }
    })

    if (!step) {
      throw new Error('Step not found')
    }

    const prerequisites = JSON.parse(step.prerequisites || '[]')
    if (prerequisites.length === 0) {
      return {
        stepId,
        isUnlocked: true,
        missingPrerequisites: [],
        completionRate: 100
      }
    }

    const completedSteps = await prisma.stepCompletion.findMany({
      where: {
        userId,
        stepId: { in: prerequisites }
      }
    })

    const completedStepIds = completedSteps.map(c => c.stepId)
    const missingPrerequisites = prerequisites.filter((prereqId: string) => 
      !completedStepIds.includes(prereqId)
    )

    return {
      stepId,
      isUnlocked: missingPrerequisites.length === 0,
      missingPrerequisites,
      completionRate: (completedStepIds.length / prerequisites.length) * 100
    }
  }

  async getUnlockedSteps(userId: string, pathId: string): Promise<string[]> {
    const path = await prisma.learningPath.findUnique({
      where: { id: pathId },
      include: { steps: { orderBy: { order: 'asc' } } }
    })

    if (!path) return []

    const unlockedSteps: string[] = []
    
    for (const step of path.steps) {
      const check = await this.checkStepPrerequisites(userId, step.id)
      if (check.isUnlocked) {
        unlockedSteps.push(step.id)
      }
    }

    return unlockedSteps
  }

  async getNextRecommendedStep(userId: string, pathId: string): Promise<string | null> {
    const unlockedSteps = await this.getUnlockedSteps(userId, pathId)
    const completedSteps = await prisma.stepCompletion.findMany({
      where: { 
        userId,
        step: { pathId }
      },
      select: { stepId: true }
    })

    const completedStepIds = completedSteps.map(c => c.stepId)
    const availableSteps = unlockedSteps.filter(stepId => 
      !completedStepIds.includes(stepId)
    )

    if (availableSteps.length === 0) return null

    // Return the step with the lowest order
    const steps = await prisma.learningPathStep.findMany({
      where: { id: { in: availableSteps } },
      orderBy: { order: 'asc' }
    })

    return steps[0]?.id || null
  }

  async validateLearningSequence(pathId: string): Promise<LearningSequence> {
    const steps = await prisma.learningPathStep.findMany({
      where: { pathId },
      orderBy: { order: 'asc' }
    })

    const dependencies = new Map<string, string[]>()
    
    steps.forEach(step => {
      const prerequisites = JSON.parse(step.prerequisites || '[]')
      dependencies.set(step.id, prerequisites)
    })

    // Topological sort to find optimal order
    const recommendedOrder = this.topologicalSort(steps, dependencies)
    
    return {
      steps,
      dependencies,
      recommendedOrder
    }
  }

  private topologicalSort(steps: any[], dependencies: Map<string, string[]>): string[] {
    const visited = new Set<string>()
    const visiting = new Set<string>()
    const result: string[] = []

    const visit = (stepId: string) => {
      if (visiting.has(stepId)) {
        throw new Error(`Circular dependency detected involving step ${stepId}`)
      }
      if (visited.has(stepId)) return

      visiting.add(stepId)
      
      const prereqs = dependencies.get(stepId) || []
      prereqs.forEach(prereqId => {
        if (dependencies.has(prereqId)) {
          visit(prereqId)
        }
      })
      
      visiting.delete(stepId)
      visited.add(stepId)
      result.push(stepId)
    }

    steps.forEach(step => {
      if (!visited.has(step.id)) {
        visit(step.id)
      }
    })

    return result
  }

  async addPrerequisite(stepId: string, prerequisiteStepId: string): Promise<void> {
    const step = await prisma.learningPathStep.findUnique({
      where: { id: stepId }
    })

    if (!step) throw new Error('Step not found')

    const currentPrereqs = JSON.parse(step.prerequisites || '[]')
    if (!currentPrereqs.includes(prerequisiteStepId)) {
      currentPrereqs.push(prerequisiteStepId)
      
      await prisma.learningPathStep.update({
        where: { id: stepId },
        data: { prerequisites: JSON.stringify(currentPrereqs) }
      })
    }
  }

  async removePrerequisite(stepId: string, prerequisiteStepId: string): Promise<void> {
    const step = await prisma.learningPathStep.findUnique({
      where: { id: stepId }
    })

    if (!step) throw new Error('Step not found')

    const currentPrereqs = JSON.parse(step.prerequisites || '[]')
    const updatedPrereqs = currentPrereqs.filter((id: string) => id !== prerequisiteStepId)
    
    await prisma.learningPathStep.update({
      where: { id: stepId },
      data: { prerequisites: JSON.stringify(updatedPrereqs) }
    })
  }

  async getPrerequisiteChain(stepId: string): Promise<string[]> {
    const visited = new Set<string>()
    const chain: string[] = []

    const buildChain = async (currentStepId: string) => {
      if (visited.has(currentStepId)) return
      visited.add(currentStepId)

      const step = await prisma.learningPathStep.findUnique({
        where: { id: currentStepId }
      })

      if (!step) return

      const prerequisites = JSON.parse(step.prerequisites || '[]')
      for (const prereqId of prerequisites) {
        await buildChain(prereqId)
        if (!chain.includes(prereqId)) {
          chain.push(prereqId)
        }
      }
    }

    await buildChain(stepId)
    return chain
  }

  async suggestOptimalPath(userId: string, pathId: string): Promise<any[]> {
    const userProfile = await this.getUserLearningProfile(userId)
    const sequence = await this.validateLearningSequence(pathId)
    
    // Adjust order based on user's learning style and performance
    const optimizedOrder = this.optimizeForUser(sequence.recommendedOrder, userProfile)
    
    const steps = await prisma.learningPathStep.findMany({
      where: { id: { in: optimizedOrder } },
      include: {
        completions: { where: { userId } }
      }
    })

    return optimizedOrder.map(stepId => {
      const step = steps.find(s => s.id === stepId)
      return {
        ...step,
        isCompleted: (step?.completions?.length ?? 0) > 0,
        estimatedTimeForUser: this.estimateTimeForUser(step, userProfile)
      }
    })
  }

  private async getUserLearningProfile(userId: string) {
    const completions = await prisma.stepCompletion.findMany({
      where: { userId },
      include: { step: true }
    })

    const avgTimeSpent = completions.reduce((sum, c) => sum + (c.timeSpent || 0), 0) / completions.length
    const avgScore = completions.reduce((sum, c) => sum + (c.score || 0), 0) / completions.length
    
    return {
      avgTimeSpent: avgTimeSpent || 60,
      avgScore: avgScore || 75,
      learningVelocity: avgTimeSpent > 0 ? 60 / avgTimeSpent : 1.0,
      preferredDifficulty: avgScore >= 85 ? 'ADVANCED' : avgScore >= 70 ? 'INTERMEDIATE' : 'BEGINNER'
    }
  }

  private optimizeForUser(order: string[], userProfile: any): string[] {
    // Simple optimization - in production, use ML algorithms
    if (userProfile.learningVelocity > 1.5) {
      // Fast learners can handle more parallel learning
      return order
    } else {
      // Slower learners benefit from more sequential approach
      return order
    }
  }

  private estimateTimeForUser(step: any, userProfile: any): number {
    if (!step) return 0
    
    const baseTime = step.estimatedHours
    const velocityFactor = userProfile.learningVelocity
    
    return Math.round(baseTime / velocityFactor)
  }

  async detectCircularDependencies(pathId: string): Promise<string[][]> {
    const steps = await prisma.learningPathStep.findMany({
      where: { pathId }
    })

    const dependencies = new Map<string, string[]>()
    steps.forEach(step => {
      dependencies.set(step.id, JSON.parse(step.prerequisites || '[]'))
    })

    const cycles: string[][] = []
    const visited = new Set<string>()
    const recursionStack = new Set<string>()

    const detectCycle = (stepId: string, path: string[]): boolean => {
      if (recursionStack.has(stepId)) {
        const cycleStart = path.indexOf(stepId)
        cycles.push(path.slice(cycleStart))
        return true
      }

      if (visited.has(stepId)) return false

      visited.add(stepId)
      recursionStack.add(stepId)
      path.push(stepId)

      const prereqs = dependencies.get(stepId) || []
      for (const prereq of prereqs) {
        if (detectCycle(prereq, [...path])) {
          return true
        }
      }

      recursionStack.delete(stepId)
      return false
    }

    steps.forEach(step => {
      if (!visited.has(step.id)) {
        detectCycle(step.id, [])
      }
    })

    return cycles
  }
}

export const prerequisiteManager = new PrerequisiteManager()