export interface FeatureFlags {
  gamification: boolean
  videoProgress: boolean
  chatbot: boolean
  socialFeatures: boolean
  advancedAnalytics: boolean
  ai_recommendations: boolean
}

const DEFAULT_FLAGS: FeatureFlags = {
  gamification: true,
  videoProgress: true,
  chatbot: false,
  socialFeatures: false,
  advancedAnalytics: false,
  ai_recommendations: true
}

export class FeatureFlagService {
  private static flags: FeatureFlags = { ...DEFAULT_FLAGS }

  static async isEnabled(feature: keyof FeatureFlags): Promise<boolean> {
    try {
      // In production, this would check Redis/DB
      return this.flags[feature] ?? false
    } catch {
      return DEFAULT_FLAGS[feature] ?? false
    }
  }

  static async toggle(feature: keyof FeatureFlags, enabled: boolean) {
    this.flags[feature] = enabled
    console.log(`Feature ${feature} ${enabled ? 'enabled' : 'disabled'}`)
  }

  static async getAllFlags(): Promise<FeatureFlags> {
    return { ...this.flags }
  }
}

export const isFeatureEnabled = FeatureFlagService.isEnabled