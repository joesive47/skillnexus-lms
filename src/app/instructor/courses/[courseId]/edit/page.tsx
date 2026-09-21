import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { CourseForm } from '@/components/course/course-form'
import { getActiveCourseCategoryTree } from '@/lib/course-categories'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface EditCoursePageProps {
  params: Promise<{ courseId: string }>
}

export default async function InstructorEditCoursePage({ params }: EditCoursePageProps) {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if (session.user.role !== 'TEACHER' && session.user.role !== 'ADMIN') redirect('/dashboard')

  const { courseId } = await params
  if (!courseId) notFound()

  const [categories, course] = await Promise.all([
    getActiveCourseCategoryTree(),
    prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true, title: true, description: true,
        published: true, hasCertificate: true, price: true, imageUrl: true, categoryId: true,
        lessons: {
          select: {
            id: true, title: true, order: true, lessonType: true,
            youtubeUrl: true, duration: true, requiredCompletionPercentage: true,
            quizId: true,
          },
          orderBy: { order: 'asc' },
        },
      },
    }),
  ])

  if (!course) notFound()

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8 max-w-4xl">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/instructor/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            กลับ Dashboard
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">แก้ไขหลักสูตร</h1>
        <p className="text-sm text-gray-500 mt-1 line-clamp-1">{course.title}</p>
      </div>
      <CourseForm
        mode="edit"
        course={course as any}
        categories={categories}
        redirectPath="/instructor/dashboard"
      />
    </div>
  )
}
