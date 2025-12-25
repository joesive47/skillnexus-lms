import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const careers = await prisma.career.findMany({
      include: {
        assessmentQuestions: {
          include: {
            skill: true
          }
        }
      }
    })

    const result = careers.map(career => ({
      ...career,
      questionCount: career.assessmentQuestions?.length || 0,
      skillCount: career.assessmentQuestions ? new Set(career.assessmentQuestions.map(q => q.skill?.name).filter(Boolean)).size : 0,
      estimatedTime: Math.ceil((career.assessmentQuestions?.length || 0) * 2),
      difficulty: (career.assessmentQuestions?.length || 0) < 15 ? 'Beginner' : 
                 (career.assessmentQuestions?.length || 0) <= 20 ? 'Intermediate' : 'Advanced'
    }))

    return NextResponse.json(result)
  } catch (error) {
    console.error('Get careers error:', error)
    return NextResponse.json([], { status: 500 })
  }
}
