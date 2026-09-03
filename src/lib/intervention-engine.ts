interface InterventionRule {
  id: string
  condition: string
  threshold: number
  action: 'email' | 'line' | 'unlock_content' | 'assign_mentor' | 'reduce_difficulty'
  message: string
  priority: 'low' | 'medium' | 'high'
}

interface InterventionLog {
  userId: string
  ruleId: string
  action: string
  executedAt: Date
  success: boolean
  response?: string
}

export class InterventionEngine {
  private rules: InterventionRule[] = [
    {
      id: 'login_frequency',
      condition: 'days_since_login > 7',
      threshold: 7,
      action: 'email',
      message: 'เรามิสคุณแล้ว! กลับมาเรียนต่อกันเถอะ 📚',
      priority: 'high'
    },
    {
      id: 'low_quiz_score',
      condition: 'quiz_score < 60',
      threshold: 60,
      action: 'unlock_content',
      message: 'ปลดล็อกเนื้อหาทบทวนพิเศษสำหรับคุณ',
      priority: 'medium'
    },
    {
      id: 'engagement_drop',
      condition: 'engagement_level < 30',
      threshold: 30,
      action: 'reduce_difficulty',
      message: 'เราได้ปรับระดับความยากให้เหมาะกับคุณแล้ว',
      priority: 'high'
    }
  ]

  async processInterventions(): Promise<void> {
    const atRiskUsers = await this.getAtRiskUsers()
    
    for (const userId of atRiskUsers) {
      await this.evaluateUserForInterventions(userId)
    }
  }

  async evaluateUserForInterventions(userId: string): Promise<void> {
    const userMetrics = await this.getUserMetrics(userId)
    
    for (const rule of this.rules) {
      if (this.shouldTriggerIntervention(userMetrics, rule)) {
        await this.executeIntervention(userId, rule)
      }
    }
  }

  private shouldTriggerIntervention(metrics: any, rule: InterventionRule): boolean {
    switch (rule.condition) {
      case 'days_since_login > 7':
        return metrics.daysSinceLogin > rule.threshold
      case 'quiz_score < 60':
        return metrics.lastQuizScore < rule.threshold
      case 'engagement_level < 30':
        return metrics.engagementLevel < rule.threshold
      default:
        return false
    }
  }

  private async executeIntervention(userId: string, rule: InterventionRule): Promise<void> {
    try {
      switch (rule.action) {
        case 'email':
          await this.sendEmail(userId, rule.message)
          break
        case 'line':
          await this.sendLineNotification(userId, rule.message)
          break
        case 'unlock_content':
          await this.unlockRemedialContent(userId)
          break
        case 'reduce_difficulty':
          await this.adjustDifficulty(userId, 'easier')
          break
      }

      await this.logIntervention(userId, rule.id, rule.action, true)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      await this.logIntervention(userId, rule.id, rule.action, false, errorMessage)
    }
  }

  private async sendEmail(userId: string, message: string): Promise<void> {
    // Email implementation
    console.log(`📧 Email sent to ${userId}: ${message}`)
  }

  private async sendLineNotification(userId: string, message: string): Promise<void> {
    // Line API implementation
    console.log(`📱 Line notification to ${userId}: ${message}`)
  }

  private async unlockRemedialContent(userId: string): Promise<void> {
    // Unlock simplified lessons
    console.log(`🔓 Unlocked remedial content for ${userId}`)
  }

  private async adjustDifficulty(userId: string, direction: 'easier' | 'harder'): Promise<void> {
    // Adjust content difficulty
    console.log(`⚙️ Adjusted difficulty ${direction} for ${userId}`)
  }

  private async getAtRiskUsers(): Promise<string[]> {
    // Mock implementation
    return ['user1', 'user2', 'user3']
  }

  private async getUserMetrics(userId: string): Promise<any> {
    // Mock metrics
    return {
      daysSinceLogin: Math.floor(Math.random() * 14),
      lastQuizScore: Math.floor(Math.random() * 100),
      engagementLevel: Math.floor(Math.random() * 100)
    }
  }

  private async logIntervention(userId: string, ruleId: string, action: string, success: boolean, error?: string): Promise<void> {
    const log: InterventionLog = {
      userId,
      ruleId,
      action,
      executedAt: new Date(),
      success,
      response: error
    }
    
    console.log('📝 Intervention logged:', log)
  }
}