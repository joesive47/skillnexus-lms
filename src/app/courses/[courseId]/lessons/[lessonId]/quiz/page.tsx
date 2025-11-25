import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { QuizComponent } from '@/components/quiz/QuizComponent'

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
    include: {
      quiz: {
        include: {
          questions: {
            include: {
              options: true
            },
            orderBy: { order: 'asc' }
          }
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

  return (
    <QuizComponent
      quiz={lesson.quiz}
      lessonId={lessonId}
      courseId={courseId}
      userId={session.user.id}
    />
  )
}