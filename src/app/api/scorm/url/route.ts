import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { AccessError, publicError, requireAdmin } from '@/lib/access-control'

export async function POST(request: Request) {
  try {
    await requireAdmin()
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
      { error: publicError(error) },
      { status: error instanceof AccessError ? error.status : 500 }
    )
  }
}
