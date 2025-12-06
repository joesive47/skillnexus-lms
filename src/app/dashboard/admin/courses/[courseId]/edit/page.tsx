import { getCourse } from '@/app/actions/course'
import { CourseForm } from '@/components/course/course-form'
import { notFound } from 'next/navigation'

interface EditCoursePageProps {
  params: Promise<{
    courseId: string
  }>
}

export default async function EditCoursePage({ params }: EditCoursePageProps) {
  const { courseId } = await params
  const result = await getCourse(courseId)
  
  if (!result.success || !result.course) {
    notFound()
  }

  return (
    <div className="p-6">
      <CourseForm course={result.course} mode="edit" />
    </div>
  )
}