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

  // 🔒 Security: Remove correct answers from quiz data before sending to client
  // Students should NOT see isCorrect field - only admin/teacher can see answers
  const sanitizedQuiz = {
    id: lesson.quiz.id,
    title: lesson.quiz.title,
    questions: lesson.quiz.questions.map(q => ({
      id: q.id,
      text: q.text,
      order: q.order,
      options: q.options.map(opt => ({
        id: opt.id,
        text: opt.text,
        // isCorrect is intentionally omitted - prevents cheating via DevTools
      }))
    }))
  }

  return (
    <QuizComponent
      quiz={sanitizedQuiz}
      lessonId={lessonId}
      courseId={courseId}
      userId={session.user.id}
    />
  )
}