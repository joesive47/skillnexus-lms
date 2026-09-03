import { prisma } from './prisma'

interface SkillGap {
  skillId: string
  skillName: string
  currentLevel: number
  targetLevel: number
  gap: number
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  recommendedCourses: string[]
  estimatedHours: number
}

interface AnalysisResult {
  userId: string
  careerId?: string
  skillGaps: SkillGap[]
  overallScore: number
  readinessLevel: 'READY' | 'NEEDS_IMPROVEMENT' | 'BEGINNER'
  recommendations: string[]
  estimatedTimeToGoal: string
}

export class SkillGapAnalyzer {
  
  async analyzeUserSkillGaps(userId: string, careerId?: string): Promise<AnalysisResult> {
    const [userSkills, careerRequirements] = await Promise.all([
      this.getUserSkillLevels(userId),
      careerId ? this.getCareerSkillRequirements(careerId) : []
    ])

    const skillGaps = this.calculateSkillGaps(userSkills, careerRequirements)
    const overallScore = this.calculateOverallScore(skillGaps)
    const readinessLevel = this.determineReadinessLevel(overallScore)
    
    return {
      userId,
      careerId,
      skillGaps,
      overallScore,
      readinessLevel,
      recommendations: await this.generateRecommendations(skillGaps, readinessLevel),
      estimatedTimeToGoal: this.estimateTimeToGoal(skillGaps)
    }
  }

  private async getUserSkillLevels(userId: string) {
    const assessments = await prisma.skillAssessment.findMany({
      where: { userId },
      include: { skill: true }
    })

    // Also infer skills from completed courses
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: { 
        course: {
          include: {
            lessons: {
              include: {
                watchHistory: { where: { userId, completed: true } }
              }
            }
          }
        }
      }
    })

    const skillMap = new Map()
    
    // Add assessed skills
    assessments.forEach(assessment => {
      skillMap.set(assessment.skillId, {
        id: assessment.skillId,
        name: assessment.skill.name,
        level: assessment.level,
        source: 'assessment'
      })
    })

    // Infer skills from completed courses
    enrollments.forEach(enrollment => {
      const completedLessons = enrollment.course.lessons.filter(lesson => 
        lesson.watchHistory.length > 0
      ).length
      const totalLessons = enrollment.course.lessons.length
      const completionRate = totalLessons > 0 ? completedLessons / totalLessons : 0

      if (completionRate >= 0.8) {
        const inferredSkills = this.inferSkillsFromCourse(enrollment.course)
        inferredSkills.forEach(skill => {
          const existing = skillMap.get(skill.id)
          if (!existing || existing.source === 'inferred') {
            skillMap.set(skill.id, {
              ...skill,
              level: Math.min(existing?.level || 0 + 1, 3),
              source: 'inferred'
            })
          }
        })
      }
    })

    return Array.from(skillMap.values())
  }

  private async getCareerSkillRequirements(careerId: string) {
    const questions = await prisma.assessmentQuestion.findMany({
      where: { careerId },
      include: { skill: true }
    })

    const skillRequirements = new Map()
    
    questions.forEach(question => {
      const skillId = question.skillId
      if (!skillRequirements.has(skillId)) {
        skillRequirements.set(skillId, {
          id: skillId,
          name: question.skill.name,
          requiredLevel: 3, // Default target level
          importance: 1.0
        })
      }
    })

    return Array.from(skillRequirements.values())
  }

  private calculateSkillGaps(userSkills: any[], requirements: any[]): SkillGap[] {
    return requirements.map(requirement => {
      const userSkill = userSkills.find(skill => skill.id === requirement.id)
      const currentLevel = userSkill?.level || 0
      const gap = Math.max(0, requirement.requiredLevel - currentLevel)
      
      return {
        skillId: requirement.id,
        skillName: requirement.name,
        currentLevel,
        targetLevel: requirement.requiredLevel,
        gap,
        priority: this.calculatePriority(gap, requirement.importance),
        recommendedCourses: [], // Will be populated later
        estimatedHours: gap * 8 // 8 hours per skill level
      }
    }).filter(gap => gap.gap > 0)
      .sort((a, b) => this.getPriorityWeight(b.priority) - this.getPriorityWeight(a.priority))
  }

  private calculatePriority(gap: number, importance: number): 'HIGH' | 'MEDIUM' | 'LOW' {
    const score = gap * importance
    if (score >= 3) return 'HIGH'
    if (score >= 1.5) return 'MEDIUM'
    return 'LOW'
  }

  private getPriorityWeight(priority: string): number {
    const weights = { HIGH: 3, MEDIUM: 2, LOW: 1 }
    return weights[priority as keyof typeof weights] || 1
  }

  private calculateOverallScore(skillGaps: SkillGap[]): number {
    if (skillGaps.length === 0) return 100
    
    const totalGap = skillGaps.reduce((sum, gap) => sum + gap.gap, 0)
    const maxPossibleGap = skillGaps.length * 5 // Assuming max level is 5
    
    return Math.max(0, 100 - (totalGap / maxPossibleGap) * 100)
  }

  private determineReadinessLevel(score: number): 'READY' | 'NEEDS_IMPROVEMENT' | 'BEGINNER' {
    if (score >= 80) return 'READY'
    if (score >= 50) return 'NEEDS_IMPROVEMENT'
    return 'BEGINNER'
  }

  private async generateRecommendations(skillGaps: SkillGap[], readinessLevel: string): Promise<string[]> {
    const recommendations = []
    
    switch (readinessLevel) {
      case 'READY':
        recommendations.push('You\'re well-prepared! Focus on advanced projects and certifications')
        break
      case 'NEEDS_IMPROVEMENT':
        recommendations.push('Focus on your top 3 skill gaps first')
        recommendations.push('Consider intensive courses or bootcamps')
        break
      case 'BEGINNER':
        recommendations.push('Start with foundation courses')
        recommendations.push('Build one skill at a time')
        break
    }

    const highPriorityGaps = skillGaps.filter(gap => gap.priority === 'HIGH')
    if (highPriorityGaps.length > 0) {
      recommendations.push(`Prioritize learning: ${highPriorityGaps.slice(0, 2).map(g => g.skillName).join(', ')}`)
    }

    return recommendations
  }

  private estimateTimeToGoal(skillGaps: SkillGap[]): string {
    const totalHours = skillGaps.reduce((sum, gap) => sum + gap.estimatedHours, 0)
    const weeksAt10HoursPerWeek = Math.ceil(totalHours / 10)
    
    if (weeksAt10HoursPerWeek <= 4) return `${weeksAt10HoursPerWeek} weeks`
    if (weeksAt10HoursPerWeek <= 16) return `${Math.ceil(weeksAt10HoursPerWeek / 4)} months`
    return `${Math.ceil(weeksAt10HoursPerWeek / 12)} months`
  }

  private inferSkillsFromCourse(course: any): any[] {
    const title = course.title.toLowerCase()
    const skills: any[] = []
    
    // Simple keyword matching - in production, use NLP or manual tagging
    const skillKeywords = {
      'javascript': { id: 'js', name: 'JavaScript' },
      'python': { id: 'py', name: 'Python' },
      'react': { id: 'react', name: 'React' },
      'node': { id: 'node', name: 'Node.js' },
      'html': { id: 'html', name: 'HTML/CSS' },
      'css': { id: 'html', name: 'HTML/CSS' },
      'sql': { id: 'sql', name: 'SQL' }
    }

    Object.entries(skillKeywords).forEach(([keyword, skill]) => {
      if (title.includes(keyword)) {
        skills.push(skill)
      }
    })

    return skills
  }

  async getSkillTrends(): Promise<any[]> {
    // Mock data for skill market trends
    return [
      { skill: 'JavaScript', demand: 95, growth: 15, avgSalary: 75000 },
      { skill: 'Python', demand: 90, growth: 25, avgSalary: 80000 },
      { skill: 'React', demand: 85, growth: 20, avgSalary: 78000 },
      { skill: 'Node.js', demand: 80, growth: 18, avgSalary: 76000 },
      { skill: 'TypeScript', demand: 75, growth: 30, avgSalary: 82000 }
    ]
  }

  async recommendLearningPath(userId: string, skillGaps: SkillGap[]): Promise<any> {
    const topGaps = skillGaps.slice(0, 3)
    const courses = await prisma.course.findMany({
      where: { published: true },
      include: { _count: { select: { enrollments: true } } }
    })

    const pathSteps = topGaps.map((gap, index) => {
      const relevantCourses = courses.filter(course => 
        course.title.toLowerCase().includes(gap.skillName.toLowerCase())
      ).slice(0, 2)

      return {
        order: index + 1,
        skill: gap.skillName,
        courses: relevantCourses,
        estimatedHours: gap.estimatedHours,
        priority: gap.priority
      }
    })

    return {
      userId,
      recommendedPath: pathSteps,
      totalEstimatedHours: topGaps.reduce((sum, gap) => sum + gap.estimatedHours, 0),
      estimatedCompletion: this.estimateTimeToGoal(topGaps)
    }
  }
}

export const skillGapAnalyzer = new SkillGapAnalyzer()