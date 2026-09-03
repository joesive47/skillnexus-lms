import { Prisma } from '@prisma/client'
import prisma from '@/lib/prisma'
import { AccessError, requireLessonAccess } from '@/lib/access-control'
import { requirePreviousLessons } from '@/lib/learning-evidence'
import { refreshProgressSummary } from '@/lib/progress-summary'

export async function saveScormProgress(userId: string, lessonId: string, input: unknown, courseId?: string) {
  const lesson = await requireLessonAccess(userId, lessonId, courseId)
  await requirePreviousLessons(userId, lessonId)
  if (lesson.lessonType !== 'SCORM' && lesson.type !== 'SCORM') throw new AccessError('Not a SCORM lesson', 400)
  if (!input || typeof input !== 'object' || Array.isArray(input) || JSON.stringify(input).length > 1000000) throw new AccessError('Invalid CMI data', 400)
  const cmi = input as Record<string, unknown>
  const text = (key: string, fallback = '') => {
    const value = cmi[key] ?? fallback
    if (typeof value !== 'string') throw new AccessError('Invalid CMI field', 400)
    return value
  }
  const number = (key: string) => {
    if (cmi[key] === undefined || cmi[key] === '') return null
    if (!['string', 'number'].includes(typeof cmi[key])) throw new AccessError('Invalid SCORM score', 400)
    const value = Number(cmi[key])
    if (!Number.isFinite(value)) throw new AccessError('Invalid SCORM score', 400)
    return value
  }
  const legacy = text('cmi.core.lesson_status')
  const reportedCompletion = text('cmi.completion_status', legacy || 'incomplete')
  const completionStatus = reportedCompletion === 'passed' ? 'completed' : reportedCompletion === 'failed' ? 'incomplete' : reportedCompletion
  const successStatus = text('cmi.success_status', legacy === 'passed' ? 'passed' : legacy === 'failed' ? 'failed' : 'unknown')
  if (!['completed', 'incomplete', 'not attempted', 'unknown', 'passed', 'failed', 'browsed'].includes(completionStatus) ||
      !['passed', 'failed', 'unknown'].includes(successStatus)) throw new AccessError('Invalid SCORM status', 400)
  const completed = ['completed', 'passed'].includes(completionStatus) && successStatus !== 'failed'
  const data = { completionStatus, successStatus, scoreRaw: number('cmi.score.raw'), scoreMin: number('cmi.score.min'), scoreMax: number('cmi.score.max'),
    totalTime: text('cmi.total_time', text('cmi.core.total_time')) || null,
    sessionTime: text('cmi.session_time', text('cmi.core.session_time')) || null,
    suspendData: text('cmi.suspend_data') || null }
  if (data.scoreRaw !== null && ((data.scoreMin !== null && data.scoreRaw < data.scoreMin) || (data.scoreMax !== null && data.scoreRaw > data.scoreMax))) throw new AccessError('SCORM score is out of range', 400)
  return prisma.$transaction(async tx => {
    await tx.$queryRaw`SELECT id FROM users WHERE id = ${userId} FOR UPDATE`
    const pkg = await tx.scormPackage.findUnique({ where: { lessonId } })
    if (!pkg) throw new AccessError('SCORM package not found', 404)
    const progress = await tx.scormProgress.upsert({ where: { userId_packageId: { userId, packageId: pkg.id } },
      create: { userId, packageId: pkg.id, ...data, cmiData: JSON.stringify(cmi) }, update: { ...data, cmiData: JSON.stringify(cmi) } })
    await tx.scormRuntimeData.upsert({ where: { userId_lessonId: { userId, lessonId } },
      create: { userId, lessonId, ...data, cmiData: cmi as Prisma.InputJsonValue },
      update: { ...data, cmiData: cmi as Prisma.InputJsonValue, lastCommit: new Date() } })
    await tx.watchHistory.upsert({ where: { userId_lessonId: { userId, lessonId } },
      create: { userId, lessonId, completed }, update: { completed } })
    const node = await tx.learningNode.findFirst({ where: { courseId: lesson.courseId, refId: lessonId, nodeType: 'SCORM' } })
    const state = { status: completed ? 'COMPLETED' : 'IN_PROGRESS', progressPercent: completed ? 100 : 0, completedAt: completed ? new Date() : null }
    if (node) await tx.nodeProgress.upsert({ where: { userId_nodeId: { userId, nodeId: node.id } },
      create: { userId, nodeId: node.id, courseId: lesson.courseId, ...state }, update: state })
    await refreshProgressSummary(tx, userId, lesson.courseId)
    return { progress, completed, status: state.status }
  })
}
