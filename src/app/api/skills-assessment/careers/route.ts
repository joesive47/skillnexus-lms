import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    console.log('API: Fetching careers from database...')
    
    const careers = await prisma.career.findMany({
      include: {
        assessmentQuestions: {
          include: {
            skill: true
          }
        }
      }
    })

    console.log('API: Found careers:', careers.length)

    const result = careers.map(career => ({
      id: career.id,
      title: career.title,
      description: career.description,
      category: career.category,
      questionCount: career.assessmentQuestions?.length || 0,
      skillCount: career.assessmentQuestions ? new Set(career.assessmentQuestions.map(q => q.skill?.name).filter(Boolean)).size : 0,
      estimatedTime: Math.ceil((career.assessmentQuestions?.length || 0) * 2),
      difficulty: (career.assessmentQuestions?.length || 0) < 15 ? 'Beginner' : 
                 (career.assessmentQuestions?.length || 0) <= 20 ? 'Intermediate' : 'Advanced'
    }))

    console.log('API: Returning result:', result)
    return NextResponse.json(result)
  } catch (error) {
    console.error('API: Get careers error:', error)
    return NextResponse.json({ error: 'Failed to fetch careers' }, { status: 500 })
  }
}
