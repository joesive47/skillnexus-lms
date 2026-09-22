import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { AccessError, publicError, requireEnrollment, requireUser } from '@/lib/access-control'
import { requirePreviousLessons } from '@/lib/learning-evidence'

/**
 * Streams an enrolled learner's SCORM archive through the LMS origin.  This
 * neutral route avoids browser filters that block paths containing "scorm"
 * while retaining the same authorization rules as the course player.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const user = await requireUser()
    const { lessonId } = await params
    const scormPackage = await prisma.scormPackage.findUnique({
      where: { lessonId },
      include: { lesson: true },
    })

    if (!scormPackage) {
      return NextResponse.json({ error: 'Learning package not found' }, { status: 404 })
    }

    if (user.role !== 'ADMIN' && user.role !== 'TEACHER') {
      await requireEnrollment(user.id, scormPackage.lesson.courseId)
      await requirePreviousLessons(user.id, lessonId)
    }

    const sourceUrl = new URL(scormPackage.packagePath)
    if (sourceUrl.protocol !== 'https:' || !sourceUrl.hostname.endsWith('.blob.vercel-storage.com')) {
      throw new AccessError('Learning package storage is not supported', 409)
    }

    const source = await fetch(sourceUrl, { cache: 'no-store' })
    if (!source.ok || !source.body) throw new AccessError('Learning package is unavailable', 502)

    return new NextResponse(source.body, {
      headers: {
        'Content-Type': source.headers.get('content-type') || 'application/octet-stream',
        'Cache-Control': 'private, no-store',
      },
    })
  } catch (error) {
    console.error('Error fetching learning package:', error)
    return NextResponse.json(
      { error: publicError(error) },
      { status: error instanceof AccessError ? error.status : 500 }
    )
  }
}
