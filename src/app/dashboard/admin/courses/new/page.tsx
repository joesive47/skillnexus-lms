import { CourseForm } from '@/components/course/course-form'
import { getActiveCourseCategoryTree } from '@/lib/course-categories'

export default async function NewCoursePage() {
  const categories = await getActiveCourseCategoryTree()
  return (
    <div className="p-6">
      <CourseForm mode="create" categories={categories} />
    </div>
  )
}
