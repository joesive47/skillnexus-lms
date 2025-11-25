import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const badges = await prisma.badge.findMany({
      where: { isActive: true },
      include: {
        userBadges: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(badges)
  } catch (error) {
    console.error('List badges error:', error)
    return NextResponse.json({ error: 'Failed to list badges' }, { status: 500 })
  }
}