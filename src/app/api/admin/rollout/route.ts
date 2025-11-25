import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function GET() {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const rolloutStatus = {
    gamification: { enabled: true, percentage: 10, users: 150 },
    chatbot: { enabled: true, percentage: 25, users: 375 },
    socialFeatures: { enabled: true, percentage: 50, users: 750 },
    advancedAnalytics: { enabled: false, percentage: 0, users: 0 }
  }

  return NextResponse.json(rolloutStatus)
}

export async function POST(request: Request) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { feature, percentage } = await request.json()
  
  console.log(`Rollout updated: ${feature} to ${percentage}%`)
  
  return NextResponse.json({ success: true })
}