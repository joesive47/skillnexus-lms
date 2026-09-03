import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { GamificationService } from '@/lib/gamification-service'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const stats = await GamificationService.getUserStats(session.user.id)
  return NextResponse.json(stats)
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { points, source } = await request.json()
  const result = await GamificationService.awardPoints(session.user.id, points, source)
  
  return NextResponse.json({ success: !!result })
}