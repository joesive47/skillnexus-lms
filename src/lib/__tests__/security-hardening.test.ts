/** @jest-environment node */
// Regression cases for the actual service functions; database concurrency is a separate integration test.
import prisma from '@/lib/prisma'
import { submitQuizSession } from '@/lib/quiz-session'
import { completePayment, purchaseCourse } from '@/lib/payment-processing'

jest.mock('@/lib/prisma', () => ({ __esModule: true, default: {
  $transaction: jest.fn(), quiz: { findUnique: jest.fn() }
} }))
jest.mock('@/lib/access-control', () => {
  class AccessError extends Error { constructor(message: string, public status = 403) { super(message) } }
  return { AccessError, requireUser: jest.fn(async () => ({ id: 'learner', role: 'STUDENT' })),
    requireLessonAccess: jest.fn(async () => ({ id: 'lesson', courseId: 'course', quizId: 'quiz' })) }
})
jest.mock('@/lib/learning-evidence', () => ({ requirePreviousLessons: jest.fn(async () => undefined) }))
jest.mock('@/lib/progress-summary', () => ({ refreshProgressSummary: jest.fn(async () => undefined) }))

function quizFixture(owner = 'learner') {
  const attempt = {
    id: 'attempt', userId: owner, quizId: 'quiz', lessonId: 'lesson', passScore: 70,
    startedAt: new Date(), expiresAt: new Date(Date.now() + 60000), submittedAt: null, result: null,
    questions: ['a', 'b'].map(id => ({ id, text: id, order: 0, type: 'MULTIPLE_CHOICE', correctAnswer: null,
      options: [{ id: id + '-right', text: 'Right', isCorrect: true }, { id: id + '-wrong', text: 'Wrong', isCorrect: false }] }))
  }
  const tx = { $queryRaw: jest.fn(async () => []),
    quizSession: { findUnique: jest.fn(async () => attempt), update: jest.fn(async () => ({})) },
    studentSubmission: { findFirst: jest.fn(async () => null), create: jest.fn(async () => ({})) },
    learningNode: { findFirst: jest.fn(async () => null) },
    quizAttemptRecord: { count: jest.fn(async () => 0), create: jest.fn(async () => ({})) },
    watchHistory: { upsert: jest.fn(async () => ({})) }
  }
  ;(prisma.$transaction as jest.Mock).mockImplementation(async callback => callback(tx))
  ;(prisma.quiz.findUnique as jest.Mock).mockResolvedValue({ id: 'quiz', courseId: 'course', retryDelayMinutes: 0 })
  return { tx, attempt }
}

beforeEach(() => jest.clearAllMocks())

it('does not award full marks when the learner submits only the known correct question', async () => {
  const { tx } = quizFixture()
  const result = await submitQuizSession('quiz', 'lesson', { a: 'a-right' }, 'attempt')
  expect(result.percentage).toBe(50)
  expect(result.totalQuestions).toBe(2)
  expect(result.passed).toBe(false)
  expect(tx.watchHistory.upsert).not.toHaveBeenCalled()
})

it('rejects an attempt owned by a different learner without recording a result', async () => {
  const { tx } = quizFixture('someone-else')
  await expect(submitQuizSession('quiz', 'lesson', { a: 'a-right' }, 'attempt')).rejects.toThrow('Invalid quiz attempt')
  expect(tx.studentSubmission.create).not.toHaveBeenCalled()
})

it('rejects answers from a question outside the server-issued snapshot', async () => {
  const { tx } = quizFixture()
  await expect(submitQuizSession('quiz', 'lesson', { foreign: 'a-right' }, 'attempt')).rejects.toThrow('Answer does not belong')
  expect(tx.studentSubmission.create).not.toHaveBeenCalled()
})

it('does not report success when persisting the quiz result fails', async () => {
  const { tx } = quizFixture()
  tx.studentSubmission.create.mockRejectedValueOnce(new Error('Database unavailable'))
  await expect(submitQuizSession('quiz', 'lesson', { a: 'a-right', b: 'b-right' }, 'attempt')).rejects.toThrow('Database unavailable')
  expect(tx.watchHistory.upsert).not.toHaveBeenCalled()
})

it('does not award payment credits a second time for an already completed payment', async () => {
  const tx = { payment: { findUniqueOrThrow: jest.fn(async () => ({ id: 'payment', status: 'COMPLETED' })), updateMany: jest.fn() },
    user: { update: jest.fn() }, enrollment: { upsert: jest.fn() } }
  await completePayment(tx as never, 'payment')
  expect(tx.user.update).not.toHaveBeenCalled()
  expect(tx.enrollment.upsert).not.toHaveBeenCalled()
})

it('does not enroll a learner after an atomic credit debit was rejected', async () => {
  const tx = { $queryRaw: jest.fn(async () => []), course: { findUnique: jest.fn(async () => ({ id: 'course', published: true, price: 200 })) },
    enrollment: { findUnique: jest.fn(async () => null), create: jest.fn() }, user: { updateMany: jest.fn(async () => ({ count: 0 })) } }
  ;(prisma.$transaction as jest.Mock).mockImplementation(async callback => callback(tx))
  await expect(purchaseCourse('course')).rejects.toThrow('Insufficient credits')
  expect(tx.enrollment.create).not.toHaveBeenCalled()
})
