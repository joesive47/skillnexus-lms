'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { UserRole } from '@/lib/types'
import { z } from 'zod'
import * as XLSX from 'xlsx'

const importQuizSchema = z.object({
  title: z.string().min(1, 'Quiz title is required'),
})

export async function importQuizFromExcel(formData: FormData) {
  try {
    // Validate user role
    const session = await auth()
    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return { success: false, error: 'Unauthorized: Admin access required' }
    }

    const title = formData.get('title') as string
    const excelFile = formData.get('excelFile') as File

    const validatedFields = importQuizSchema.parse({ title })

    if (!excelFile || excelFile.size === 0) {
      return { success: false, error: 'Excel file is required' }
    }

    // Parse Excel file
    const buffer = await excelFile.arrayBuffer()
    const workbook = XLSX.read(buffer)
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const data = XLSX.utils.sheet_to_json(worksheet) as any[]

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

      return {
        text: row.QuestionText?.toString() || '',
        options: [
          { text: row.OptionA?.toString() || '', isCorrect: correctOption === 'A' },
          { text: row.OptionB?.toString() || '', isCorrect: correctOption === 'B' },
          { text: row.OptionC?.toString() || '', isCorrect: correctOption === 'C' },
          { text: row.OptionD?.toString() || '', isCorrect: correctOption === 'D' }
        ]
      }
    })

    // Create quiz with questions atomically
    const quiz = await prisma.$transaction(async (tx) => {
      const newQuiz = await tx.quiz.create({
        data: {
          title: validatedFields.title,
        },
      })

      for (const questionData of questions) {
        const question = await tx.question.create({
          data: {
            text: questionData.text,
            quizId: newQuiz.id,
          },
        })

        await tx.answerOption.createMany({
          data: questionData.options.map(option => ({
            text: option.text,
            isCorrect: option.isCorrect,
            questionId: question.id,
          })),
        })
      }

      return newQuiz
    })

    // Revalidate cache only after successful transaction
    revalidatePath('/dashboard/admin/quizzes')
    return { success: true, quiz }
  } catch (error) {
    console.error('Error importing quiz:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: 'Failed to import quiz' }
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
    console.error('Error deleting quiz:', error)
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
    console.error('Error updating quiz:', error)
    return { success: false, error: 'Failed to update quiz' }
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
    let correctAnswers = 0
    const totalQuestions = quiz.questions.length

    quiz.questions.forEach(question => {
      const userAnswer = answers[question.id]
      
      // For multiple choice questions (default)
      const selectedOption = question.options.find(opt => opt.id === userAnswer)
      if (selectedOption?.isCorrect) {
        correctAnswers++
      }
    })

    const score = correctAnswers
    const percentage = (correctAnswers / totalQuestions) * 100
    const passed = percentage >= 80

    // Save submission
    await prisma.studentSubmission.create({
      data: {
        userId: session.user.id,
        quizId,
        score,
        passed,
        answers: JSON.stringify(answers)
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
      passed, 
      totalQuestions,
      percentage: Math.round(percentage),
      certificate 
    }
  } catch (error) {
    console.error('Error submitting quiz:', error)
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
    console.error('Error fetching quizzes:', error)
    return { success: false, error: 'Failed to fetch quizzes' }
  }
}