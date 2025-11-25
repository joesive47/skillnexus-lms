import { NextResponse } from 'next/server'
import { FeatureFlagService } from '@/lib/feature-flags'

export async function GET() {
  const status = {
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    features: await FeatureFlagService.getAllFlags(),
    timestamp: new Date().toISOString()
  }
  
  return NextResponse.json(status)
}

export async function POST(request: Request) {
  const { feature, enabled } = await request.json()
  
  await FeatureFlagService.toggle(feature, enabled)
  
  return NextResponse.json({ 
    success: true, 
    message: `Feature ${feature} ${enabled ? 'enabled' : 'disabled'}` 
  })
}