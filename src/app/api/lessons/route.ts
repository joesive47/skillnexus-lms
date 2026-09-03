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
    console.log('Create lesson request:', body)
    
    const { courseId, title, type, youtubeUrl, content, order, scormPackageUrl, duration } = body

    // Validate required fields
    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 })
    }
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }
    if (!type) {
      return NextResponse.json({ error: 'Type is required' }, { status: 400 })
    }

    // Verify course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    })
    
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
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
        durationMin: duration || null,
      }
    })

    console.log('Lesson created:', lesson.id)

    // If SCORM, create SCORM package
    if (type === 'SCORM' && scormPackageUrl) {
      try {
        const scormPackage = await prisma.scormPackage.create({
          data: {
            lessonId: lesson.id,
            packagePath: scormPackageUrl,
            version: '2004',
            title: title,
          }
        })
        console.log('SCORM package created:', scormPackage.id)
      } catch (scormError) {
        console.error('SCORM package creation error:', scormError)
        // Delete lesson if SCORM fails
        await prisma.lesson.delete({ where: { id: lesson.id } })
        return NextResponse.json({ 
          error: 'Failed to create SCORM package',
          details: scormError instanceof Error ? scormError.message : 'Unknown error'
        }, { status: 500 })
      }
    }

    return NextResponse.json({ lesson, success: true }, { status: 201 })
  } catch (error) {
    console.error('Create lesson error:', error)
    return NextResponse.json({ 
      error: 'Failed to create lesson',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
