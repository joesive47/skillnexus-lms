import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { BadgeService } from '@/lib/badge-service'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const badgeService = new BadgeService()
    const issuedBadges = await badgeService.checkAllBadgesForUser(session.user.id)

    return NextResponse.json({ 
      issuedBadges,
      count: issuedBadges.length 
    })
  } catch (error) {
    console.error('Check badges error:', error)
    return NextResponse.json({ error: 'Failed to check badges' }, { status: 500 })
  }
}