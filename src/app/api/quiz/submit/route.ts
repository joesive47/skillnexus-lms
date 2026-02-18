import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    console.log('[QUIZ_SUBMIT] Starting submission')
    
    const session = await auth()
    if (!session?.user?.id) {
      console.log('[QUIZ_SUBMIT] Unauthorized')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.log('[QUIZ_SUBMIT] User:', session.user.id)

    const { quizId, lessonId, answers } = await request.json()
    console.log('[QUIZ_SUBMIT] QuizId:', quizId, 'LessonId:', lessonId, 'Answers count:', Object.keys(answers).length)

    // Get quiz with questions and correct answers
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      select: {
        id: true,
        title: true,
        passScore: true,
        questions: {
          select: {
            id: true,
            text: true,
            options: {
              select: {
                id: true,
                text: true,
                isCorrect: true
              }
            }
          }
        }
      }
    })

    if (!quiz) {
      console.log('[QUIZ_SUBMIT] Quiz not found')
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }
    console.log('[QUIZ_SUBMIT] Quiz found:', quiz.title, 'PassScore:', quiz.passScore)

    // Calculate score with detailed analysis
    // Only count questions that were actually answered (shown to user)
    let correctAnswers = 0
    const questionResults: Array<{
      questionId: string
      questionText: string
      userAnswer: string | null
      correctAnswer: string
      isCorrect: boolean
      userAnswerText: string | null
      correctAnswerText: string
    }> = []

    // Filter only questions that user answered (actually shown in quiz)
    const answeredQuestionIds = Object.keys(answers)
    const answeredQuestions = quiz.questions.filter(q => answeredQuestionIds.includes(q.id))

    for (const question of answeredQuestions) {
      const userAnswer = answers[question.id]
      const correctOption = question.options.find(opt => opt.isCorrect)
      const userOption = question.options.find(opt => opt.id === userAnswer)
      const isCorrect = userAnswer === correctOption?.id
      
      if (isCorrect) {
        correctAnswers++
      }

      questionResults.push({
        questionId: question.id,
        questionText: question.text,
        userAnswer: userAnswer || null,
        correctAnswer: correctOption?.id || '',
        isCorrect,
        userAnswerText: userOption?.text || null,
        correctAnswerText: correctOption?.text || ''
      })
    }

    // Calculate from actual answered questions, not total in question bank
    const totalQuestions = answeredQuestions.length
    const score = Math.round((correctAnswers / totalQuestions) * 100)
    const percentage = score
    const passScore = quiz.passScore || 70
    const passed = score >= passScore

    console.log('[QUIZ_SUBMIT] Score:', score, 'PassScore:', passScore, 'Passed:', passed)

    // Save quiz submission
    try {
      await prisma.studentSubmission.create({
        data: {
          userId: session.user.id,
          quizId,
          score,
          passed,
          answers: JSON.stringify(answers)
        }
      })
      console.log('[QUIZ_SUBMIT] Submission saved')
    } catch (dbError) {
      console.error('[QUIZ_SUBMIT] DB Error saving submission:', dbError)
      // Continue even if save fails
    }

    // Mark lesson as completed if passed
    if (passed && lessonId) {
      try {
        await prisma.watchHistory.upsert({
          where: {
            userId_lessonId: {
              userId: session.user.id,
              lessonId
            }
          },
          update: {
            completed: true
          },
          create: {
            userId: session.user.id,
            lessonId,
            completed: true,
            watchTime: 0
          }
        })
        console.log('[QUIZ_SUBMIT] Lesson marked as completed')
      } catch (dbError) {
        console.error('[QUIZ_SUBMIT] DB Error marking lesson complete:', dbError)
        // Continue even if this fails
      }
    }

    console.log('[QUIZ_SUBMIT] Success - returning results')
    return NextResponse.json({
      score,
      correctAnswers,
      totalQuestions,
      percentage,
      passed,
      questionResults
    })
  } catch (error) {
    console.error('[QUIZ_SUBMIT] Error:', error instanceof Error ? error.message : 'Unknown')
    console.error('[QUIZ_SUBMIT] Stack:', error instanceof Error ? error.stack : '')
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}