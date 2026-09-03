import prisma from '@/lib/prisma'
import { AccessError, requireEnrollment, requireLessonAccess } from '@/lib/access-control'
import { canAccessNode } from '@/lib/learning-flow-engine'
import { refreshProgressSummary } from '@/lib/progress-summary'
import { creditedActiveSeconds, validateVideoProgressEvidence, type VideoProgressEvidence } from '@/lib/video-presence'

export async function lessonCompleted(userId: string, lessonId: string): Promise<boolean> {
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId }, include: { scormPackage: true } })
  if (!lesson) return false
  if (lesson.quizId) return !!await prisma.studentSubmission.findFirst({
    where: { userId, quizId: lesson.quizId, passed: true }
  })
  if (lesson.scormPackage || lesson.lessonType === 'SCORM' || lesson.type === 'SCORM') {
    const [progress, runtime] = await Promise.all([
      lesson.scormPackage ? prisma.scormProgress.findUnique({ where: {
        userId_packageId: { userId, packageId: lesson.scormPackage.id }
      } }) : null,
      prisma.scormRuntimeData.findUnique({ where: { userId_lessonId: { userId, lessonId } } })
    ])
    return [progress, runtime].some(record => record &&
      ['completed', 'passed'].includes(record.completionStatus || '') && record.successStatus !== 'failed')
  }
  const history = await prisma.watchHistory.findUnique({ where: { userId_lessonId: { userId, lessonId } } })
  const duration = lesson.duration || (lesson.durationMin || 0) * 60
  const threshold = lesson.requiredPct ?? lesson.requiredCompletionPercentage
  return duration > 0 && threshold > 0 && threshold <= 100 && !!history?.completed &&
    history.watchTime >= duration * threshold / 100
}

export async function requirePreviousLessons(userId: string, lessonId: string) {
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } })
  if (!lesson) throw new AccessError('Lesson not found', 404)
  const previous = await prisma.lesson.findMany({ where: { courseId: lesson.courseId, order: { lt: lesson.order } }, select: { id: true } })
  for (const entry of previous) {
    if (!await lessonCompleted(userId, entry.id)) throw new AccessError('Complete the previous lessons first')
  }
  const node = await prisma.learningNode.findFirst({ where: { courseId: lesson.courseId, refId: lesson.quizId || lessonId } })
  if (node && !await canAccessNode(userId, node.id)) throw new AccessError('Learning node prerequisites have not been met')
}

export async function requireCertificateEligibility(userId: string, courseId: string) {
  const progress = await getCourseProgress(userId, courseId)
  if (!progress.isComplete) throw new AccessError('Complete all lessons and pass all required quizzes before requesting a certificate', 409)
  return progress
}

/** Canonical LMS completion calculation used by progress, completion and certificates. */
export async function getCourseProgress(userId: string, courseId: string) {
  await requireEnrollment(userId, courseId)
  const [lessons, quizzes] = await Promise.all([
    prisma.lesson.findMany({
      where: { courseId },
      select: { id: true, title: true, lessonType: true, isFinalExam: true, module: { select: { id: true, title: true, order: true } } },
      orderBy: [{ moduleId: 'asc' }, { order: 'asc' }],
    }),
    prisma.quiz.findMany({ where: { courseId }, select: { id: true } }),
  ])
  if (!lessons.length) throw new AccessError('Course has no lessons', 409)
  const [completionFlags, submissions, histories] = await Promise.all([
    Promise.all(lessons.map(lesson => lessonCompleted(userId, lesson.id))),
    prisma.studentSubmission.findMany({ where: { userId, quizId: { in: quizzes.map(quiz => quiz.id) }, passed: true }, select: { quizId: true } }),
    prisma.watchHistory.findMany({ where: { userId, lessonId: { in: lessons.map(lesson => lesson.id) } } }),
  ])
  const passedQuizIds = new Set(submissions.map(item => item.quizId))
  const historyByLesson = new Map(histories.map(item => [item.lessonId, item]))
  const lessonProgress = lessons.map((lesson, index) => {
    const history = historyByLesson.get(lesson.id)
    const completed = completionFlags[index]
    return { ...lesson, completed, watchTime: history?.watchTime || 0, totalTime: history?.totalTime || 0,
      progressPercent: completed ? 100 : history?.totalTime ? Math.min(99, Math.round(history.watchTime / history.totalTime * 100)) : 0,
      lastWatched: history?.updatedAt || null }
  })
  const completedLessons = lessonProgress.filter(lesson => lesson.completed).length
  const finalExamPassed = lessonProgress.filter(lesson => lesson.isFinalExam).every(lesson => lesson.completed)
  const allQuizzesPassed = quizzes.every(quiz => passedQuizIds.has(quiz.id))
  const percentage = Math.round(completedLessons / lessons.length * 100)
  return { completedLessons, totalLessons: lessons.length, percentage, finalExamPassed, allQuizzesPassed,
    isComplete: completedLessons === lessons.length && finalExamPassed && allQuizzesPassed, lessons: lessonProgress }
}

export async function recordVideoProgress(userId: string, lessonId: string, reportedTime: number, rawEvidence?: VideoProgressEvidence) {
  const lesson = await requireLessonAccess(userId, lessonId)
  await requirePreviousLessons(userId, lessonId)
  if (lesson.quizId || lesson.lessonType === 'SCORM' || lesson.type === 'SCORM') throw new AccessError('Use the appropriate quiz or SCORM endpoint')
  const duration = lesson.duration || (lesson.durationMin || 0) * 60
  const threshold = lesson.requiredPct ?? lesson.requiredCompletionPercentage
  if (!Number.isFinite(reportedTime) || reportedTime < 0) throw new AccessError('Invalid watch time', 400)
  if (duration <= 0 || threshold <= 0 || threshold > 100) throw new AccessError('An administrator must configure the video duration and completion percentage', 409)
  const evidence = rawEvidence === undefined ? null : validateVideoProgressEvidence(rawEvidence)
  if (rawEvidence !== undefined && !evidence) throw new AccessError('Invalid video presence evidence', 400)
  return prisma.$transaction(async tx => {
    // Serialize updates for this learner across tabs/devices.
    await tx.$queryRaw`SELECT id FROM users WHERE id = ${userId} FOR UPDATE`
    const previous = await tx.watchHistory.findUnique({ where: { userId_lessonId: { userId, lessonId } } })
    // The first heartbeat starts the clock. Idle time cannot award a whole video.
    const serverAllowance = previous ? Math.min(30, Math.max(0, (Date.now() - previous.updatedAt.getTime()) / 1000)) : 0
    let allowance = serverAllowance
    if (evidence) {
      const lastHeartbeat = await tx.courseTrackingEvent.findFirst({
        where: { courseId: lesson.courseId, userId, event: { in: ['VIDEO_HEARTBEAT', 'VIDEO_PRESENCE_VIOLATION'] }, sessionId: evidence.sessionId },
        orderBy: { occurredAt: 'desc' },
        select: { metadata: true },
      })
      const lastMetadata = lastHeartbeat?.metadata && typeof lastHeartbeat.metadata === 'object' && !Array.isArray(lastHeartbeat.metadata)
        ? lastHeartbeat.metadata as Record<string, unknown>
        : null
      const lastSequence = typeof lastMetadata?.sequence === 'number' ? lastMetadata.sequence : 0
      if (evidence.sequence <= lastSequence) allowance = 0
      else allowance = creditedActiveSeconds(evidence, serverAllowance)
      await tx.courseTrackingEvent.create({
        data: {
          courseId: lesson.courseId,
          userId,
          event: evidence.violation ? 'VIDEO_PRESENCE_VIOLATION' : 'VIDEO_HEARTBEAT',
          sessionId: evidence.sessionId,
          source: 'secure-video-player',
          metadata: {
            lessonId,
            sequence: evidence.sequence,
            activeSeconds: evidence.activeSeconds,
            visibility: evidence.visibility,
            playbackRate: evidence.playbackRate,
            reportedTime,
            violation: evidence.violation ?? null,
          },
        },
      })
    }
    const oldTime = previous?.watchTime || 0
    const watchTime = Math.min(duration, Math.max(oldTime, Math.min(reportedTime, oldTime + allowance)))
    const completed = watchTime >= duration * threshold / 100
    const progress = await tx.watchHistory.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: { userId, lessonId, watchTime, totalTime: duration, completed },
      update: { watchTime, totalTime: duration, completed }
    })
    const node = await tx.learningNode.findFirst({ where: { courseId: lesson.courseId, refId: lessonId, nodeType: 'VIDEO' } })
    const state = { status: completed ? 'COMPLETED' : 'IN_PROGRESS', progressPercent: watchTime / duration * 100,
      timeSpent: Math.floor(watchTime), lastActivityAt: new Date(), completedAt: completed ? new Date() : null }
    if (node) await tx.nodeProgress.upsert({ where: { userId_nodeId: { userId, nodeId: node.id } },
      create: { userId, nodeId: node.id, courseId: lesson.courseId, ...state }, update: state })
    await refreshProgressSummary(tx, userId, lesson.courseId)
    return { progress, completed, progressPercentage: watchTime / duration * 100 }
  })
}
