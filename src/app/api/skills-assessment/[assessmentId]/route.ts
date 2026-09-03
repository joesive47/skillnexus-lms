import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function loadAssessment(assessmentId: string) {
  return prisma.career.findUnique({
    where: { id: assessmentId },
    include: { assessmentQuestions: { include: { skill: true } } }
  })
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ assessmentId: string }> }
) {
  try {
    const { assessmentId } = await params
    const career = await loadAssessment(assessmentId)

    if (!career || career.assessmentQuestions.length === 0) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
    }

    const questions = career.assessmentQuestions.map(q => ({
      id: q.id,
      text: q.questionText,
      options: [q.option1, q.option2, q.option3, q.option4],
      skill: q.skill.name,
      difficulty: 'beginner',
      weight: 1
    }))

    const assessment = {
      id: career.id,
      title: career.title,
      description: career.description || `ประเมินทักษะด้าน ${career.title}`,
      category: career.category || 'general',
      questions: questions,
      timeLimit: Math.ceil(questions.length * 1.5), // 1.5 minutes per question
      passingScore: 70,
      enabled: true,
      recommendedCourses: [
        `${career.title} Fundamentals`,
        `Advanced ${career.title}`,
        `${career.title} Best Practices`
      ]
    }

    return NextResponse.json(assessment)
  } catch (error) {
    console.error('Get assessment by ID error:', error)
    return NextResponse.json({ error: 'Failed to fetch assessment' }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ assessmentId: string }> }
) {
  try {
    const { assessmentId } = await params
    const body: unknown = await request.json()
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
    }
    const submitted = (body as { answers?: unknown }).answers
    if (!submitted || typeof submitted !== 'object' || Array.isArray(submitted)) {
      return NextResponse.json({ error: 'Answers are required' }, { status: 400 })
    }

    const career = await loadAssessment(assessmentId)
    if (!career || career.assessmentQuestions.length === 0) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
    }

    const answers = submitted as Record<string, unknown>
    const questionIds = new Set(career.assessmentQuestions.map(question => question.id))
    if (Object.keys(answers).some(id => !questionIds.has(id))) {
      return NextResponse.json({ error: 'Unknown assessment question' }, { status: 400 })
    }

    let correctAnswers = 0
    let earnedScore = 0
    let totalScore = 0
    const skillTotals: Record<string, { earned: number; total: number }> = {}
    const detailedResults: Array<Record<string, unknown>> = []

    career.assessmentQuestions.forEach((question, index) => {
      const selected = answers[question.id]
      if (selected !== undefined && (!Number.isInteger(selected) || Number(selected) < 0 || Number(selected) > 3)) {
        throw new Error('INVALID_ANSWER')
      }
      const selectedIndex = selected === undefined ? -1 : Number(selected)
      const correctIndex = Number.parseInt(question.correctAnswer, 10) - 1
      const weight = question.score || 1
      const isCorrect = selectedIndex === correctIndex
      const options = [question.option1, question.option2, question.option3, question.option4]
      totalScore += weight
      if (!skillTotals[question.skill.name]) skillTotals[question.skill.name] = { earned: 0, total: 0 }
      skillTotals[question.skill.name].total += weight
      if (isCorrect) {
        correctAnswers += 1
        earnedScore += weight
        skillTotals[question.skill.name].earned += weight
      }
      detailedResults.push({
        questionIndex: index + 1,
        questionId: question.id,
        questionText: question.questionText,
        userAnswer: selectedIndex,
        userAnswerText: selectedIndex >= 0 ? options[selectedIndex] : 'ไม่ได้ตอบ',
        correctAnswer: correctIndex,
        correctAnswerText: options[correctIndex],
        isCorrect,
        skill: question.skill.name,
        weight
      })
    })

    const score = totalScore > 0 ? Math.round((earnedScore / totalScore) * 100) : 0
    const skillBreakdown = Object.fromEntries(
      Object.entries(skillTotals).map(([skill, value]) => [
        skill,
        value.total > 0 ? Math.round((value.earned / value.total) * 100) : 0
      ])
    )

    return NextResponse.json({
      score,
      totalScore,
      earnedScore,
      correctAnswers,
      totalQuestions: career.assessmentQuestions.length,
      skillBreakdown,
      detailedResults,
      wrongQuestions: detailedResults.filter(item => !item.isCorrect),
      passed: score >= 70,
      recommendedCourses: score < 80
        ? [`${career.title} Fundamentals`, `Advanced ${career.title}`, `${career.title} Best Practices`]
        : []
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'INVALID_ANSWER') {
      return NextResponse.json({ error: 'Invalid answer value' }, { status: 400 })
    }
    console.error('Grade assessment error:', error)
    return NextResponse.json({ error: 'Failed to grade assessment' }, { status: 500 })
  }
}
