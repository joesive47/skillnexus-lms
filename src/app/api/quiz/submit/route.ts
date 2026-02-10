import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { quizId, lessonId, answers } = await request.json()

    // Get quiz with questions and correct answers
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: {
            options: true
          }
        }
      }
    })

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

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

    // Save quiz submission
    await prisma.studentSubmission.create({
      data: {
        userId: session.user.id,
        quizId,
        score,
        passed: score >= 70,
        answers: JSON.stringify(answers)
      }
    })

    // Mark lesson as completed if score >= 70%
    if (score >= 70) {
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
    }

    return NextResponse.json({
      score,
      correctAnswers,
      totalQuestions,
      percentage,
      passed: score >= 70,
      questionResults
    })
  } catch (error) {
    console.error('Quiz submission error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}