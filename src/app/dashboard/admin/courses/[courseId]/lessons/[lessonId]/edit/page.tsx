import { notFound, redirect } from 'next/navigation'
import prisma from '@/lib/prisma'

interface EditLessonPageProps {
  params: Promise<{
    courseId: string
    lessonId: string
  }>
}

export default async function EditLessonPage({ params }: EditLessonPageProps) {
  const { courseId, lessonId } = await params
  
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId }
  })

  if (!lesson) {
    notFound()
  }

  redirect(`/dashboard/admin/courses/${courseId}/edit`)
}
