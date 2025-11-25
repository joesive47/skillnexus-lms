import { prisma } from './prisma'

interface PathGenerationRequest {
  userId: string
  careerId?: string
  skillIds?: string[]
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
  timeCommitment?: number
  learningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'reading' | 'mixed'
  goals?: string
}

interface GeneratedPathStep {
  title: string
  description: string
  type: 'COURSE' | 'SKILL_ASSESSMENT' | 'PROJECT' | 'QUIZ'
  estimatedHours: number
  order: number
  targetId?: string
  prerequisites: string[]
}

export class AIPathGenerator {
  
  async generatePersonalizedPath(request: PathGenerationRequest) {
    const userProfile = await this.analyzeUserProfile(request.userId)
    const skillGaps = await this.identifySkillGaps(request, userProfile)
    const pathSteps = await this.generateOptimalSteps(skillGaps, request)
    
    return {
      title: await this.generatePathTitle(request),
      description: await this.generatePathDescription(request, skillGaps),
      difficulty: request.difficulty || 'BEGINNER',
      estimatedHours: pathSteps.reduce((sum, step) => sum + step.estimatedHours, 0),
      steps: pathSteps,
      aiInsights: {
        skillGaps: skillGaps.map(gap => gap.skill.name),
        recommendations: await this.generateRecommendations(userProfile, skillGaps),
        estimatedCompletion: this.calculateCompletionTime(pathSteps, request.timeCommitment || 5)
      }
    }
  }

  private async analyzeUserProfile(userId: string) {
    const [skillAssessments, enrollments, completions] = await Promise.all([
      prisma.skillAssessment.findMany({
        where: { userId },
        include: { skill: true }
      }),
      prisma.enrollment.findMany({
        where: { userId },
        include: { course: true }
      }),
      prisma.stepCompletion.findMany({
        where: { userId },
        include: { step: true }
      })
    ])

    const learningVelocity = this.calculateLearningVelocity(completions)
    const preferredDifficulty = this.inferPreferredDifficulty(completions)
    
    return {
      skillLevels: skillAssessments,
      completedCourses: enrollments,
      learningVelocity,
      preferredDifficulty,
      totalCompletions: completions.length
    }
  }

  private async identifySkillGaps(request: PathGenerationRequest, userProfile: any) {
    let targetSkills: any[] = []

    if (request.careerId) {
      const careerSkills = await prisma.assessmentQuestion.findMany({
        where: { careerId: request.careerId },
        include: { skill: true },
        distinct: ['skillId']
      })
      targetSkills = careerSkills.map(cq => cq.skill)
    }

    if (request.skillIds?.length) {
      const requestedSkills = await prisma.skill.findMany({
        where: { id: { in: request.skillIds } }
      })
      targetSkills = [...targetSkills, ...requestedSkills]
    }

    return targetSkills.map(skill => {
      const currentLevel = userProfile.skillLevels.find((s: any) => s.skillId === skill.id)?.level || 0
      const targetLevel = this.getTargetLevel(request.difficulty)
      
      return {
        skill,
        currentLevel,
        targetLevel,
        gap: Math.max(0, targetLevel - currentLevel),
        priority: this.calculatePriority(skill, request)
      }
    }).filter(gap => gap.gap > 0)
      .sort((a, b) => (b.priority * b.gap) - (a.priority * a.gap))
  }

  private async generateOptimalSteps(skillGaps: any[], request: PathGenerationRequest): Promise<GeneratedPathStep[]> {
    const steps: GeneratedPathStep[] = []
    let order = 1

    for (const gap of skillGaps.slice(0, 5)) { // Limit to top 5 skills
      // Assessment step
      if (gap.currentLevel === 0) {
        steps.push({
          title: `${gap.skill.name} Assessment`,
          description: `Evaluate your current ${gap.skill.name} knowledge`,
          type: 'SKILL_ASSESSMENT',
          estimatedHours: 0.5,
          order: order++,
          targetId: gap.skill.id,
          prerequisites: []
        })
      }

      // Learning steps based on gap
      const learningSteps = await this.generateLearningSteps(gap, request, order)
      steps.push(...learningSteps)
      order += learningSteps.length

      // Project step for advanced levels
      if (gap.targetLevel >= 3) {
        steps.push({
          title: `${gap.skill.name} Project`,
          description: `Apply ${gap.skill.name} skills in a real project`,
          type: 'PROJECT',
          estimatedHours: 8,
          order: order++,
          prerequisites: steps.filter(s => s.targetId === gap.skill.id).map((_, i) => `step${i + 1}`)
        })
      }
    }

    return this.optimizeStepOrder(steps)
  }

  private async generateLearningSteps(gap: any, request: PathGenerationRequest, startOrder: number): Promise<GeneratedPathStep[]> {
    const steps: GeneratedPathStep[] = []
    const skillName = gap.skill.name.toLowerCase()
    
    // Find relevant courses
    const courses = await prisma.course.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: skillName } },
          { description: { contains: skillName } }
        ]
      },
      include: { _count: { select: { enrollments: true } } },
      orderBy: { enrollments: { _count: 'desc' } },
      take: 2
    })

    // Generate course steps
    courses.forEach((course, index) => {
      steps.push({
        title: course.title,
        description: course.description || `Learn ${gap.skill.name} fundamentals`,
        type: 'COURSE',
        estimatedHours: this.estimateCourseHours(course, gap.targetLevel),
        order: startOrder + index,
        targetId: course.id,
        prerequisites: index > 0 ? [`step${startOrder + index - 1}`] : []
      })
    })

    // If no courses found, create generic learning step
    if (courses.length === 0) {
      steps.push({
        title: `${gap.skill.name} Fundamentals`,
        description: `Master the basics of ${gap.skill.name}`,
        type: 'COURSE',
        estimatedHours: gap.targetLevel * 8,
        order: startOrder,
        prerequisites: []
      })
    }

    return steps
  }

  private optimizeStepOrder(steps: GeneratedPathStep[]): GeneratedPathStep[] {
    // Simple topological sort based on prerequisites
    const sorted: GeneratedPathStep[] = []
    const visited = new Set<string>()
    
    const visit = (step: GeneratedPathStep) => {
      const stepId = `step${step.order}`
      if (visited.has(stepId)) return
      
      // Visit prerequisites first
      step.prerequisites.forEach(prereqId => {
        const prereq = steps.find(s => `step${s.order}` === prereqId)
        if (prereq) visit(prereq)
      })
      
      visited.add(stepId)
      sorted.push({ ...step, order: sorted.length + 1 })
    }

    steps.forEach(step => {
      if (!visited.has(`step${step.order}`)) {
        visit(step)
      }
    })

    return sorted
  }

  private calculateLearningVelocity(completions: any[]): number {
    if (completions.length === 0) return 1.0
    
    const avgTimeSpent = completions
      .filter(c => c.timeSpent)
      .reduce((sum, c) => sum + c.timeSpent, 0) / completions.length
    
    // Normalize: faster learners get higher velocity
    return Math.max(0.5, Math.min(2.0, 60 / (avgTimeSpent || 60)))
  }

  private inferPreferredDifficulty(completions: any[]): string {
    const avgScore = completions
      .filter(c => c.score)
      .reduce((sum, c) => sum + c.score, 0) / completions.length
    
    if (avgScore >= 90) return 'ADVANCED'
    if (avgScore >= 75) return 'INTERMEDIATE'
    return 'BEGINNER'
  }

  private getTargetLevel(difficulty?: string): number {
    const levels = { BEGINNER: 2, INTERMEDIATE: 3, ADVANCED: 4, EXPERT: 5 }
    return levels[difficulty as keyof typeof levels] || 3
  }

  private calculatePriority(skill: any, request: PathGenerationRequest): number {
    let priority = 1.0
    if (request.careerId) priority += 0.5
    if (request.skillIds?.includes(skill.id)) priority += 0.3
    return priority
  }

  private estimateCourseHours(course: any, targetLevel: number): number {
    const baseHours = 10
    const levelMultiplier = targetLevel * 0.5
    return Math.round(baseHours * levelMultiplier)
  }

  private async generatePathTitle(request: PathGenerationRequest): Promise<string> {
    if (request.careerId) {
      const career = await prisma.career.findUnique({ where: { id: request.careerId } })
      return `Path to ${career?.title || 'Your Career Goal'}`
    }
    return 'Personalized Learning Journey'
  }

  private async generatePathDescription(request: PathGenerationRequest, skillGaps: any[]): Promise<string> {
    const skillNames = skillGaps.slice(0, 3).map(gap => gap.skill.name).join(', ')
    const difficultyText = request.difficulty?.toLowerCase() || 'beginner'
    return `A ${difficultyText}-level path to master ${skillNames}. Tailored to your learning style and goals.`
  }

  private async generateRecommendations(userProfile: any, skillGaps: any[]): Promise<string[]> {
    const recommendations = []
    
    if (userProfile.totalCompletions < 5) {
      recommendations.push('Start with foundation courses to build learning momentum')
    }
    
    if (skillGaps.length > 3) {
      recommendations.push('Focus on 2-3 core skills first before expanding')
    }
    
    if (userProfile.learningVelocity > 1.5) {
      recommendations.push('Consider advanced courses to match your learning pace')
    }
    
    recommendations.push('Practice regularly and join community discussions')
    
    return recommendations
  }

  private calculateCompletionTime(steps: GeneratedPathStep[], hoursPerWeek: number): string {
    const totalHours = steps.reduce((sum, step) => sum + step.estimatedHours, 0)
    const weeks = Math.ceil(totalHours / hoursPerWeek)
    
    if (weeks <= 4) return `${weeks} weeks`
    if (weeks <= 12) return `${Math.ceil(weeks / 4)} months`
    return `${Math.ceil(weeks / 12)} months`
  }
}

export const aiPathGenerator = new AIPathGenerator()