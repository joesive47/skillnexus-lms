/**
 * Skill Assessment Analyzer
 * วิเคราะห์ผลการประเมินและแนะนำหลักสูตร
 */

export interface SkillScore {
  skillName: string
  score: number
  maxScore: number
  percentage: number
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  weakPoints: string[]
  strengths: string[]
}

export interface AssessmentAnalysis {
  overallScore: number
  overallLevel: string
  skillBreakdown: SkillScore[]
  weakestSkills: SkillScore[]
  strongestSkills: SkillScore[]
  recommendations: CourseRecommendation[]
  learningPath: LearningPathStep[]
  estimatedLearningTime: number
  careerReadiness: number
}

export interface CourseRecommendation {
  courseId?: string
  courseTitle: string
  courseLink: string
  relevantSkills: string[]
  priority: 'High' | 'Medium' | 'Low'
  reason: string
  estimatedDuration: string
  difficulty: string
}

export interface LearningPathStep {
  step: number
  title: string
  skills: string[]
  courses: string[]
  duration: string
  description: string
}

export class AssessmentAnalyzer {
  /**
   * วิเคราะห์ผลการประเมินแบบละเอียด
   */
  static analyzeAssessment(
    skillScores: Record<string, { score: number; max: number }>,
    answers: Record<string, string[]>,
    questions: any[],
    careerTitle: string
  ): AssessmentAnalysis {
    // คำนวณคะแนนรวม
    const totalScore = Object.values(skillScores).reduce((sum, s) => sum + s.score, 0)
    const totalMax = Object.values(skillScores).reduce((sum, s) => sum + s.max, 0)
    const overallScore = totalMax > 0 ? (totalScore / totalMax) * 100 : 0

    // วิเคราะห์แต่ละทักษะ
    const skillBreakdown = this.analyzeSkills(skillScores, answers, questions)

    // หาจุดอ่อนและจุดแข็ง
    const weakestSkills = skillBreakdown
      .filter(s => s.percentage < 60)
      .sort((a, b) => a.percentage - b.percentage)
      .slice(0, 3)

    const strongestSkills = skillBreakdown
      .filter(s => s.percentage >= 80)
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 3)

    // สร้างคำแนะนำหลักสูตร
    const recommendations = this.generateRecommendations(
      skillBreakdown,
      weakestSkills,
      careerTitle
    )

    // สร้าง Learning Path
    const learningPath = this.createLearningPath(weakestSkills, recommendations)

    // คำนวณเวลาเรียนโดยประมาณ
    const estimatedLearningTime = this.calculateLearningTime(weakestSkills)

    // คำนวณความพร้อมในอาชีพ
    const careerReadiness = this.calculateCareerReadiness(skillBreakdown)

    return {
      overallScore,
      overallLevel: this.getLevel(overallScore),
      skillBreakdown,
      weakestSkills,
      strongestSkills,
      recommendations,
      learningPath,
      estimatedLearningTime,
      careerReadiness
    }
  }

  /**
   * วิเคราะห์แต่ละทักษะอย่างละเอียด
   */
  private static analyzeSkills(
    skillScores: Record<string, { score: number; max: number }>,
    answers: Record<string, string[]>,
    questions: any[]
  ): SkillScore[] {
    return Object.entries(skillScores).map(([skillName, scores]) => {
      const percentage = scores.max > 0 ? (scores.score / scores.max) * 100 : 0
      
      // หาคำถามที่เกี่ยวข้องกับทักษะนี้
      const skillQuestions = questions.filter(q => q.skill?.name === skillName)
      
      // วิเคราะห์จุดอ่อน
      const weakPoints: string[] = []
      const strengths: string[] = []
      
      skillQuestions.forEach(q => {
        const userAnswers = answers[q.id] || []
        const correctAnswers = q.correctAnswer.split(',').map((a: string) => a.trim())
        const isCorrect = correctAnswers.length === userAnswers.length &&
                         correctAnswers.every((answer: string) => userAnswers.includes(answer))
        
        if (!isCorrect) {
          weakPoints.push(q.questionText.substring(0, 100))
        } else {
          strengths.push(q.questionText.substring(0, 100))
        }
      })

      return {
        skillName,
        score: scores.score,
        maxScore: scores.max,
        percentage,
        level: this.getLevel(percentage),
        weakPoints: weakPoints.slice(0, 3),
        strengths: strengths.slice(0, 3)
      }
    })
  }

  /**
   * สร้างคำแนะนำหลักสูตรตามผลการประเมิน
   */
  private static generateRecommendations(
    skillBreakdown: SkillScore[],
    weakestSkills: SkillScore[],
    careerTitle: string
  ): CourseRecommendation[] {
    const recommendations: CourseRecommendation[] = []

    // แนะนำหลักสูตรสำหรับทักษะที่อ่อน (Priority: High)
    weakestSkills.forEach(skill => {
      recommendations.push({
        courseTitle: `${skill.skillName} Fundamentals`,
        courseLink: `/courses?skill=${encodeURIComponent(skill.skillName)}`,
        relevantSkills: [skill.skillName],
        priority: 'High',
        reason: `คะแนนของคุณในทักษะนี้อยู่ที่ ${skill.percentage.toFixed(1)}% ควรเริ่มต้นจากพื้นฐาน`,
        estimatedDuration: '4-6 สัปดาห์',
        difficulty: 'Beginner'
      })
    })

    // แนะนำหลักสูตรระดับกลางสำหรับทักษะที่ปานกลาง (Priority: Medium)
    const intermediateSkills = skillBreakdown.filter(
      s => s.percentage >= 40 && s.percentage < 70
    )
    
    intermediateSkills.slice(0, 2).forEach(skill => {
      recommendations.push({
        courseTitle: `${skill.skillName} Intermediate`,
        courseLink: `/courses?skill=${encodeURIComponent(skill.skillName)}&level=intermediate`,
        relevantSkills: [skill.skillName],
        priority: 'Medium',
        reason: `คุณมีพื้นฐานที่ดีแล้ว (${skill.percentage.toFixed(1)}%) พร้อมที่จะพัฒนาต่อ`,
        estimatedDuration: '6-8 สัปดาห์',
        difficulty: 'Intermediate'
      })
    })

    // แนะนำหลักสูตรขั้นสูงสำหรับทักษะที่แข็งแกร่ง (Priority: Low)
    const advancedSkills = skillBreakdown.filter(s => s.percentage >= 70)
    
    if (advancedSkills.length > 0) {
      const topSkill = advancedSkills[0]
      recommendations.push({
        courseTitle: `${topSkill.skillName} Advanced & Certification`,
        courseLink: `/courses?skill=${encodeURIComponent(topSkill.skillName)}&level=advanced`,
        relevantSkills: [topSkill.skillName],
        priority: 'Low',
        reason: `คุณมีความเชี่ยวชาญสูง (${topSkill.percentage.toFixed(1)}%) พร้อมสำหรับการรับรอง`,
        estimatedDuration: '8-12 สัปดาห์',
        difficulty: 'Advanced'
      })
    }

    // แนะนำหลักสูตรรวมสำหรับอาชีพ
    recommendations.push({
      courseTitle: `${careerTitle} Complete Career Path`,
      courseLink: `/career-pathway?career=${encodeURIComponent(careerTitle)}`,
      relevantSkills: skillBreakdown.map(s => s.skillName),
      priority: 'Medium',
      reason: 'หลักสูตรครบวงจรสำหรับการพัฒนาอาชีพในสายงานนี้',
      estimatedDuration: '3-6 เดือน',
      difficulty: 'All Levels'
    })

    return recommendations
  }

  /**
   * สร้าง Learning Path แบบขั้นตอน
   */
  private static createLearningPath(
    weakestSkills: SkillScore[],
    recommendations: CourseRecommendation[]
  ): LearningPathStep[] {
    const path: LearningPathStep[] = []

    // Step 1: Foundation (ทักษะที่อ่อนที่สุด)
    if (weakestSkills.length > 0) {
      path.push({
        step: 1,
        title: 'Foundation Building',
        skills: weakestSkills.slice(0, 2).map(s => s.skillName),
        courses: recommendations
          .filter(r => r.priority === 'High')
          .slice(0, 2)
          .map(r => r.courseTitle),
        duration: '1-2 เดือน',
        description: 'เริ่มต้นด้วยการสร้างพื้นฐานที่แข็งแกร่งในทักษะหลัก'
      })
    }

    // Step 2: Skill Development
    path.push({
      step: 2,
      title: 'Skill Development',
      skills: weakestSkills.slice(2).map(s => s.skillName),
      courses: recommendations
        .filter(r => r.priority === 'Medium' && r.difficulty === 'Intermediate')
        .map(r => r.courseTitle),
      duration: '2-3 เดือน',
      description: 'พัฒนาทักษะให้ครบถ้วนและเชื่อมโยงกัน'
    })

    // Step 3: Advanced & Specialization
    path.push({
      step: 3,
      title: 'Advanced & Specialization',
      skills: ['All Skills'],
      courses: recommendations
        .filter(r => r.difficulty === 'Advanced' || r.difficulty === 'All Levels')
        .map(r => r.courseTitle),
      duration: '3-4 เดือน',
      description: 'เชี่ยวชาญและรับการรับรองในสายงาน'
    })

    return path
  }

  /**
   * คำนวณเวลาเรียนโดยประมาณ
   */
  private static calculateLearningTime(weakestSkills: SkillScore[]): number {
    // คำนวณจากจำนวนทักษะที่ต้องพัฒนาและระดับความอ่อน
    let totalWeeks = 0
    
    weakestSkills.forEach(skill => {
      if (skill.percentage < 30) {
        totalWeeks += 8 // 8 สัปดาห์สำหรับทักษะที่อ่อนมาก
      } else if (skill.percentage < 50) {
        totalWeeks += 6 // 6 สัปดาห์สำหรับทักษะที่อ่อน
      } else {
        totalWeeks += 4 // 4 สัปดาห์สำหรับทักษะที่ต้องปรับปรุง
      }
    })

    return totalWeeks
  }

  /**
   * คำนวณความพร้อมในอาชีพ (0-100)
   */
  private static calculateCareerReadiness(skillBreakdown: SkillScore[]): number {
    if (skillBreakdown.length === 0) return 0

    // คำนวณจากค่าเฉลี่ยของทักษะทั้งหมด แต่ให้น้ำหนักกับทักษะที่อ่อนมากขึ้น
    const avgScore = skillBreakdown.reduce((sum, s) => sum + s.percentage, 0) / skillBreakdown.length
    const minScore = Math.min(...skillBreakdown.map(s => s.percentage))
    
    // ถ้ามีทักษะใดทักษะหนึ่งอ่อนมาก จะลดความพร้อมลง
    const penalty = minScore < 40 ? 15 : minScore < 60 ? 10 : 0
    
    return Math.max(0, Math.min(100, avgScore - penalty))
  }

  /**
   * กำหนดระดับจากคะแนน
   */
  private static getLevel(percentage: number): 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' {
    if (percentage >= 81) return 'Expert'
    if (percentage >= 61) return 'Advanced'
    if (percentage >= 41) return 'Intermediate'
    return 'Beginner'
  }

  /**
   * สร้างรายงานสรุปแบบข้อความ
   */
  static generateTextReport(analysis: AssessmentAnalysis): string {
    let report = `📊 สรุปผลการประเมินทักษะ\n\n`
    report += `คะแนนรวม: ${analysis.overallScore.toFixed(1)}% (${analysis.overallLevel})\n`
    report += `ความพร้อมในอาชีพ: ${analysis.careerReadiness.toFixed(1)}%\n`
    report += `เวลาเรียนโดยประมาณ: ${analysis.estimatedLearningTime} สัปดาห์\n\n`

    report += `🎯 ทักษะที่ต้องพัฒนา:\n`
    analysis.weakestSkills.forEach((skill, i) => {
      report += `${i + 1}. ${skill.skillName}: ${skill.percentage.toFixed(1)}%\n`
    })

    report += `\n💪 ทักษะที่แข็งแกร่ง:\n`
    analysis.strongestSkills.forEach((skill, i) => {
      report += `${i + 1}. ${skill.skillName}: ${skill.percentage.toFixed(1)}%\n`
    })

    report += `\n📚 หลักสูตรแนะนำ (เรียงตามความสำคัญ):\n`
    analysis.recommendations
      .sort((a, b) => {
        const priority = { High: 3, Medium: 2, Low: 1 }
        return priority[b.priority] - priority[a.priority]
      })
      .forEach((rec, i) => {
        report += `${i + 1}. ${rec.courseTitle} [${rec.priority}]\n`
        report += `   ${rec.reason}\n`
      })

    return report
  }
}
