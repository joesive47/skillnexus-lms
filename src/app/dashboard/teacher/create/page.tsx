import { CourseForm } from '@/components/course/course-form'

export default function CreateCoursePage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create New Course</h1>
        <p className="text-muted-foreground">
          Create a new course with modules, lessons, and assessments.
        </p>
      </div>
      
      <CourseForm />
    </div>
  )
}