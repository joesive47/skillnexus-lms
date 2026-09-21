import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { AccessError, publicError, requireUser, requireLessonAccess } from '@/lib/access-control'
import { saveScormProgress } from '@/lib/scorm-progress-secure'
import { issueCertificateOnCompletion } from '@/lib/issue-certificate'
export async function GET(request: NextRequest) {
  try {
    const user = await requireUser()
    const lessonId = request.nextUrl.searchParams.get('lessonId')
    const target = request.nextUrl.searchParams.get('userId')
    if (!lessonId) throw new AccessError('Lesson ID required', 400)
    if (target && target !== user.id) throw new AccessError('Forbidden')
    await requireLessonAccess(user.id, lessonId)
    const pkg = await prisma.scormPackage.findUnique({ where: { lessonId } })
    if (!pkg) throw new AccessError('SCORM package not found', 404)
    const progress = await prisma.scormProgress.findUnique({ where: { userId_packageId: { userId: user.id, packageId: pkg.id } } })
    return NextResponse.json({ success: true, progress, package: pkg })
  } catch (error) { return NextResponse.json({ error: publicError(error) }, { status: error instanceof AccessError ? error.status : 500 }) }
}
export async function POST(request: NextRequest) {
  try {
    const user = await requireUser()
    const { lessonId, userId, cmiData } = await request.json()
    if (typeof lessonId !== 'string') throw new AccessError('Lesson ID required', 400)
    if (userId && userId !== user.id) throw new AccessError('Forbidden')
    const result = await saveScormProgress(user.id, lessonId, cmiData)
    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId }, select: { courseId: true } })
    const certificate = result.completed && lesson ? await issueCertificateOnCompletion(user.id, lesson.courseId) : null
    return NextResponse.json({ success: true, ...result, certificate })
  } catch (error) { return NextResponse.json({ error: publicError(error) }, { status: error instanceof AccessError ? error.status : 500 }) }
}
