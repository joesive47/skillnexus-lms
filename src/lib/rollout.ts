export class RolloutService {
  static async isUserInRollout(userId: string, feature: string, percentage: number): Promise<boolean> {
    // Simple hash-based rollout
    const hash = this.hashUserId(userId)
    const userPercentile = hash % 100
    
    return userPercentile < percentage
  }

  static hashUserId(userId: string): number {
    let hash = 0
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }

  static async getFeatureForUser(userId: string, feature: string): Promise<boolean> {
    const rollouts = {
      gamification: 10,
      chatbot: 25,
      socialFeatures: 50,
      advancedAnalytics: 0
    }

    const percentage = rollouts[feature as keyof typeof rollouts] || 0
    return this.isUserInRollout(userId, feature, percentage)
  }
}

export const isUserInRollout = RolloutService.isUserInRollout