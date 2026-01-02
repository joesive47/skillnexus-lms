import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect()
    
    // Count records
    const careerCount = await prisma.career.count()
    const questionCount = await prisma.assessmentQuestion.count()
    const skillCount = await prisma.careerSkill.count()
    
    // Get sample data
    const careers = await prisma.career.findMany({
      include: {
        assessmentQuestions: {
          include: {
            skill: true
          }
        }
      },
      take: 3
    })
    
    return NextResponse.json({
      success: true,
      counts: {
        careers: careerCount,
        questions: questionCount,
        skills: skillCount
      },
      sampleCareers: careers.map(career => ({
        id: career.id,
        title: career.title,
        questionCount: career.assessmentQuestions.length,
        skills: [...new Set(career.assessmentQuestions.map(q => q.skill.name))]
      }))
    })
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  } finally {
    await prisma.$disconnect()
  }
}