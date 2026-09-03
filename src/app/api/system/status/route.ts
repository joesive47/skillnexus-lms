import { NextResponse } from 'next/server'
import { FeatureFlagService } from '@/lib/feature-flags'
import { AccessError, publicError, requireAdmin } from '@/lib/access-control'

export async function GET() {
  try {
    await requireAdmin()
    const status = {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      features: await FeatureFlagService.getAllFlags(),
      timestamp: new Date().toISOString()
    }
    return NextResponse.json(status)
  } catch (error) {
    return NextResponse.json({ error: publicError(error) }, { status: error instanceof AccessError ? error.status : 500 })
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin()
    const { feature, enabled } = await request.json()
    if (typeof feature !== 'string' || typeof enabled !== 'boolean') {
      return NextResponse.json({ error: 'Feature and boolean enabled value are required' }, { status: 400 })
    }
    const flags = await FeatureFlagService.getAllFlags()
    if (!(feature in flags)) return NextResponse.json({ error: 'Unknown feature' }, { status: 400 })
    await FeatureFlagService.toggle(feature as keyof typeof flags, enabled)
    return NextResponse.json({
      success: true,
      message: `Feature ${feature} ${enabled ? 'enabled' : 'disabled'}`
    })
  } catch (error) {
    return NextResponse.json({ error: publicError(error) }, { status: error instanceof AccessError ? error.status : 500 })
  }
}
