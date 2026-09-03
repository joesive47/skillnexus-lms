// Phase 3: Gamification API
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { GamificationEngine } from '@/lib/gamification-phase3'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'status':
        const status = await GamificationEngine.getUserStatus(session.user.id)
        return NextResponse.json(status)

      case 'leaderboard':
        const category = searchParams.get('category') || 'all_time'
        const limit = parseInt(searchParams.get('limit') || '10')
        const leaderboard = await GamificationEngine.getLeaderboard(category, limit)
        return NextResponse.json(leaderboard)

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Gamification API error:', error)
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
    const { action, points, metadata } = body

    const result = await GamificationEngine.awardPoints({
      userId: session.user.id,
      action,
      points,
      metadata
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Gamification award error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}