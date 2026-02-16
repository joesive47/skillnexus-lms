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

// Enable dynamic rendering
export const dynamic = 'force-dynamic'
export const dynamicParams = true

export default async function EditCoursePage({ params }: EditCoursePageProps) {
  try {
    const { courseId } = await params
    console.log('[COURSE_EDIT] Fetching course:', courseId)
    
    const result = await getCourse(courseId)
    console.log('[COURSE_EDIT] Result:', result.success, result.course ? 'found' : 'not found')
    
    if (!result.success || !result.course) {
      console.log('[COURSE_EDIT] Course not found, returning 404')
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
    // Use double serialization to ensure complete conversion
    const serializedCourse = JSON.parse(
      JSON.stringify(serializeDates(result.course))
    )
    const serializedLessons = JSON.parse(
      JSON.stringify(serializeDates(lessons))
    )

    console.log('[COURSE_EDIT] Serialization complete')

    return (
      <div className="p-6 max-w-6xl mx-auto">
        <CourseEditTabs course={serializedCourse} lessons={serializedLessons} />
      </div>
    )
  } catch (error) {
    console.error('[COURSE_EDIT_ERROR] Full error:', error)
    console.error('[COURSE_EDIT_ERROR] Stack:', (error as Error).stack)
    throw error
  }
}