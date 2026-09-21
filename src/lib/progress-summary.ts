import type { Prisma } from '@prisma/client'

export async function refreshProgressSummary(tx: Prisma.TransactionClient, userId: string, courseId: string) {
  const lessons = await tx.lesson.findMany({
    where: { courseId },
    select: {
      id: true, quizId: true, lessonType: true, type: true, isFinalExam: true,
      duration: true, durationMin: true, scormPackage: { select: { id: true } },
    },
  })
  if (!lessons.length) return

  const lessonIds = lessons.map(lesson => lesson.id)
  const quizIds = lessons.flatMap(lesson => lesson.quizId ? [lesson.quizId] : [])
  const packageIds = lessons.flatMap(lesson => lesson.scormPackage ? [lesson.scormPackage.id] : [])
  const [histories, passedSubmissions, runtimeData, scormProgress, previousSummary] = await Promise.all([
    tx.watchHistory.findMany({ where: { userId, lessonId: { in: lessonIds } } }),
    quizIds.length
      ? tx.studentSubmission.findMany({ where: { userId, quizId: { in: quizIds }, passed: true }, select: { quizId: true } })
      : Promise.resolve([]),
    tx.scormRuntimeData.findMany({ where: { userId, lessonId: { in: lessonIds } }, select: { lessonId: true, completionStatus: true, successStatus: true } }),
    packageIds.length
      ? tx.scormProgress.findMany({ where: { userId, packageId: { in: packageIds } }, select: { packageId: true, completionStatus: true, successStatus: true } })
      : Promise.resolve([]),
    tx.courseProgressSummary.findUnique({ where: { userId_courseId: { userId, courseId } }, select: { completedAt: true } }),
  ])

  const historyByLesson = new Map(histories.map(history => [history.lessonId, history]))
  const passedQuizIds = new Set(passedSubmissions.map(submission => submission.quizId))
  const runtimeByLesson = new Map(runtimeData.map(runtime => [runtime.lessonId, runtime]))
  const scormByPackage = new Map(scormProgress.map(progress => [progress.packageId, progress]))
  const isCompletedScorm = (record: { completionStatus: string | null, successStatus: string | null } | undefined) =>
    !!record && ['completed', 'passed'].includes(record.completionStatus || '') && record.successStatus !== 'failed'

  const lessonProgress = lessons.map(lesson => {
    const history = historyByLesson.get(lesson.id)
    const isScorm = !!lesson.scormPackage || lesson.lessonType === 'SCORM' || lesson.type === 'SCORM'
    const completed = lesson.quizId
      ? passedQuizIds.has(lesson.quizId)
      : isScorm
        ? isCompletedScorm(runtimeByLesson.get(lesson.id)) || isCompletedScorm(lesson.scormPackage ? scormByPackage.get(lesson.scormPackage.id) : undefined)
        : history?.completed === true
    const totalTime = history?.totalTime || lesson.duration || (lesson.durationMin || 0) * 60
    const progressPercent = completed
      ? 100
      : totalTime > 0
        ? Math.min(99, history?.watchTime ? history.watchTime / totalTime * 100 : 0)
        : 0
    return { completed, progressPercent, isFinalExam: lesson.isFinalExam }
  })

  const completedNodes = lessonProgress.filter(lesson => lesson.completed).length
  const finalExams = lessonProgress.filter(lesson => lesson.isFinalExam)
  const isComplete = completedNodes === lessons.length
  const data = {
    totalNodes: lessons.length,
    completedNodes,
    progressPercent: lessonProgress.reduce((total, lesson) => total + lesson.progressPercent, 0) / lessons.length,
    canTakeFinalExam: lessonProgress.filter(lesson => !lesson.isFinalExam).every(lesson => lesson.completed),
    finalExamPassed: finalExams.length > 0 && finalExams.every(lesson => lesson.completed),
    lastActivity: new Date(),
    completedAt: isComplete ? previousSummary?.completedAt || new Date() : null,
  }
  await tx.courseProgressSummary.upsert({ where: { userId_courseId: { userId, courseId } },
    create: { userId, courseId, ...data }, update: data })
}
