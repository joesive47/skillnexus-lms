import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    console.log('API: Fetching careers from database...')
    
    // Import Prisma dynamically to handle connection errors gracefully
    let prisma
    try {
      const { default: prismaClient } = await import('@/lib/prisma')
      prisma = prismaClient
    } catch (error) {
      console.error('Failed to import Prisma:', error)
      return NextResponse.json([], { status: 200 }) // Return empty array instead of error
    }

    let careers = []
    try {
      careers = await prisma.career.findMany({
        include: {
          assessmentQuestions: {
            include: {
              skill: true
            }
          }
        }
      })
    } catch (dbError) {
      console.error('Database connection error:', dbError)
      // Return sample data including the imported Prompt Engineering career
      return NextResponse.json([
        {
          id: 'prompt-engineering-001',
          title: 'Prompt Engineering',
          description: 'ทักษะการเขียน Prompt สำหรับ AI และการใช้งาน AI อย่างมีประสิทธิภาพ',
          category: 'AI & Technology',
          questionCount: 15,
          skillCount: 6,
          estimatedTime: 30,
          difficulty: 'Intermediate'
        },
        {
          id: 'digital-marketing-001',
          title: 'Digital Marketing Specialist',
          description: 'ทักษะการตลาดดิจิทัลและการวิเคราะห์ข้อมูล',
          category: 'Digital Marketing',
          questionCount: 20,
          skillCount: 8,
          estimatedTime: 40,
          difficulty: 'Intermediate'
        },
        {
          id: 'fullstack-dev-001', 
          title: 'Full Stack Developer',
          description: 'ทักษะการพัฒนาเว็บแอปพลิเคชันแบบครบวงจร',
          category: 'Technology',
          questionCount: 25,
          skillCount: 12,
          estimatedTime: 50,
          difficulty: 'Advanced'
        }
      ], { status: 200 })
    }

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
    // Return empty array instead of error to prevent page crash
    return NextResponse.json([], { status: 200 })
  }
}
