import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

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

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { courseId, title, type, youtubeUrl, content, order, scormPackageUrl } = body

    // Validate required fields
    if (!courseId || !title || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create lesson
    const lesson = await prisma.lesson.create({
      data: {
        courseId,
        title,
        type: type || 'VIDEO',
        lessonType: type || 'VIDEO',
        youtubeUrl: youtubeUrl || null,
        content: content || null,
        order: order || 0,
      }
    })

    // If SCORM, create SCORM package
    if (type === 'SCORM' && scormPackageUrl) {
      try {
        await prisma.scormPackage.create({
          data: {
            lessonId: lesson.id,
            packagePath: scormPackageUrl,
            version: '2004',
            title: title,
          }
        })
      } catch (scormError) {
        console.error('SCORM package creation error:', scormError)
        // Continue even if SCORM package fails
      }
    }

    return NextResponse.json({ lesson }, { status: 201 })
  } catch (error) {
    console.error('Create lesson error:', error)
    return NextResponse.json({ 
      error: 'Failed to create lesson',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
