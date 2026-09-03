import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { AccessError, publicError, requireUser, requireLessonAccess } from '@/lib/access-control'
import { recordVideoProgress, lessonCompleted } from '@/lib/learning-evidence'
import { validateVideoProgressEvidence } from '@/lib/video-presence'
type Context = { params: Promise<{ courseId: string; lessonId: string }> }
export async function POST(req: NextRequest, { params }: Context) {
  try {
    const user = await requireUser()
    const { courseId, lessonId } = await params
    const lesson = await requireLessonAccess(user.id, lessonId, courseId)
    const body = await req.json()
    if (lesson.quizId || lesson.lessonType === 'SCORM' || lesson.type === 'SCORM') {
      if (!await lessonCompleted(user.id, lessonId)) throw new AccessError('Submit the quiz or SCORM result through its dedicated endpoint')
    } else {
      const evidence = validateVideoProgressEvidence(body.evidence)
      if (!evidence) throw new AccessError('Secure video presence evidence is required', 400)
      await recordVideoProgress(user.id, lessonId, body.watchTime, evidence)
    }
    const watchHistory = await prisma.watchHistory.findUnique({ where: { userId_lessonId: { userId: user.id, lessonId } } })
    return NextResponse.json({ success: true, watchHistory, completed: !!watchHistory?.completed, message: 'Progress saved' })
  } catch (error) { return NextResponse.json({ error: publicError(error) }, { status: error instanceof AccessError ? error.status : 500 }) }
}
export async function GET(_req: NextRequest, { params }: Context) {
  try {
    const user = await requireUser()
    const { courseId, lessonId } = await params
    await requireLessonAccess(user.id, lessonId, courseId)
    const watchHistory = await prisma.watchHistory.findUnique({ where: { userId_lessonId: { userId: user.id, lessonId } } })
    return NextResponse.json({ watchHistory, progress: watchHistory?.totalTime ? watchHistory.watchTime / watchHistory.totalTime * 100 : 0 })
  } catch (error) { return NextResponse.json({ error: publicError(error) }, { status: error instanceof AccessError ? error.status : 500 }) }
}
