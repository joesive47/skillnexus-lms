import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { CourseForm } from '@/components/course/course-form'

interface EditCoursePageProps {
  params: Promise<{
    courseId: string
  }>
}

// Enable dynamic rendering
export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const runtime = 'nodejs'

export default async function EditCoursePage({ params }: EditCoursePageProps) {
  const { courseId } = await params
  
  if (!courseId) {
    notFound()
  }

  try {
    // Fetch course with all necessary data including lessons
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true,
        description: true,
        published: true,
        price: true,
        imageUrl: true,
        lessons: {
          select: {
            id: true,
            title: true,
            order: true,
            lessonType: true,
            youtubeUrl: true,
            duration: true,
            requiredCompletionPercentage: true,
            quizId: true,
            scormPackage: {
              select: {
                id: true,
                title: true,
                packagePath: true
              }
            }
          },
          orderBy: {
            order: 'asc'
          }
        }
      }
    })
    
    if (!course) {
      notFound()
    }

    console.log('[COURSE_EDIT] Course data:', {
      id: course.id,
      title: course.title,
      lessonsCount: course.lessons.length,
      lessonTypes: course.lessons.map(l => ({ order: l.order, type: l.lessonType, title: l.title }))
    })

    // Convert to plain object for client component
    const courseData = {
      id: course.id,
      title: course.title,
      description: course.description,
      published: course.published,
      price: course.price,
      imageUrl: course.imageUrl,
      lessons: course.lessons.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        order: lesson.order,
        lessonType: lesson.lessonType,
        youtubeUrl: lesson.youtubeUrl,
        duration: lesson.duration,
        requiredCompletionPercentage: lesson.requiredCompletionPercentage,
        quizId: lesson.quizId,
        scormPackage: lesson.scormPackage
      }))
    }

    return (
      <div className="p-6">
        <CourseForm mode="edit" course={courseData} />
      </div>
    )
  } catch (error) {
    console.error('[COURSE_EDIT_ERROR]', error)
    throw error
  }
}