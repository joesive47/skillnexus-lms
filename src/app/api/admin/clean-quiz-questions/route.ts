import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

/**
 * API Endpoint to remove question numbers like (1), (2) from quiz questions
 * GET /api/admin/clean-quiz-questions
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    // Check admin authentication
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    console.log('🧹 Starting quiz question cleanup...')

    // Get all questions
    const questions = await prisma.question.findMany({
      select: {
        id: true,
        text: true,
        quizId: true,
      }
    })

    console.log(`📊 Found ${questions.length} questions to check`)

    let cleanedCount = 0
    let alreadyCleanCount = 0
    const cleanedQuestions: any[] = []

    for (const question of questions) {
      // Check if question starts with (number)
      const match = question.text.match(/^\s*\(\d+\)\s*/)
      
      if (match) {
        const originalText = question.text
        const cleanedText = question.text.replace(/^\s*\(\d+\)\s*/, '').trim()
        
        console.log(`🧹 Cleaning question ${question.id}:`)
        console.log(`   Original: ${originalText.substring(0, 50)}...`)
        console.log(`   Cleaned:  ${cleanedText.substring(0, 50)}...`)
        
        await prisma.question.update({
          where: { id: question.id },
          data: { text: cleanedText }
        })
        
        cleanedQuestions.push({
          id: question.id,
          original: originalText,
          cleaned: cleanedText,
        })
        cleanedCount++
      } else {
        alreadyCleanCount++
      }
    }

    const result = {
      success: true,
      message: 'Question cleanup completed',
      stats: {
        total: questions.length,
        cleaned: cleanedCount,
        alreadyClean: alreadyCleanCount,
      },
      cleanedQuestions,
    }

    console.log('\n✨ Cleanup complete!')
    console.log(`   🧹 Cleaned: ${cleanedCount} questions`)
    console.log(`   ✅ Already clean: ${alreadyCleanCount} questions`)
    console.log(`   📝 Total: ${questions.length} questions`)

    return NextResponse.json(result, { status: 200 })

  } catch (error) {
    console.error('❌ Error during cleanup:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to clean quiz questions',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
