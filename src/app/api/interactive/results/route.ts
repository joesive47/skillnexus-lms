import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id || !['ADMIN', 'TEACHER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')
    const lessonId = searchParams.get('lessonId')

    let whereClause: any = {}

    if (lessonId) {
      whereClause.lessonId = lessonId
    } else if (courseId) {
      whereClause.lesson = {
        courseId: courseId
      }
    }

    const results = await prisma.interactiveResults.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        lesson: {
          select: {
            title: true,
            courseId: true
          }
        }
      },
      orderBy: {
        completedAt: 'desc'
      }
    })

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Interactive results error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}