import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id || !['ADMIN', 'TEACHER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file')
    const lessonId = formData.get('lessonId') as string
    const launchUrl = formData.get('launchUrl') as string

    if (!lessonId) {
      return NextResponse.json({ error: 'Lesson ID required' }, { status: 400 })
    }

    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId }, select: { id: true } })
    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    // Serving uploaded HTML from the LMS origin enables stored XSS. Keep local
    // packages disabled until an isolated content origin and archive scanner exist.
    if (file instanceof File && file.size > 0) {
      return NextResponse.json(
        { error: 'Local interactive uploads are temporarily disabled for security. Use an HTTPS content URL.' },
        { status: 410 }
      )
    }

    let parsedLaunchUrl: URL
    try {
      parsedLaunchUrl = new URL(launchUrl)
    } catch {
      return NextResponse.json({ error: 'A valid HTTPS launch URL is required' }, { status: 400 })
    }
    if (parsedLaunchUrl.protocol !== 'https:' || parsedLaunchUrl.username || parsedLaunchUrl.password) {
      return NextResponse.json({ error: 'Only HTTPS launch URLs without embedded credentials are allowed' }, { status: 400 })
    }

    const finalLaunchUrl = parsedLaunchUrl.toString()

    // Update lesson with launch URL
    const updatedLesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        type: 'interactive',
        lessonType: 'INTERACTIVE',
        launchUrl: finalLaunchUrl
      }
    })

    return NextResponse.json({ 
      success: true, 
      lesson: updatedLesson,
      launchUrl: finalLaunchUrl 
    })
  } catch (error) {
    console.error('Interactive upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
