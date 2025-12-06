import { CourseForm } from '@/components/course/course-form'

export default function NewCoursePage() {
  return (
    <div className="p-6">
      <CourseForm mode="create" />
    </div>
  )
}