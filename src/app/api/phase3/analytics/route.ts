// Phase 3: Analytics API
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { AnalyticsEngine } from '@/lib/analytics-phase3'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const period = searchParams.get('period') || '30d'

    switch (type) {
      case 'user':
        const userAnalytics = await AnalyticsEngine.getUserAnalytics(session.user.id, period)
        return NextResponse.json(userAnalytics)

      case 'system':
        // Only allow admins to view system analytics
        if (session.user.role !== 'ADMIN') {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }
        const systemAnalytics = await AnalyticsEngine.getSystemAnalytics(period)
        return NextResponse.json(systemAnalytics)

      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, courseId, lessonId, duration, metadata } = body

    await AnalyticsEngine.trackEvent({
      userId: session.user.id,
      action,
      courseId,
      lessonId,
      duration,
      metadata
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics tracking error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}