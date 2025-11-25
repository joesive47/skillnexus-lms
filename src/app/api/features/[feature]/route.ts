import { NextRequest, NextResponse } from 'next/server'
import { isFeatureEnabled, type FeatureFlags } from '@/lib/feature-flags'

const VALID_FEATURES = ['gamification', 'videoProgress', 'chatbot', 'socialFeatures', 'advancedAnalytics'] as const

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ feature: string }> }
) {
  try {
    const { feature } = await params
    
    if (!VALID_FEATURES.includes(feature as any)) {
      return NextResponse.json({ error: 'Invalid feature' }, { status: 400 })
    }
    
    const enabled = await isFeatureEnabled(feature as keyof FeatureFlags)
    return NextResponse.json({ enabled })
  } catch (error) {
    return NextResponse.json({ enabled: false })
  }
}