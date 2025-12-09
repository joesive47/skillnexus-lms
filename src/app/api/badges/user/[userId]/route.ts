import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { BadgeService } from '@/lib/badge-service'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth()
    const resolvedParams = await params
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Users can only view their own badges unless they're admin
    if (session.user.id !== resolvedParams.userId && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const badgeService = new BadgeService()
    const badges = await badgeService.getUserBadges(resolvedParams.userId)

    return NextResponse.json(badges)
  } catch (error) {
    console.error('Get user badges error:', error)
    return NextResponse.json({ error: 'Failed to get user badges' }, { status: 500 })
  }
}