jest.mock('@/lib/prisma', () => ({ __esModule: true, default: {
  lesson: { findMany: jest.fn(), findUnique: jest.fn() },
  quiz: { findMany: jest.fn() },
  studentSubmission: { findMany: jest.fn(), findFirst: jest.fn() },
  watchHistory: { findMany: jest.fn(), findUnique: jest.fn() },
  scormProgress: { findUnique: jest.fn() },
  scormRuntimeData: { findUnique: jest.fn() },
} }))
jest.mock('@/lib/access-control', () => ({
  AccessError: class AccessError extends Error { constructor(message: string, public status = 403) { super(message) } },
  requireEnrollment: jest.fn().mockResolvedValue(undefined),
  requireLessonAccess: jest.fn(),
}))
jest.mock('@/lib/learning-flow-engine', () => ({ canAccessNode: jest.fn() }))
jest.mock('@/lib/progress-summary', () => ({ refreshProgressSummary: jest.fn() }))

import { getCourseProgress, requireCertificateEligibility } from '@/lib/learning-evidence'
import prisma from '@/lib/prisma'

const prismaMock = prisma as unknown as {
  lesson: { findMany: jest.Mock; findUnique: jest.Mock }
  quiz: { findMany: jest.Mock }
  studentSubmission: { findMany: jest.Mock; findFirst: jest.Mock }
  watchHistory: { findMany: jest.Mock; findUnique: jest.Mock }
  scormProgress: { findUnique: jest.Mock }
  scormRuntimeData: { findUnique: jest.Mock }
}

describe('central LMS completion rules', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    prismaMock.lesson.findMany.mockResolvedValue([
      { id: 'lesson-1', title: 'One', lessonType: 'VIDEO', isFinalExam: false, module: { id: 'm1', title: 'Module', order: 1 } },
      { id: 'lesson-2', title: 'Final', lessonType: 'VIDEO', isFinalExam: true, module: { id: 'm1', title: 'Module', order: 1 } },
    ])
    prismaMock.lesson.findUnique.mockImplementation(({ where }: { where: { id: string } }) => Promise.resolve({
      id: where.id, courseId: 'course-1', duration: 100, durationMin: 0, requiredPct: 80,
      requiredCompletionPercentage: 80, quizId: null, lessonType: 'VIDEO', type: 'VIDEO', scormPackage: null,
    }))
    prismaMock.quiz.findMany.mockResolvedValue([{ id: 'course-quiz' }])
    prismaMock.studentSubmission.findMany.mockResolvedValue([{ quizId: 'course-quiz' }])
    prismaMock.watchHistory.findUnique.mockResolvedValue({ completed: true, watchTime: 90, totalTime: 100, updatedAt: new Date() })
    prismaMock.watchHistory.findMany.mockResolvedValue([
      { lessonId: 'lesson-1', completed: true, watchTime: 90, totalTime: 100, updatedAt: new Date() },
      { lessonId: 'lesson-2', completed: true, watchTime: 100, totalTime: 100, updatedAt: new Date() },
    ])
  })

  it('requires lessons, final exam and every course quiz', async () => {
    await expect(getCourseProgress('user-1', 'course-1')).resolves.toMatchObject({
      completedLessons: 2, totalLessons: 2, percentage: 100, finalExamPassed: true,
      allQuizzesPassed: true, isComplete: true,
    })
  })

  it('blocks a certificate when a required course quiz is not passed', async () => {
    prismaMock.studentSubmission.findMany.mockResolvedValue([])
    await expect(requireCertificateEligibility('user-1', 'course-1')).rejects.toMatchObject({ status: 409 })
  })
})
