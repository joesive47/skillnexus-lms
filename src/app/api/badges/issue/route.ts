import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { BadgeService } from '@/lib/badge-service'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { badgeId } = await request.json()

    const badgeService = new BadgeService()
    const verifyCode = await badgeService.issueBadge(session.user.id, badgeId)

    if (!verifyCode) {
      return NextResponse.json({ error: 'Not eligible for this badge' }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true,
      verifyCode 
    })
  } catch (error) {
    console.error('Issue badge error:', error)
    return NextResponse.json({ error: 'Failed to issue badge' }, { status: 500 })
  }
}