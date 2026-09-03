import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, description, icon, color, points } = await request.json()

    const badge = await prisma.badge.create({
      data: {
        name,
        description,
        icon,
        color,
        points: points || 100
      }
    })

    return NextResponse.json(badge)
  } catch (error) {
    console.error('Create badge error:', error)
    return NextResponse.json({ error: 'Failed to create badge' }, { status: 500 })
  }
}