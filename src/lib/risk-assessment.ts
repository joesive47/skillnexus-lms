interface RiskFactors {
  loginFrequency: number // days since last login
  assessmentScores: number[] // recent quiz scores
  engagementLevel: number // 0-100
  completionRate: number // 0-100
  timeSpentLearning: number // minutes per week
}

interface RiskAssessment {
  userId: string
  riskScore: number // 0-100 (100 = highest risk)
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  factors: RiskFactors
  recommendations: string[]
  interventionRequired: boolean
}

export class RiskAssessmentEngine {
  async calculateRiskScore(userId: string): Promise<RiskAssessment> {
    const factors = await this.getUserRiskFactors(userId)
    
    // Risk calculation algorithm
    let riskScore = 0
    
    // Login frequency (30% weight)
    if (factors.loginFrequency > 7) riskScore += 30
    else if (factors.loginFrequency > 3) riskScore += 15
    
    // Assessment performance (25% weight)
    const avgScore = factors.assessmentScores.reduce((a, b) => a + b, 0) / factors.assessmentScores.length
    if (avgScore < 50) riskScore += 25
    else if (avgScore < 70) riskScore += 12
    
    // Engagement (25% weight)
    if (factors.engagementLevel < 30) riskScore += 25
    else if (factors.engagementLevel < 60) riskScore += 12
    
    // Completion rate (20% weight)
    if (factors.completionRate < 40) riskScore += 20
    else if (factors.completionRate < 70) riskScore += 10
    
    const riskLevel = this.getRiskLevel(riskScore)
    const recommendations = this.generateRecommendations(factors, riskScore)
    
    return {
      userId,
      riskScore,
      riskLevel,
      factors,
      recommendations,
      interventionRequired: riskScore >= 60
    }
  }

  private async getUserRiskFactors(userId: string): Promise<RiskFactors> {
    // Mock implementation - replace with actual data fetching
    return {
      loginFrequency: Math.floor(Math.random() * 14),
      assessmentScores: [65, 72, 58, 80, 45],
      engagementLevel: Math.floor(Math.random() * 100),
      completionRate: Math.floor(Math.random() * 100),
      timeSpentLearning: Math.floor(Math.random() * 300)
    }
  }

  private getRiskLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
    if (score >= 80) return 'critical'
    if (score >= 60) return 'high'
    if (score >= 40) return 'medium'
    return 'low'
  }

  private generateRecommendations(factors: RiskFactors, riskScore: number): string[] {
    const recommendations: string[] = []
    
    if (factors.loginFrequency > 7) {
      recommendations.push('ส่งการแจ้งเตือนเพื่อกระตุ้นการเข้าสู่ระบบ')
    }
    
    if (factors.assessmentScores.some(score => score < 60)) {
      recommendations.push('จัดเตรียมเนื้อหาทบทวนเพิ่มเติม')
    }
    
    if (factors.engagementLevel < 50) {
      recommendations.push('เปลี่ยนรูปแบบการเรียนให้น่าสนใจมากขึ้น')
    }
    
    return recommendations
  }
}