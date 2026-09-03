import { NextRequest, NextResponse } from 'next/server'
import { isFeatureEnabled, type FeatureFlags } from '@/lib/feature-flags'

// Map snake_case to camelCase for feature names
const FEATURE_MAP: Record<string, keyof FeatureFlags> = {
  'gamification': 'gamification',
  'videoProgress': 'videoProgress',
  'video_progress': 'videoProgress',
  'chatbot': 'chatbot',
  'socialFeatures': 'socialFeatures',
  'social_features': 'socialFeatures',
  'advancedAnalytics': 'advancedAnalytics',
  'advanced_features': 'advancedAnalytics',
  'ai_recommendations': 'ai_recommendations'
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ feature: string }> }
) {
  try {
    const { feature } = await params
    
    const mappedFeature = FEATURE_MAP[feature]
    if (!mappedFeature) {
      return NextResponse.json({ error: 'Invalid feature' }, { status: 400 })
    }
    
    const enabled = await isFeatureEnabled(mappedFeature)
    return NextResponse.json({ enabled })
  } catch (error) {
    return NextResponse.json({ enabled: false })
  }
}