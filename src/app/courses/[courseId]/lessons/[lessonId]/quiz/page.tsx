import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { QuizClient } from '@/components/quiz/quiz-client'
import { requirePreviousLessons } from '@/lib/learning-evidence'

interface QuizPageProps {
  params: Promise<{ courseId: string; lessonId: string }>
}

export default async function QuizPage({ params }: QuizPageProps) {
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
      isFinalExam: true,
      quiz: {
        select: {
          id: true,
          title: true,
          passScore: true
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

  if (session.user.role === 'STUDENT') {
    try {
      await requirePreviousLessons(session.user.id, lessonId)
    } catch {
      redirect(`/courses/${courseId}`)
    }
  }

  // Pass only serializable primitive data + isFinalExam flag
  return (
    <QuizClient
      quizId={lesson.quiz.id}
      quizTitle={lesson.quiz.title}
      quizPassScore={lesson.quiz.passScore || 80}
      lessonId={lessonId}
      courseId={courseId}
      userId={session.user.id}
      isFinalExam={lesson.isFinalExam}
    />
  )
}
