import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { QuizWithPrerequisiteCheck } from '@/components/quiz/quiz-with-prerequisite-check'

interface QuizPageProps {
  params: Promise<{ courseId: string; lessonId: string }>
}

export default async function QuizPage({ params }: QuizPageProps) {
  const { courseId, lessonId } = await params
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect('/login')
  }

  // Minimal query - just check if quiz exists and user has access
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: {
      id: true,
      courseId: true,
      quiz: {
        select: {
          id: true
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

  // Pass only IDs to client component - let it fetch quiz data via API
  return (
    <QuizWithPrerequisiteCheck
      quizId={lesson.quiz.id}
      lessonId={lessonId}
      courseId={courseId}
      userId={session.user.id}
    />
  )
}