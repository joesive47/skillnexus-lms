import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { careerId: string } }
) {
  try {
    const { careerId } = params

    const questions = await prisma.assessmentQuestion.findMany({
      where: {
        careerId: careerId
      },
      include: {
        skill: true
      },
      orderBy: {
        questionId: 'asc'
      }
    })

    const formattedQuestions = questions.map(q => ({
      id: q.questionId,
      questionText: q.questionText,
      option1: q.option1,
      option2: q.option2,
      option3: q.option3,
      option4: q.option4,
      correctAnswer: q.correctAnswer,
      skillName: q.skill.name,
      skillCategory: q.skillCategory || 'General',
      difficultyLevel: q.difficultyLevel || 'Intermediate',
      score: q.score
    }))

    return NextResponse.json(formattedQuestions)
  } catch (error) {
    console.error('API: Get questions error:', error)
    return NextResponse.json([], { status: 200 })
  }
}
