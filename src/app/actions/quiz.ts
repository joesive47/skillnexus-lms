'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { UserRole } from '@/lib/types'
import { z } from 'zod'
import * as XLSX from 'xlsx'

const importQuizSchema = z.object({
  title: z.string().min(1, 'Quiz title is required'),
  questionsToShow: z.number().optional(),
  timeLimit: z.number().optional(),
  shuffleOptions: z.boolean().default(false),
  randomize: z.boolean().default(false),
})

export async function importQuizFromExcel(formData: FormData) {
  try {
    console.log('📥 Starting quiz import...')
    
    // Validate user role
    const session = await auth()
    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return { success: false, error: 'Unauthorized: Admin access required' }
    }
    console.log('✅ User authorized')

    const title = formData.get('title') as string
    const excelFile = formData.get('excelFile') as File
    const questionsToShowStr = formData.get('questionsToShow') as string
    const timeLimitStr = formData.get('timeLimit') as string
    const shuffleOptions = formData.get('shuffleOptions') === 'true'
    const randomize = formData.get('randomize') === 'true'
    
    console.log('📋 Form data: title=', title, 'file=', excelFile?.name)

    const questionsToShow = questionsToShowStr ? parseInt(questionsToShowStr) : undefined
    const timeLimit = timeLimitStr ? parseInt(timeLimitStr) : 0

    console.log('🔄 Validating fields...')
    const validatedFields = importQuizSchema.parse({ 
      title, 
      questionsToShow,
      timeLimit,
      shuffleOptions,
      randomize
    })
    console.log('✅ Fields validated')

    if (!excelFile || excelFile.size === 0) {
      return { success: false, error: 'Excel file is required' }
    }
    console.log('📄 Excel file received:', excelFile.name, excelFile.size, 'bytes')

    // Parse Excel file
    console.log('📖 Reading Excel file...')
    const buffer = await excelFile.arrayBuffer()
    const workbook = XLSX.read(buffer)
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const data = XLSX.utils.sheet_to_json(worksheet) as any[]
    console.log('✅ Excel parsed, rows:', data.length)

    if (!data || data.length === 0) {
      return { success: false, error: 'Excel file is empty or invalid format' }
    }

    // Validate Excel structure
    const requiredColumns = ['QuestionText', 'OptionA', 'OptionB', 'OptionC', 'OptionD', 'CorrectOption']
    const firstRow = data[0]
    const missingColumns = requiredColumns.filter(col => !(col in firstRow))
    
    if (missingColumns.length > 0) {
      return { success: false, error: `Missing columns: ${missingColumns.join(', ')}` }
    }

    // Convert Excel data to questions format
    const questions = data.map((row, index) => {
      const correctOption = row.CorrectOption?.toString().toUpperCase()
      if (!['A', 'B', 'C', 'D'].includes(correctOption)) {
        throw new Error(`Invalid correct option "${correctOption}" at row ${index + 2}. Must be A, B, C, or D`)
      }

      // Remove question numbers from text: (1), (2), (ข้อ 23), etc.
      let questionText = row.QuestionText?.toString() || ''
      // Remove (ข้อ XX) anywhere in the text
      questionText = questionText.replace(/\(\s*ข้อ\s*\d+\s*\)/g, '').trim()
      // Remove (XX) at the beginning
      questionText = questionText.replace(/^\s*\(\d+\)\s*/, '').trim()
      // Clean up multiple spaces
      questionText = questionText.replace(/\s+/g, ' ').trim()

      return {
        text: questionText,
        order: index,
        options: [
          { text: row.OptionA?.toString() || '', isCorrect: correctOption === 'A' },
          { text: row.OptionB?.toString() || '', isCorrect: correctOption === 'B' },
          { text: row.OptionC?.toString() || '', isCorrect: correctOption === 'C' },
          { text: row.OptionD?.toString() || '', isCorrect: correctOption === 'D' }
        ]
      }
    })

    const totalQuestions = questions.length

    // Validate questionsToShow
    if (questionsToShow && questionsToShow > totalQuestions) {
      return { 
        success: false, 
        error: `Cannot show ${questionsToShow} questions from ${totalQuestions} total questions` 
      }
    }

    console.log('💾 Creating quiz in database...')
    console.log('Quiz data: title=', validatedFields.title, 'questions=', totalQuestions, 'toShow=', questionsToShow || totalQuestions)

    // Create quiz with questions atomically (with extended timeout for large imports)
    const quiz = await prisma.$transaction(async (tx) => {
      // Create quiz first
      const newQuiz = await tx.quiz.create({
        data: {
          title: validatedFields.title,
          timeLimit: validatedFields.timeLimit,
          shuffleOptions: validatedFields.shuffleOptions,
          randomize: validatedFields.randomize,
          questionPoolSize: totalQuestions,
          questionsToShow: questionsToShow || totalQuestions,
        },
      })

      // Batch create questions and collect their IDs
      for (const questionData of questions) {
        const question = await tx.question.create({
          data: {
            text: questionData.text,
            order: questionData.order,
            quizId: newQuiz.id,
            options: {
              createMany: {
                data: questionData.options.map(option => ({
                  text: option.text,
                  isCorrect: option.isCorrect,
                })),
              }
            }
          },
        })
      }

      return newQuiz
    }, {
      maxWait: 10000, // 10 seconds max wait
      timeout: 30000, // 30 seconds timeout for large imports
    })

    console.log('✅ Quiz created successfully:', quiz.id)

    // Revalidate cache only after successful transaction
    revalidatePath('/dashboard/admin/quizzes')
    return { 
      success: true, 
      quiz,
      message: `นำเข้าสำเร็จ ${totalQuestions} ข้อ${questionsToShow && questionsToShow < totalQuestions ? ` (จะสุ่ม ${questionsToShow} ข้อให้ผู้ทำ)` : ''}`
    }
  } catch (error) {
    console.error('Error importing quiz:', error instanceof Error ? error.message : 'Unknown error')
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Failed to import quiz: Unknown error' }
  }
}

export async function deleteQuiz(quizId: string) {
  try {
    await prisma.quiz.delete({
      where: { id: quizId },
    })

    revalidatePath('/dashboard/admin/quizzes')
    return { success: true }
  } catch (error) {
    console.error('Error deleting quiz:', error instanceof Error ? error.message : 'Unknown error')
    return { success: false, error: 'Failed to delete quiz' }
  }
}

export async function updateQuizMetadata(quizId: string, title: string) {
  try {
    const quiz = await prisma.quiz.update({
      where: { id: quizId },
      data: { title },
    })

    revalidatePath('/dashboard/admin/quizzes')
    return { success: true, quiz }
  } catch (error) {
    console.error('Error updating quiz:', error instanceof Error ? error.message : 'Unknown error')
    return { success: false, error: 'Failed to update quiz' }
  }
}

export async function updateQuizSettings(
  quizId: string, 
  settings: { questionsToShow: number | null; randomize: boolean; shuffleOptions: boolean }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return { success: false, error: 'Unauthorized: Admin access required' }
    }

    // Get current quiz to validate questionsToShow
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        _count: {
          select: { questions: true }
        }
      }
    })

    if (!quiz) {
      return { success: false, error: 'Quiz not found' }
    }

    const totalQuestions = quiz._count.questions

    // Validate questionsToShow
    if (settings.questionsToShow && settings.questionsToShow > totalQuestions) {
      return { 
        success: false, 
        error: `Cannot show ${settings.questionsToShow} questions from ${totalQuestions} total questions` 
      }
    }

    const updatedQuiz = await prisma.quiz.update({
      where: { id: quizId },
      data: {
        questionsToShow: settings.questionsToShow || totalQuestions,
        questionPoolSize: totalQuestions,
        randomize: settings.randomize,
        shuffleOptions: settings.shuffleOptions
      },
    })

    revalidatePath('/dashboard/admin/quizzes')
    revalidatePath(`/dashboard/admin/quizzes/${quizId}`)
    revalidatePath(`/dashboard/admin/quizzes/${quizId}/edit`)
    
    return { success: true, quiz: updatedQuiz }
  } catch (error) {
    console.error('Error updating quiz settings:', error instanceof Error ? error.message : 'Unknown error')
    return { success: false, error: 'Failed to update quiz settings' }
  }
}

export async function submitQuizAttempt(quizId: string, lessonId: string, answers: Record<string, string>) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Get quiz with correct answers
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
      return { success: false, error: 'Quiz not found' }
    }

    // Calculate score for different question types
    // Only count questions that were actually answered (shown to user)
    let correctAnswers = 0
    const questionResults: any[] = []

    // Filter only questions that user answered (actually shown in quiz)
    const answeredQuestionIds = Object.keys(answers)
    const answeredQuestions = quiz.questions.filter(q => answeredQuestionIds.includes(q.id))

    answeredQuestions.forEach((question, index) => {
      const userAnswer = answers[question.id]
      
      // For multiple choice questions (default)
      const selectedOption = question.options.find(opt => opt.id === userAnswer)
      const correctOption = question.options.find(opt => opt.isCorrect)
      const isCorrect = selectedOption?.isCorrect || false
      
      if (isCorrect) {
        correctAnswers++
      }

      // Store detailed results
      questionResults.push({
        questionNumber: index + 1,
        questionText: question.text,
        userAnswer: selectedOption?.text || 'ไม่ได้ตอบ',
        correctAnswer: correctOption?.text || '',
        isCorrect
      })
    })

    // Calculate from actual answered questions, not total in question bank
    const totalQuestions = answeredQuestions.length
    const score = correctAnswers
    const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0
    const passed = percentage >= 80

    console.log('📊 Quiz Results: correct=', correctAnswers, 'total=', totalQuestions, 'percentage=', percentage, '%', 'passed=', passed)

    // Save submission
    await prisma.studentSubmission.create({
      data: {
        userId: session.user.id,
        quizId,
        score,
        passed,
        answers: JSON.stringify({
          userAnswers: answers,
          questionResults,
          summary: {
            correctAnswers,
            totalQuestions,
            percentage,
            passed
          }
        })
      }
    })

    // If passed, mark lesson as completed and check for next lesson unlock
    let certificate = null
    if (passed) {
      await prisma.watchHistory.upsert({
        where: {
          userId_lessonId: { userId: session.user.id, lessonId }
        },
        update: {
          completed: true,
          watchTime: 100
        },
        create: {
          userId: session.user.id,
          lessonId,
          completed: true,
          watchTime: 100
        }
      })

      const { checkAndUnlockNextLesson } = await import('./lesson')
      const result = await checkAndUnlockNextLesson(session.user.id, lessonId)
      certificate = result.certificate
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { courseId: true }
    })

    revalidatePath('/dashboard')
    if (lesson?.courseId) {
      revalidatePath(`/courses/${lesson.courseId}/lessons/${lessonId}`)
      revalidatePath(`/courses/${lesson.courseId}`)
    }
    
    return { 
      success: true, 
      score,
      correctAnswers,
      totalQuestions,
      percentage,
      passed,
      questionResults,
      certificate,
      analysis: {
        scoreDisplay: `${correctAnswers}/${totalQuestions}`,
        percentageDisplay: `${percentage}%`,
        status: passed ? 'PASSED' : 'FAILED',
        minimumRequired: '80%'
      }
    }
  } catch (error) {
    console.error('Error submitting quiz:', error instanceof Error ? error.message : 'Unknown error')
    return { success: false, error: 'Failed to submit quiz' }
  }
}

export async function getQuizzes() {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: {
        _count: {
          select: {
            questions: true,
            submissions: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return { success: true, quizzes }
  } catch (error) {
    console.error('Error fetching quizzes:', error instanceof Error ? error.message : 'Unknown error')
    return { success: false, error: 'Failed to fetch quizzes' }
  }
}

// Helper function: Shuffle array (Fisher-Yates algorithm)
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}
// Get quiz questions with randomization support
export async function getQuizForStudent(quizId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      select: {
        id: true,
        title: true,
        timeLimit: true,
        randomize: true,
        shuffleOptions: true,
        questionsToShow: true,
        questionPoolSize: true,
        questions: {
          select: {
            id: true,
            text: true,
            order: true,
            quizId: true,
            options: {
              select: {
                id: true,
                text: true,
                questionId: true,
                isCorrect: true
              }
            }
          },
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    if (!quiz) {
      return { success: false, error: 'Quiz not found' }
    }

    let questions = quiz.questions

    // Randomize questions if enabled
    if (quiz.randomize) {
      questions = shuffleArray(questions)
    }

    // Select subset if questionsToShow is set
    if (quiz.questionsToShow && quiz.questionsToShow < questions.length) {
      questions = questions.slice(0, quiz.questionsToShow)
    }

    // Shuffle options if enabled
    if (quiz.shuffleOptions) {
      questions = questions.map(q => ({
        ...q,
        options: shuffleArray(q.options)
      }))
    }

    // Remove correct answer indicators from options for student view
    const sanitizedQuestions = questions.map(q => ({
      id: q.id,
      text: q.text,
      order: q.order,
      quizId: q.quizId,
      options: q.options.map(opt => ({
        id: opt.id,
        text: opt.text,
        questionId: opt.questionId
        // isCorrect is intentionally omitted
      }))
    }))

    return { 
      success: true, 
      quiz: {
        id: quiz.id,
        title: quiz.title,
        timeLimit: quiz.timeLimit,
        randomize: quiz.randomize,
        shuffleOptions: quiz.shuffleOptions,
        questionsToShow: quiz.questionsToShow,
        questionPoolSize: quiz.questionPoolSize
      },
      questions: sanitizedQuestions
    }
  } catch (error) {
    console.error('Error fetching quiz for student:', error instanceof Error ? error.message : 'Unknown error')
    return { success: false, error: 'Failed to fetch quiz' }
  }
}
