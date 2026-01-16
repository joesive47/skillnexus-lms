import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { assessmentId: string } }
) {
  try {
    const career = await prisma.career.findUnique({
      where: { id: params.assessmentId },
      include: {
        assessmentQuestions: {
          include: {
            skill: true
          }
        }
      }
    })

    if (!career || career.assessmentQuestions.length === 0) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
    }

    const questions = career.assessmentQuestions.map(q => ({
      id: q.id,
      text: q.questionText,
      options: [q.option1, q.option2, q.option3, q.option4],
      correctAnswer: parseInt(q.correctAnswer) - 1, // Convert "1","2","3","4" to 0,1,2,3
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