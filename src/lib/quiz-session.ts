import { randomInt } from 'crypto'
import { Prisma } from '@prisma/client'
import prisma from '@/lib/prisma'
import { AccessError, requireLessonAccess, requireUser } from '@/lib/access-control'
import { requirePreviousLessons } from '@/lib/learning-evidence'
import { refreshProgressSummary } from '@/lib/progress-summary'

type SnapshotQuestion = {
  id: string; text: string; order: number; type: string; correctAnswer: string | null
  options: { id: string; text: string; isCorrect: boolean }[]
}

function shuffled<T>(input: T[]): T[] {
  const result = [...input]
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(i + 1)
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

async function checkQuizAccess(userId: string, quizId: string, lessonId: string) {
  const lesson = await requireLessonAccess(userId, lessonId)
  if (lesson.quizId !== quizId) throw new AccessError('Quiz does not belong to this lesson', 400)
  await requirePreviousLessons(userId, lessonId)
  const quiz = await prisma.quiz.findUnique({ where: { id: quizId } })
  if (!quiz || (quiz.courseId && quiz.courseId !== lesson.courseId)) throw new AccessError('Quiz not found', 404)
  if (quiz.prerequisiteQuizId && !await prisma.studentSubmission.findFirst({
    where: { userId, quizId: quiz.prerequisiteQuizId, passed: true }
  })) throw new AccessError('Pass the prerequisite quiz first')
  return { quiz, lesson }
}

async function checkCooldown(tx: Prisma.TransactionClient, userId: string, quizId: string, minutes: number) {
  const previous = await tx.studentSubmission.findFirst({ where: { userId, quizId }, orderBy: { createdAt: 'desc' } })
  if (previous && !previous.passed && Date.now() < previous.createdAt.getTime() + minutes * 60000) {
    throw new AccessError('Wait for the quiz retry cooldown', 429)
  }
}

export async function startQuizSession(quizId: string, requestedLessonId?: string) {
  const user = await requireUser()
  const lessonId = requestedLessonId || (await prisma.lesson.findFirst({
    where: { quizId, course: { enrollments: { some: { userId: user.id } } } }, select: { id: true }
  }))?.id
  if (!lessonId) throw new AccessError('An enrolled quiz lesson is required')
  const { quiz, lesson } = await checkQuizAccess(user.id, quizId, lessonId)
  const attempt = await prisma.$transaction(async tx => {
    await tx.$queryRaw`SELECT id FROM users WHERE id = ${user.id} FOR UPDATE`
    await checkCooldown(tx, user.id, quizId, quiz.retryDelayMinutes || 0)
    const existing = await tx.quizSession.findFirst({ where: {
      userId: user.id, quizId, lessonId, submittedAt: null, expiresAt: { gt: new Date() }
    }, orderBy: { startedAt: 'desc' } })
    if (existing) return existing
    let questions: SnapshotQuestion[] = await tx.question.findMany({ where: { quizId }, orderBy: { order: 'asc' },
      select: { id: true, text: true, order: true, type: true, correctAnswer: true,
        options: { select: { id: true, text: true, isCorrect: true } } }
    })
    if (!questions.length) throw new AccessError('Quiz has no questions', 409)
    if (quiz.randomize) questions = shuffled(questions)
    const count = quiz.questionsToShow ?? questions.length
    if (count < 1 || count > questions.length) throw new AccessError('Invalid quiz question count', 409)
    questions = questions.slice(0, count)
    if (questions.some(q => !q.options.some(o => o.isCorrect))) throw new AccessError('Quiz contains questions that require administrator review', 409)
    if (quiz.shuffleOptions) questions = questions.map(q => ({ ...q, options: shuffled(q.options) }))
    return tx.quizSession.create({ data: {
      userId: user.id, quizId, lessonId, questions: questions as unknown as Prisma.InputJsonValue,
      passScore: quiz.passScore, expiresAt: new Date(Date.now() + (quiz.timeLimit && quiz.timeLimit > 0 ? quiz.timeLimit : 1440) * 60000)
    } })
  })
  return {
    success: true as const, attemptId: attempt.id, courseId: lesson.courseId,
    expiresAt: attempt.expiresAt.toISOString(), quiz,
    questions: (attempt.questions as unknown as SnapshotQuestion[]).map(q => ({
      id: q.id, text: q.text, order: q.order, options: q.options.map(o => ({ id: o.id, text: o.text }))
    }))
  }
}

export async function submitQuizSession(quizId: string, lessonId: string, answers: unknown, attemptId?: string) {
  const user = await requireUser()
  if (!attemptId || !answers || typeof answers !== 'object' || Array.isArray(answers)) throw new AccessError('Reload the quiz to start a valid attempt', 400)
  const { quiz, lesson } = await checkQuizAccess(user.id, quizId, lessonId)
  const input = answers as Record<string, unknown>
  return prisma.$transaction(async tx => {
    await tx.$queryRaw`SELECT id FROM users WHERE id = ${user.id} FOR UPDATE`
    const attempt = await tx.quizSession.findUnique({ where: { id: attemptId } })
    if (!attempt || attempt.userId !== user.id || attempt.quizId !== quizId || attempt.lessonId !== lessonId) throw new AccessError('Invalid quiz attempt')
    if (attempt.submittedAt) return attempt.result as unknown as QuizResult
    await checkCooldown(tx, user.id, quizId, quiz.retryDelayMinutes || 0)
    if (attempt.expiresAt.getTime() < Date.now()) throw new AccessError('Quiz attempt expired; start again', 409)
    const questions = attempt.questions as unknown as SnapshotQuestion[]
    if (Object.keys(input).some(id => !questions.some(q => q.id === id))) throw new AccessError('Answer does not belong to this attempt', 400)
    const questionResults = questions.map((q, index) => {
      const answer = input[q.id]
      if (answer !== undefined && (typeof answer !== 'string' || !q.options.some(o => o.id === answer))) throw new AccessError('Invalid answer option', 400)
      const selected = q.options.find(o => o.id === answer)
      const correct = q.options.find(o => o.isCorrect)!
      return { questionId: q.id, questionNumber: index + 1, questionText: q.text,
        userAnswer: selected?.text || null, userAnswerText: selected?.text || null,
        correctAnswer: correct.text, correctAnswerText: correct.text, isCorrect: selected?.isCorrect === true }
    })
    const correctAnswers = questionResults.filter(q => q.isCorrect).length
    const percentage = Math.round(correctAnswers / questions.length * 100)
    const passed = percentage >= attempt.passScore
    const result: QuizResult = { success: true, score: percentage, percentage, passed, correctAnswers,
      totalQuestions: questions.length, passScore: attempt.passScore, questionResults, certificate: null,
      analysis: { scoreDisplay: `${correctAnswers}/${questions.length}`, percentageDisplay: `${percentage}%`,
        status: passed ? 'PASSED' : 'FAILED', minimumRequired: `${attempt.passScore}%` } }
    await tx.studentSubmission.create({ data: { userId: user.id, quizId, score: percentage, passed,
      answers: JSON.stringify({ attemptId, userAnswers: input, questionResults, summary: result }) } })
    const node = await tx.learningNode.findFirst({ where: { courseId: lesson.courseId, nodeType: 'QUIZ', refId: quizId } })
    await tx.quizAttemptRecord.create({ data: { userId: user.id, quizId, nodeId: node?.id,
      attemptNumber: await tx.quizAttemptRecord.count({ where: { userId: user.id, quizId } }) + 1,
      score: percentage, passed, answers: input as Prisma.InputJsonValue, startedAt: attempt.startedAt,
      timeSpent: Math.max(0, Math.floor((Date.now() - attempt.startedAt.getTime()) / 1000)), idempotencyKey: `quiz-session:${attemptId}` } })
    if (passed) {
      await tx.watchHistory.upsert({ where: { userId_lessonId: { userId: user.id, lessonId } },
        create: { userId: user.id, lessonId, completed: true }, update: { completed: true } })
      if (node) await tx.nodeProgress.upsert({ where: { userId_nodeId: { userId: user.id, nodeId: node.id } },
        create: { userId: user.id, nodeId: node.id, courseId: lesson.courseId, status: 'COMPLETED', progressPercent: 100, score: percentage, completedAt: new Date() },
        update: { status: 'COMPLETED', progressPercent: 100, score: percentage, completedAt: new Date() } })
    }
    await refreshProgressSummary(tx, user.id, lesson.courseId)
    await tx.quizSession.update({ where: { id: attemptId }, data: { submittedAt: new Date(), result: result as unknown as Prisma.InputJsonValue } })
    return result
  })
}

interface QuizResult {
  success: true; score: number; percentage: number; passed: boolean; correctAnswers: number
  totalQuestions: number; passScore: number; certificate: null
  questionResults: { questionId: string; questionNumber: number; questionText: string; userAnswer: string | null;
    userAnswerText: string | null; correctAnswer: string; correctAnswerText: string; isCorrect: boolean }[]
  analysis: { scoreDisplay: string; percentageDisplay: string; status: string; minimumRequired: string }
}
