import { CourseForm } from '@/components/course/course-form'
import { getActiveCourseCategoryTree } from '@/lib/course-categories'
import prisma from '@/lib/prisma'

export default async function NewCoursePage() {
  const [categories, instructors] = await Promise.all([
    getActiveCourseCategoryTree(),
    prisma.user.findMany({
      where: { role: 'TEACHER' },
      select: { id: true, name: true, email: true },
      orderBy: [{ name: 'asc' }, { email: 'asc' }],
    }),
  ])
  return (
    <div className="p-6">
      <CourseForm mode="create" categories={categories} instructors={instructors} />
    </div>
  )
}
