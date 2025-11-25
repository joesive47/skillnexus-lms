import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id || !['ADMIN', 'TEACHER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const lessonId = formData.get('lessonId') as string
    const launchUrl = formData.get('launchUrl') as string

    if (!lessonId) {
      return NextResponse.json({ error: 'Lesson ID required' }, { status: 400 })
    }

    let finalLaunchUrl = launchUrl

    // Handle file upload (HTML5/SCORM)
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Create interactive directory
      const interactiveDir = join(process.cwd(), 'public', 'interactive', lessonId)
      if (!existsSync(interactiveDir)) {
        await mkdir(interactiveDir, { recursive: true })
      }

      if (file.name.endsWith('.zip')) {
        // For ZIP files, we'll extract them (simplified version)
        const fileName = 'content.zip'
        const filePath = join(interactiveDir, fileName)
        await writeFile(filePath, buffer)
        finalLaunchUrl = `/interactive/${lessonId}/index.html`
      } else {
        // Single HTML file
        const fileName = file.name
        const filePath = join(interactiveDir, fileName)
        await writeFile(filePath, buffer)
        finalLaunchUrl = `/interactive/${lessonId}/${fileName}`
      }
    }

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