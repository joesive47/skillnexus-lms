/** @jest-environment node */
import { prisma } from '@/lib/prisma'
import { GET, POST } from './route'

jest.mock('@/lib/prisma', () => ({
  prisma: { career: { findUnique: jest.fn() } }
}))

const findCareer = prisma.career.findUnique as jest.Mock
const career = {
  id: 'career-1',
  title: 'Security',
  description: null,
  category: 'technology',
  assessmentQuestions: [{
    id: 'question-1', questionText: 'Safe answer?', option1: 'A', option2: 'B', option3: 'C', option4: 'D',
    correctAnswer: '2', score: 2, skill: { name: 'Security' }
  }]
}

beforeEach(() => {
  jest.clearAllMocks()
  findCareer.mockResolvedValue(career)
})

it('never exposes correct answers in the assessment payload', async () => {
  const response = await GET(new Request('http://localhost/api/skills-assessment/career-1'), {
    params: Promise.resolve({ assessmentId: 'career-1' })
  })
  const body = await response.json()

  expect(response.status).toBe(200)
  expect(body.questions[0]).not.toHaveProperty('correctAnswer')
})

it('grades answers on the server and returns feedback only after submission', async () => {
  const response = await POST(new Request('http://localhost/api/skills-assessment/career-1', {
    method: 'POST', body: JSON.stringify({ answers: { 'question-1': 1 } })
  }), { params: Promise.resolve({ assessmentId: 'career-1' }) })
  const body = await response.json()

  expect(response.status).toBe(200)
  expect(body).toMatchObject({ score: 100, correctAnswers: 1, passed: true })
  expect(body.detailedResults[0]).toMatchObject({ correctAnswer: 1, isCorrect: true })
})

it('rejects question identifiers outside the selected assessment', async () => {
  const response = await POST(new Request('http://localhost/api/skills-assessment/career-1', {
    method: 'POST', body: JSON.stringify({ answers: { foreign: 0 } })
  }), { params: Promise.resolve({ assessmentId: 'career-1' }) })

  expect(response.status).toBe(400)
})
