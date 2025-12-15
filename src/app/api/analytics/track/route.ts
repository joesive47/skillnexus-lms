import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    const body = await req.json()
    
    await prisma.analytics.create({
      data: {
        userId: session?.user?.id,
        event: body.event,
        page: body.page,
        userAgent: body.userAgent,
        timestamp: new Date(body.timestamp),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
