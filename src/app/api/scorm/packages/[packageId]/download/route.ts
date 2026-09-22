import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { AccessError, publicError, requireEnrollment, requireUser } from '@/lib/access-control'
import { requirePreviousLessons } from '@/lib/learning-evidence'

/**
 * Same-origin SCORM archive delivery for the browser player. Vercel Blob
 * archives are public objects, but fetching them through the LMS prevents
 * browser CSP/CORS rules from breaking a legitimate learner session.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ packageId: string }> }
) {
  try {
    const user = await requireUser()
    const { packageId } = await params
    const scormPackage = await prisma.scormPackage.findFirst({
      where: { OR: [{ id: packageId }, { lessonId: packageId }] },
      include: { lesson: { select: { id: true, courseId: true } } },
    })
    if (!scormPackage) throw new AccessError('SCORM package not found', 404)

    if (user.role !== 'ADMIN' && user.role !== 'TEACHER') {
      await requireEnrollment(user.id, scormPackage.lesson.courseId)
      await requirePreviousLessons(user.id, scormPackage.lesson.id)
    }

    const sourceUrl = new URL(scormPackage.packagePath)
    if (sourceUrl.protocol !== 'https:' || !sourceUrl.hostname.endsWith('.blob.vercel-storage.com')) {
      throw new AccessError('SCORM package storage is not supported', 409)
    }

    const source = await fetch(sourceUrl, { cache: 'no-store' })
    if (!source.ok || !source.body) throw new AccessError('SCORM package is unavailable', 502)

    return new NextResponse(source.body, {
      headers: {
        'Content-Type': source.headers.get('content-type') || 'application/zip',
        'Cache-Control': 'private, no-store',
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: publicError(error) },
      { status: error instanceof AccessError ? error.status : 500 }
    )
  }
}
