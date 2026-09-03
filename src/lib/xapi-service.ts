interface XAPIStatement {
  actor: {
    name: string
    mbox: string
  }
  verb: {
    id: string
    display: { [key: string]: string }
  }
  object: {
    id: string
    definition: {
      name: { [key: string]: string }
      description: { [key: string]: string }
    }
  }
  result?: {
    score?: {
      scaled: number
      raw: number
      min: number
      max: number
    }
    completion?: boolean
    success?: boolean
    duration?: string
  }
  timestamp: string
}

export class XAPIService {
  private endpoint: string
  private auth: string

  constructor() {
    this.endpoint = process.env.XAPI_ENDPOINT || '/api/xapi/statements'
    this.auth = process.env.XAPI_AUTH || ''
  }

  async sendStatement(statement: XAPIStatement): Promise<boolean> {
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Experience-API-Version': '1.0.3',
          'Authorization': this.auth
        },
        body: JSON.stringify(statement)
      })

      return response.ok
    } catch (error) {
      console.error('xAPI Error:', error)
      return false
    }
  }

  createCompletedStatement(userId: string, userEmail: string, courseId: string, courseName: string): XAPIStatement {
    return {
      actor: {
        name: userId,
        mbox: `mailto:${userEmail}`
      },
      verb: {
        id: 'http://adlnet.gov/expapi/verbs/completed',
        display: { 'en-US': 'completed', 'th-TH': 'เรียนจบ' }
      },
      object: {
        id: `https://skillnexus.com/courses/${courseId}`,
        definition: {
          name: { 'en-US': courseName, 'th-TH': courseName },
          description: { 'en-US': 'SkillNexus Course', 'th-TH': 'หลักสูตร SkillNexus' }
        }
      },
      result: {
        completion: true,
        success: true
      },
      timestamp: new Date().toISOString()
    }
  }

  createProgressStatement(userId: string, userEmail: string, lessonId: string, lessonName: string, progress: number): XAPIStatement {
    return {
      actor: {
        name: userId,
        mbox: `mailto:${userEmail}`
      },
      verb: {
        id: 'http://adlnet.gov/expapi/verbs/progressed',
        display: { 'en-US': 'progressed', 'th-TH': 'มีความคืบหน้า' }
      },
      object: {
        id: `https://skillnexus.com/lessons/${lessonId}`,
        definition: {
          name: { 'en-US': lessonName, 'th-TH': lessonName },
          description: { 'en-US': 'SkillNexus Lesson', 'th-TH': 'บทเรียน SkillNexus' }
        }
      },
      result: {
        score: {
          scaled: progress / 100,
          raw: progress,
          min: 0,
          max: 100
        }
      },
      timestamp: new Date().toISOString()
    }
  }

  createQuizStatement(userId: string, userEmail: string, quizId: string, quizName: string, score: number, maxScore: number): XAPIStatement {
    return {
      actor: {
        name: userId,
        mbox: `mailto:${userEmail}`
      },
      verb: {
        id: 'http://adlnet.gov/expapi/verbs/answered',
        display: { 'en-US': 'answered', 'th-TH': 'ตอบ' }
      },
      object: {
        id: `https://skillnexus.com/quizzes/${quizId}`,
        definition: {
          name: { 'en-US': quizName, 'th-TH': quizName },
          description: { 'en-US': 'SkillNexus Quiz', 'th-TH': 'แบบทดสอบ SkillNexus' }
        }
      },
      result: {
        score: {
          scaled: score / maxScore,
          raw: score,
          min: 0,
          max: maxScore
        },
        completion: true,
        success: score >= (maxScore * 0.7)
      },
      timestamp: new Date().toISOString()
    }
  }
}