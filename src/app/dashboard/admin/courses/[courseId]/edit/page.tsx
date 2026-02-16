import { getCourse } from '@/app/actions/course'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { CourseEditTabs } from '@/components/course/course-edit-tabs'
import { serializeDates } from '@/lib/serialize-dates'

interface EditCoursePageProps {
  params: Promise<{
    courseId: string
  }>
}

export default async function EditCoursePage({ params }: EditCoursePageProps) {
  try {
    const { courseId } = await params
    const result = await getCourse(courseId)
    
    if (!result.success || !result.course) {
      notFound()
    }

    // Get lessons for this course with all fields
    const lessonsData = await prisma.lesson.findMany({
      where: { courseId },
      include: {
        quiz: true,
        scormPackage: true
      },
      orderBy: { order: 'asc' }
    })

    // Ensure all lessons have non-null titles
    const lessons = lessonsData.map(lesson => ({
      ...lesson,
      title: lesson.title || 'Untitled Lesson'
    }))

    // Deep serialize all Date objects to ISO strings
    const serializedCourse = serializeDates(result.course)
    const serializedLessons = serializeDates(lessons)

    return (
      <div className="p-6 max-w-6xl mx-auto">
        <CourseEditTabs course={serializedCourse as any} lessons={serializedLessons as any} />
      </div>
    )
  } catch (error) {
    console.error('[COURSE_EDIT_ERROR]', error)
    throw error
  }
}