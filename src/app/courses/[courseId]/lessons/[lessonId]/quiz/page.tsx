import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { QuizWithPrerequisiteCheck } from '@/components/quiz/quiz-with-prerequisite-check'
import { getQuizForStudent } from '@/app/actions/quiz'

interface QuizPageProps {
  params: Promise<{ courseId: string; lessonId: string }>
}

export default async function QuizPage({ params }: QuizPageProps) {
  try {
    const { courseId, lessonId } = await params
    const session = await auth()
    if (!session?.user?.id) {
      redirect('/login')
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: {
        id: true,
        courseId: true,
        quiz: {
          select: {
            id: true,
            title: true,
            randomize: true,
            shuffleOptions: true,
            questionsToShow: true,
            questionPoolSize: true,
            passScore: true,
            prerequisiteQuizId: true
          }
        }
      }
    })

    if (!lesson || lesson.courseId !== courseId || !lesson.quiz) {
      redirect(`/courses/${courseId}/lessons/${lessonId}`)
    }

    // Check enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: courseId
        }
      }
    })

    const hasAccess = enrollment || session.user.role === 'ADMIN' || session.user.role === 'TEACHER'
    if (!hasAccess) {
      redirect(`/courses/${courseId}`)
    }

    // Get randomized/filtered questions using server action
    const quizDataResult = await getQuizForStudent(lesson.quiz.id)
    
    if (!quizDataResult.success || !quizDataResult.questions) {
      console.error('[QUIZ_PAGE] Failed to get quiz data:', quizDataResult.error)
      redirect(`/courses/${courseId}/lessons/${lessonId}`)
    }

    // Explicitly serialize all data to plain objects
    const sanitizedQuiz = JSON.parse(JSON.stringify({
      id: lesson.quiz.id,
      title: lesson.quiz.title,
      passScore: lesson.quiz.passScore || 80,
      questions: quizDataResult.questions.map(q => ({
        id: q.id,
        text: q.text,
        order: q.order,
        options: q.options.map(opt => ({
          id: opt.id,
          text: opt.text,
        }))
      }))
    }))

    return (
      <QuizWithPrerequisiteCheck
        quiz={sanitizedQuiz}
        lessonId={lessonId}
        courseId={courseId}
        userId={session.user.id}
      />
    )
  } catch (error) {
    console.error('[QUIZ_PAGE_ERROR]', error instanceof Error ? error.message : 'Unknown error')
    throw error
  }
}