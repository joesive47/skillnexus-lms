import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

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

    const result = careers
      .filter(career => career.assessmentQuestions.length > 0)
      .map(career => {
        const questions = career.assessmentQuestions
        const skills = new Set(questions.map(q => q.skill.name))
        const avgTime = Math.ceil(questions.length * 1.5) // 1.5 minutes per question
        
        return {
          id: career.id,
          title: career.title,
          description: career.description || `ประเมินทักษะด้าน ${career.title}`,
          category: career.category || 'general',
          questionCount: questions.length,
          skillCount: skills.size,
          estimatedTime: avgTime,
          difficulty: questions.length > 30 ? 'Advanced' : 
                     questions.length > 15 ? 'Intermediate' : 'Beginner'
        }
      })

    return NextResponse.json(result)
  } catch (error) {
    console.error('API: Get assessments error:', error)
    return NextResponse.json([], { status: 200 })
  }
}