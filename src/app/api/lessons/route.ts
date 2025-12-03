import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const lessons = await prisma.lesson.findMany({
      include: {
        course: {
          select: { id: true, title: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ lessons })
  } catch (error) {
    console.error('Get lessons error:', error)
    return NextResponse.json({ error: 'Failed to get lessons' }, { status: 500 })
  }
}
