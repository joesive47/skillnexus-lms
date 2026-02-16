import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'

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
    
    // Fetch course with minimal fields
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true,
        description: true,
        published: true
      }
    })
    
    if (!course) {
      notFound()
    }

    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <Link href="/dashboard/admin/courses">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              กลับ
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>แก้ไขคอร์ส: {course.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <strong>Course ID:</strong> {course.id}
              </div>
              <div>
                <strong>Title:</strong> {course.title}
              </div>
              <div>
                <strong>Description:</strong> {course.description || 'N/A'}
              </div>
              <div>
                <strong>Published:</strong> {course.published ? 'Yes' : 'No'}
              </div>
              <div className="pt-4">
                <p className="text-sm text-gray-500">
                  ⚠️ This is a simplified version for debugging. 
                  The full editing interface will be restored once the error is fixed.
                </p>
              </div>
            </CardContent>
          </Card>
        </Card>
      </div>
    )
  } catch (error) {
    console.error('[COURSE_EDIT_ERROR]', error)
    throw error
  }
}
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
    
    // Validate courseId format
    if (!courseId || typeof courseId !== 'string') {
      console.error('[COURSE_EDIT] Invalid courseId:', courseId)
      notFound()
    }

    // Fetch course with only necessary fields
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        imageUrl: true,
        published: true,
        createdAt: true,
        updatedAt: true
      }
    })
    
    console.log('[COURSE_EDIT] Result:', course ? 'found' : 'not found')
    
    if (!course) {
      console.log('[COURSE_EDIT] Course not found, returning 404')
      notFound()
    }

    // Get lessons for this course with only necessary fields
    let lessonsData
    try {
      lessonsData = await prisma.lesson.findMany({
        where: { courseId },
        select: {
          id: true,
          title: true,
          order: true,
          youtubeUrl: true,
          duration: true,
          content: true,
          createdAt: true,
          quiz: {
            select: {
              id: true,
              title: true
            }
          },
          scormPackage: {
            select: {
              id: true,
              title: true
            }
          }
        },
        orderBy: { order: 'asc' }
      })
      console.log(`[COURSE_EDIT] Found ${lessonsData.length} lessons`)
    } catch (dbError) {
      console.error('[COURSE_EDIT] Database error fetching lessons:', dbError)
      lessonsData = []
    }

    // Ensure all lessons have non-null titles
    const lessons = lessonsData.map(lesson => ({
      ...lesson,
      title: lesson.title || 'Untitled Lesson'
    }))

    // Simple serialization - convert to plain objects with ISO dates
    const serializedCourse = {
      id: course.id,
      title: course.title,
      description: course.description,
      price: course.price,
      imageUrl: course.imageUrl,
      published: course.published,
      createdAt: course.createdAt.toISOString(),
      updatedAt: course.updatedAt.toISOString()
    }
    
    const serializedLessons = lessons.map(lesson => ({
      id: lesson.id,
      title: lesson.title,
      order: lesson.order,
      youtubeUrl: lesson.youtubeUrl,
      duration: lesson.duration,
      content: lesson.content,
      createdAt: lesson.createdAt.toISOString(),
      quiz: lesson.quiz,
      scormPackage: lesson.scormPackage
    }))

    console.log('[COURSE_EDIT] Serialization complete')

    return (
      <div className="p-6 max-w-6xl mx-auto">
        <CourseEditTabs course={serializedCourse} lessons={serializedLessons} />
      </div>
    )
  } catch (error) {
    console.error('[COURSE_EDIT_ERROR] Full error:', error)
    console.error('[COURSE_EDIT_ERROR] Name:', (error as Error).name)
    console.error('[COURSE_EDIT_ERROR] Message:', (error as Error).message)
    console.error('[COURSE_EDIT_ERROR] Stack:', (error as Error).stack)
    throw error
  }
}