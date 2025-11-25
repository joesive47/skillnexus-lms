// AI-Powered Learning Path Engine
import { prisma } from './prisma'

interface LearningPathRequest {
  userId: string
  careerId?: string
  skillIds?: string[]
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
  timeCommitment?: number // hours per week
  learningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'reading'
  goals?: string[]
}

interface GeneratedPath {
  id: string
  title: string
  description: string
  estimatedHours: number
  difficulty: string
  steps: PathStep[]
  prerequisites: string[]
  outcomes: string[]
}

interface PathStep {
  id: string
  title: string
  type: 'COURSE' | 'SKILL_ASSESSMENT' | 'PROJECT' | 'QUIZ' | 'READING'
  targetId: string
  estimatedHours: number
  prerequisites: string[]
  isRequired: boolean
  order: number
}

export class LearningPathEngine {
  
  /**
   * Generate personalized learning path based on user profile and goals
   */
  async generatePersonalizedPath(request: LearningPathRequest): Promise<GeneratedPath> {
    try {
      // 1. Analyze user's current skills and progress
      const userProfile = await this.analyzeUserProfile(request.userId)
      
      // 2. Identify skill gaps based on career/goals
      const skillGaps = await this.identifySkillGaps(request, userProfile)
      
      // 3. Generate optimal learning sequence
      const pathSteps = await this.generateOptimalSequence(skillGaps, request)
      
      // 4. Estimate time and difficulty
      const pathMetadata = this.calculatePathMetadata(pathSteps)
      
      // 5. Create the learning path
      const generatedPath: GeneratedPath = {
        id: `generated_${Date.now()}`,
        title: await this.generatePathTitle(request),
        description: await this.generatePathDescription(request, skillGaps),
        estimatedHours: pathMetadata.totalHours,
        difficulty: request.difficulty || 'BEGINNER',
        steps: pathSteps,
        prerequisites: pathMetadata.prerequisites,
        outcomes: await this.generateLearningOutcomes(skillGaps)
      }
      
      return generatedPath
      
    } catch (error) {
      console.error('Learning path generation error:', error)
      throw new Error('Failed to generate learning path')
    }
  }

  /**
   * Analyze user's current skill level and learning history
   */
  private async analyzeUserProfile(userId: string) {
    const [skillAssessments, enrollments, completions] = await Promise.all([
      // Current skill levels
      prisma.skillAssessment.findMany({
        where: { userId },
        include: { skill: true }
      }),
      
      // Course history
      prisma.enrollment.findMany({
        where: { userId },
        include: { 
          course: { 
            include: { 
              lessons: { include: { watchHistory: { where: { userId } } } }
            }
          }
        }
      }),
      
      // Assessment results
      prisma.assessmentResult.findMany({
        where: { userId },
        include: { career: true }
      })
    ])

    // Calculate learning velocity and preferences
    const learningVelocity = this.calculateLearningVelocity(enrollments)
    const preferredDifficulty = this.inferPreferredDifficulty(completions)
    const strongSkills = skillAssessments.filter(s => s.level >= 3).map(s => s.skill)
    const weakSkills = skillAssessments.filter(s => s.level < 2).map(s => s.skill)

    return {
      skillLevels: skillAssessments,
      learningVelocity,
      preferredDifficulty,
      strongSkills,
      weakSkills,
      completedCourses: enrollments.filter(e => this.isCourseCompleted(e)),
      careerInterests: completions.map(c => c.career)
    }
  }

  /**
   * Identify skill gaps based on career goals
   */
  private async identifySkillGaps(request: LearningPathRequest, userProfile: any) {
    let targetSkills: any[] = []

    if (request.careerId) {
      // Get skills required for the career
      const careerSkills = await prisma.assessmentQuestion.findMany({
        where: { careerId: request.careerId },
        include: { skill: true },
        distinct: ['skillId']
      })
      targetSkills = careerSkills.map(cq => cq.skill)
    }

    if (request.skillIds?.length) {
      // Get specific skills requested
      const requestedSkills = await prisma.skill.findMany({
        where: { id: { in: request.skillIds } }
      })
      targetSkills = [...targetSkills, ...requestedSkills]
    }

    // Calculate skill gaps
    const skillGaps = targetSkills.map(skill => {
      const currentLevel = userProfile.skillLevels.find((s: any) => s.skillId === skill.id)?.level || 0
      const targetLevel = this.getTargetSkillLevel(skill, request.difficulty)
      
      return {
        skill,
        currentLevel,
        targetLevel,
        gap: Math.max(0, targetLevel - currentLevel),
        priority: this.calculateSkillPriority(skill, request)
      }
    }).filter(gap => gap.gap > 0)

    // Sort by priority and gap size
    return skillGaps.sort((a, b) => (b.priority * b.gap) - (a.priority * a.gap))
  }

  /**
   * Generate optimal learning sequence with prerequisites
   */
  private async generateOptimalSequence(skillGaps: any[], request: LearningPathRequest): Promise<PathStep[]> {
    const steps: PathStep[] = []
    let stepOrder = 1

    for (const gap of skillGaps) {
      // Find courses that teach this skill
      const relevantCourses = await this.findCoursesForSkill(gap.skill.id, gap.targetLevel)
      
      // Add skill assessment first (if needed)
      if (gap.currentLevel === 0) {
        steps.push({
          id: `assessment_${gap.skill.id}`,
          title: `${gap.skill.name} Assessment`,
          type: 'SKILL_ASSESSMENT',
          targetId: gap.skill.id,
          estimatedHours: 0.5,
          prerequisites: [],
          isRequired: true,
          order: stepOrder++
        })
      }

      // Add courses in optimal order
      for (const course of relevantCourses) {
        const prerequisites = await this.getCoursePrerequisites(course.id, steps)
        
        steps.push({
          id: `course_${course.id}`,
          title: course.title,
          type: 'COURSE',
          targetId: course.id,
          estimatedHours: this.estimateCourseHours(course),
          prerequisites: prerequisites.map(p => p.id),
          isRequired: true,
          order: stepOrder++
        })
      }

      // Add practical project (if applicable)
      if (gap.targetLevel >= 3) {
        steps.push({
          id: `project_${gap.skill.id}`,
          title: `${gap.skill.name} Practical Project`,
          type: 'PROJECT',
          targetId: `project_${gap.skill.id}`,
          estimatedHours: 8,
          prerequisites: steps.filter(s => s.targetId === gap.skill.id || 
                                      relevantCourses.some(c => c.id === s.targetId)).map(s => s.id),
          isRequired: false,
          order: stepOrder++
        })
      }
    }

    return this.optimizeStepOrder(steps)
  }

  /**
   * Find courses that teach specific skills
   */
  private async findCoursesForSkill(skillId: string, targetLevel: number) {
    // This is a simplified version - in reality, you'd have skill-course mappings
    const courses = await prisma.course.findMany({
      where: { 
        published: true,
        // Add skill-course relationship when available
      },
      include: {
        lessons: true,
        _count: { select: { enrollments: true } }
      }
    })

    // Filter and rank courses by relevance (simplified)
    return courses
      .filter(course => this.courseTeachesSkill(course, skillId))
      .sort((a, b) => b._count.enrollments - a._count.enrollments)
      .slice(0, 3) // Top 3 most relevant courses
  }

  /**
   * Optimize step order based on prerequisites and learning efficiency
   */
  private optimizeStepOrder(steps: PathStep[]): PathStep[] {
    // Topological sort based on prerequisites
    const sorted: PathStep[] = []
    const visited = new Set<string>()
    const visiting = new Set<string>()

    const visit = (step: PathStep) => {
      if (visiting.has(step.id)) {
        throw new Error('Circular dependency detected in learning path')
      }
      if (visited.has(step.id)) return

      visiting.add(step.id)
      
      // Visit prerequisites first
      for (const prereqId of step.prerequisites) {
        const prereq = steps.find(s => s.id === prereqId)
        if (prereq) visit(prereq)
      }
      
      visiting.delete(step.id)
      visited.add(step.id)
      sorted.push({ ...step, order: sorted.length + 1 })
    }

    for (const step of steps) {
      if (!visited.has(step.id)) {
        visit(step)
      }
    }

    return sorted
  }

  /**
   * Calculate path metadata (total hours, prerequisites, etc.)
   */
  private calculatePathMetadata(steps: PathStep[]) {
    const totalHours = steps.reduce((sum, step) => sum + step.estimatedHours, 0)
    const prerequisites = steps
      .filter(step => step.prerequisites.length === 0)
      .map(step => step.title)

    return { totalHours, prerequisites }
  }

  /**
   * Generate learning outcomes based on skill gaps
   */
  private async generateLearningOutcomes(skillGaps: any[]): Promise<string[]> {
    return skillGaps.map(gap => 
      `Master ${gap.skill.name} to ${this.getLevelName(gap.targetLevel)} level`
    )
  }

  // Helper methods
  private calculateLearningVelocity(enrollments: any[]): number {
    // Calculate average completion time
    const completedCourses = enrollments.filter(e => this.isCourseCompleted(e))
    if (completedCourses.length === 0) return 1.0

    const avgCompletionTime = completedCourses.reduce((sum, course) => {
      return sum + this.calculateCourseCompletionTime(course)
    }, 0) / completedCourses.length

    // Normalize to velocity factor (1.0 = average, >1.0 = faster, <1.0 = slower)
    return Math.max(0.5, Math.min(2.0, 40 / avgCompletionTime)) // 40 hours = baseline
  }

  private inferPreferredDifficulty(completions: any[]): string {
    // Analyze completion patterns to infer preferred difficulty
    return 'INTERMEDIATE' // Simplified
  }

  private isCourseCompleted(enrollment: any): boolean {
    const totalLessons = enrollment.course.lessons.length
    const completedLessons = enrollment.course.lessons.filter((lesson: any) => 
      lesson.watchHistory.some((wh: any) => wh.completed)
    ).length

    return totalLessons > 0 && (completedLessons / totalLessons) >= 0.8
  }

  private getTargetSkillLevel(skill: any, difficulty?: string): number {
    const levelMap = {
      'BEGINNER': 2,
      'INTERMEDIATE': 3,
      'ADVANCED': 4,
      'EXPERT': 5
    }
    return levelMap[difficulty as keyof typeof levelMap] || 3
  }

  private calculateSkillPriority(skill: any, request: LearningPathRequest): number {
    // Calculate priority based on career relevance, market demand, etc.
    let priority = 1.0

    // Boost priority for career-relevant skills
    if (request.careerId) priority += 0.5

    // Boost priority for explicitly requested skills
    if (request.skillIds?.includes(skill.id)) priority += 0.3

    return priority
  }

  private courseTeachesSkill(course: any, skillId: string): boolean {
    // Simplified skill matching - in reality, use NLP or manual tagging
    const skillKeywords = ['javascript', 'python', 'react', 'node', 'sql']
    return skillKeywords.some(keyword => 
      course.title.toLowerCase().includes(keyword) ||
      course.description?.toLowerCase().includes(keyword)
    )
  }

  private async getCoursePrerequisites(courseId: string, existingSteps: PathStep[]): Promise<PathStep[]> {
    // Find prerequisite courses/skills
    return existingSteps.filter(step => 
      step.type === 'SKILL_ASSESSMENT' || step.type === 'COURSE'
    ).slice(0, 2) // Simplified
  }

  private estimateCourseHours(course: any): number {
    // Estimate based on lessons and content
    const lessonCount = course.lessons?.length || 0
    return Math.max(2, lessonCount * 0.5) // 30 min per lesson average
  }

  private calculateCourseCompletionTime(course: any): number {
    // Calculate actual completion time from watch history
    return 20 // Simplified - 20 hours average
  }

  private getLevelName(level: number): string {
    const names = ['None', 'Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert']
    return names[level] || 'Unknown'
  }

  private async generatePathTitle(request: LearningPathRequest): Promise<string> {
    if (request.careerId) {
      const career = await prisma.career.findUnique({ where: { id: request.careerId } })
      return `Path to ${career?.title || 'Your Career Goal'}`
    }
    return 'Personalized Learning Journey'
  }

  private async generatePathDescription(request: LearningPathRequest, skillGaps: any[]): Promise<string> {
    const skillNames = skillGaps.slice(0, 3).map(gap => gap.skill.name).join(', ')
    return `A personalized learning path to master ${skillNames} and advance your career. This path is tailored to your current skill level and learning preferences.`
  }
}

// Export singleton instance
export const learningPathEngine = new LearningPathEngine()

// Utility functions for path management
export async function enrollInLearningPath(userId: string, pathId: string) {
  return prisma.learningPathEnrollment.create({
    data: {
      userId,
      pathId,
      progress: 0
    }
  })
}

export async function updatePathProgress(userId: string, pathId: string) {
  // Calculate progress based on completed steps
  const enrollment = await prisma.learningPathEnrollment.findUnique({
    where: { userId_pathId: { userId, pathId } },
    include: {
      path: {
        include: {
          steps: {
            include: {
              completions: { where: { userId } }
            }
          }
        }
      }
    }
  })

  if (!enrollment) return null

  const totalSteps = enrollment.path.steps.length
  const completedSteps = enrollment.path.steps.filter(step => 
    step.completions.length > 0
  ).length

  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0

  return prisma.learningPathEnrollment.update({
    where: { userId_pathId: { userId, pathId } },
    data: { 
      progress,
      lastAccessAt: new Date(),
      completedAt: progress >= 100 ? new Date() : null
    }
  })
}