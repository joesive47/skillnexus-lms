'use server'

import { startQuizSession, submitQuizSession } from '@/lib/quiz-session'
import { publicError, requireAdmin } from '@/lib/access-control'
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
    await requireAdmin()
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
    await requireAdmin()
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

export async function submitQuizAttempt(quizId: string, lessonId: string, answers: Record<string, string>, attemptId?: string) {
  try {
    const result = await submitQuizSession(quizId, lessonId, answers, attemptId)
    revalidatePath('/dashboard')
    return result
  } catch (error) { return { success: false as const, error: publicError(error) } }
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
export async function getQuizForStudent(quizId: string, lessonId?: string) {
  try { return await startQuizSession(quizId, lessonId) }
  catch (error) { return { success: false as const, error: publicError(error) } }
}

