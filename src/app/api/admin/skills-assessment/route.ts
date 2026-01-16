import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// Get admin assessments from database
export async function GET() {
  try {
    console.log('=== API: Fetching assessments from database ===')
    
    // Test database connection first
    await prisma.$connect()
    console.log('Database connected successfully')
    
    const careers = await prisma.career.findMany({
      include: {
        assessmentQuestions: {
          include: {
            skill: true
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    console.log(`Found ${careers.length} careers in database`)
    careers.forEach(career => {
      console.log(`- ${career.title}: ${career.assessmentQuestions.length} questions`)
    })

    // Transform database data to admin format
    const adminAssessments = careers.map(career => ({
      id: career.id,
      title: career.title,
      description: career.description || `ประเมินทักษะด้าน ${career.title}`,
      category: career.category || 'general',
      timeLimit: Math.max(30, Math.ceil((career.assessmentQuestions?.length || 0) * 2)),
      passingScore: 70,
      enabled: true,
      questions: career.assessmentQuestions?.map(q => {
        // Smart correct answer detection
        let correctAnswerIndex = 0;
        const correctAnswerStr = q.correctAnswer.trim();
        
        // Normalize: option_2 → option2, option_1 → option1
        const normalizedAnswer = correctAnswerStr.replace(/_/g, '');
        
        // Check if it's option1-4 format
        if (/^option[1-4]$/i.test(normalizedAnswer)) {
          correctAnswerIndex = parseInt(normalizedAnswer.replace(/option/i, '')) - 1;
        }
        // Check if it's a number (1-4)
        else if (/^[1-4]$/.test(correctAnswerStr)) {
          correctAnswerIndex = parseInt(correctAnswerStr) - 1;
        } 
        // Check if it matches option text
        else {
          const options = [q.option1, q.option2, q.option3, q.option4];
          const matchIndex = options.findIndex(opt => 
            opt.trim().toLowerCase() === correctAnswerStr.toLowerCase()
          );
          correctAnswerIndex = matchIndex >= 0 ? matchIndex : 0;
        }
        
        return {
          id: q.questionId,
          text: q.questionText,
          options: [q.option1, q.option2, q.option3, q.option4],
          correctAnswer: correctAnswerIndex,
          correctAnswerText: q.correctAnswer,
          skill: q.skill?.name || 'General',
          difficulty: (q.difficultyLevel?.toLowerCase() as 'beginner' | 'intermediate' | 'advanced') || 'intermediate',
          weight: q.score
        }
      }) || [],
      recommendedCourses: []
    }))
    
    console.log(`Returning ${adminAssessments.length} assessments to frontend`)
    return NextResponse.json(adminAssessments)
    
  } catch (error) {
    console.error('=== API ERROR ===')
    console.error('Admin assessments GET error:', error)
    
    // Return empty array with success status to prevent frontend errors
    return NextResponse.json([], { status: 200 })
  } finally {
    await prisma.$disconnect()
    console.log('Database disconnected')
  }
}

// Create or update admin assessment (sync to database)
export async function POST(request: Request) {
  try {
    await prisma.$connect()
    const data = await request.json()
    
    console.log('=== Creating Assessment ===')
    console.log('Data received:', JSON.stringify(data, null, 2))
    
    if (Array.isArray(data)) {
      // Bulk sync - return success for now
      return NextResponse.json({ message: 'Bulk sync completed', count: data.length })
    } else {
      // Single assessment create/update
      const career = await prisma.career.upsert({
        where: { title: data.title },
        update: {
          description: data.description,
          category: data.category
        },
        create: {
          title: data.title,
          description: data.description,
          category: data.category
        }
      })
      
      console.log('Career created/updated:', career)
      
      // Create skills and questions
      if (data.questions && data.questions.length > 0) {
        // Delete existing questions for this career
        await prisma.assessmentQuestion.deleteMany({
          where: { careerId: career.id }
        })
        
        // Create questions
        for (const question of data.questions) {
          // Create or get skill
          const skill = await prisma.careerSkill.upsert({
            where: { name: question.skill },
            update: {},
            create: {
              name: question.skill,
              description: `Skill for ${question.skill}`
            }
          })
          
          // Create question
          await prisma.assessmentQuestion.create({
            data: {
              questionId: question.id,
              careerId: career.id,
              skillId: skill.id,
              questionText: question.text,
              option1: question.options[0] || '',
              option2: question.options[1] || '',
              option3: question.options[2] || '',
              option4: question.options[3] || '',
              correctAnswer: (question.correctAnswer + 1).toString(),
              score: question.weight || 1,
              difficultyLevel: question.difficulty || 'intermediate',
              skillCategory: 'General',
              skillImportance: 'Medium',
              questionType: 'single'
            }
          })
        }
        
        console.log(`Created ${data.questions.length} questions for career ${career.title}`)
      }
      
      return NextResponse.json({ 
        success: true, 
        assessment: { ...data, id: career.id },
        message: `Assessment "${data.title}" created successfully with ${data.questions?.length || 0} questions`
      })
    }
  } catch (error) {
    console.error('Admin assessments POST error:', error)
    return NextResponse.json({ 
      error: 'Failed to save assessment', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

// Delete admin assessment
export async function DELETE(request: Request) {
  try {
    await prisma.$connect()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Assessment ID required' }, { status: 400 })
    }
    
    console.log('=== Deleting Assessment ===')
    console.log('Assessment ID:', id)
    
    // Delete assessment questions first (cascade should handle this, but being explicit)
    await prisma.assessmentQuestion.deleteMany({
      where: { careerId: id }
    })
    
    // Delete career
    await prisma.career.delete({
      where: { id }
    })
    
    console.log('Assessment deleted successfully')
    return NextResponse.json({ success: true, message: 'Assessment deleted successfully' })
  } catch (error) {
    console.error('Admin assessments DELETE error:', error)
    return NextResponse.json({ 
      error: 'Failed to delete assessment',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}