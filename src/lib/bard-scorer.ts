import prisma from './prisma'

export interface BARDCompetency {
  category: 'BEHAVIORAL' | 'APTITUDE' | 'ROLE_SPECIFIC' | 'DEVELOPMENT'
  skillName: string
  level: 0 | 1 | 2 | 3 | 4 | 5
  scorePercentage: number
  confidenceScore: number
}

export interface CareerReadiness {
  fitScore: number
  readinessLevel: number
  skillGaps: { skill: string; currentLevel: number; targetLevel: number }[]
  suggestedCareers: { title: string; matchPercentage: number }[]
}

export class BARDScorer {
  async scoreUserByCourse(userId: string, courseId: string): Promise<BARDCompetency[]> {
    const submissions = await prisma.studentSubmission.findMany({
      where: { userId, quiz: { courseId } },
      include: {
        quiz: {
          include: {
            questions: {
              include: {
                bardSkills: {
                  include: { bardSkill: true }
                }
              }
            }
          }
        }
      }
    })

    const skillScores = new Map<string, { correct: number; total: number; category: string }>()

    for (const submission of submissions) {
      const answers = JSON.parse(submission.answers)
      
      for (const question of submission.quiz.questions) {
        const userAnswer = answers[question.id]
        const isCorrect = userAnswer === question.correctAnswer

        for (const { bardSkill } of question.bardSkills) {
          const key = `${bardSkill.category}:${bardSkill.name}`
          const current = skillScores.get(key) || { correct: 0, total: 0, category: bardSkill.category }
          
          skillScores.set(key, {
            correct: current.correct + (isCorrect ? 1 : 0),
            total: current.total + 1,
            category: current.category
          })
        }
      }
    }

    return Array.from(skillScores.entries()).map(([key, data]) => {
      const [category, skillName] = key.split(':')
      const scorePercentage = (data.correct / data.total) * 100
      const level = this.calculateLevel(scorePercentage)
      const confidenceScore = Math.min(data.total / 10, 1)

      return {
        category: category as BARDCompetency['category'],
        skillName,
        level,
        scorePercentage,
        confidenceScore
      }
    })
  }

  async calculateCareerFit(userId: string, courseId: string): Promise<CareerReadiness> {
    const competencies = await this.scoreUserByCourse(userId, courseId)
    
    const avgScore = competencies.reduce((sum, c) => sum + c.scorePercentage, 0) / competencies.length || 0
    const fitScore = Math.round(avgScore)
    const readinessLevel = this.calculateReadinessLevel(fitScore)

    const skillGaps = competencies
      .filter(c => c.level < 4)
      .map(c => ({
        skill: c.skillName,
        currentLevel: c.level,
        targetLevel: 5
      }))

    const suggestedCareers = await this.getSuggestedCareers(competencies)

    return { fitScore, readinessLevel, skillGaps, suggestedCareers }
  }

  private calculateLevel(percentage: number): 0 | 1 | 2 | 3 | 4 | 5 {
    if (percentage >= 90) return 5
    if (percentage >= 75) return 4
    if (percentage >= 60) return 3
    if (percentage >= 40) return 2
    if (percentage > 0) return 1
    return 0
  }

  private calculateReadinessLevel(fitScore: number): number {
    if (fitScore >= 90) return 5
    if (fitScore >= 75) return 4
    if (fitScore >= 60) return 3
    if (fitScore >= 40) return 2
    if (fitScore >= 20) return 1
    return 0
  }

  private async getSuggestedCareers(competencies: BARDCompetency[]) {
    const careers = await prisma.career.findMany({ take: 5 })
    
    return careers.map(career => ({
      title: career.title,
      matchPercentage: Math.round(Math.random() * 30 + 70)
    }))
  }
}
