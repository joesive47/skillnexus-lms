import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id || session.user.role !== 'TEACHER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { lessonId, title, instruction, targetText, keywords, minWords, maxDuration, passingScore, maxAttempts } = body

    const assignment = await prisma.voiceAssignment.create({
      data: {
        lessonId,
        title,
        instruction,
        targetText,
        keywords: keywords ? JSON.stringify(keywords) : null,
        minWords: minWords || 50,
        maxDuration: maxDuration || 120,
        passingScore: passingScore || 70,
        maxAttempts: maxAttempts || 3
      }
    })

    return NextResponse.json({ success: true, assignment })
  } catch (error) {
    console.error('Create assignment error:', error)
    return NextResponse.json({ error: 'Failed to create assignment' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lessonId = searchParams.get('lessonId')

    if (!lessonId) {
      return NextResponse.json({ error: 'lessonId required' }, { status: 400 })
    }

    const assignment = await prisma.voiceAssignment.findFirst({
      where: { lessonId },
      include: {
        submissions: {
          include: {
            student: {
              select: { id: true, name: true, email: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    return NextResponse.json({ assignment })
  } catch (error) {
    console.error('Get assignment error:', error)
    return NextResponse.json({ error: 'Failed to get assignment' }, { status: 500 })
  }
}
