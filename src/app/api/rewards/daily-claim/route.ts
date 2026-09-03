import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import RewardsSystem from '@/lib/rewards-system'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await RewardsSystem.claimDailyReward(session.user.id)
    
    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      reward: result.reward
    })
  } catch (error) {
    console.error('Daily claim API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}