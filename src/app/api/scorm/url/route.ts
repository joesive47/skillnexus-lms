import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { lessonId, packageUrl } = await request.json()

    if (!lessonId || !packageUrl) {
      return NextResponse.json(
        { error: 'Missing lessonId or packageUrl' },
        { status: 400 }
      )
    }

    await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        launchUrl: packageUrl,
        type: 'SCORM'
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving SCORM URL:', error)
    return NextResponse.json(
      { error: 'Failed to save SCORM URL' },
      { status: 500 }
    )
  }
}
