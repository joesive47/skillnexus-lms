import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const badges = await prisma.badge.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { userBadges: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(badges)
  } catch (error) {
    console.error('List badges error:', error)
    return NextResponse.json([], { status: 200 })
  }
}