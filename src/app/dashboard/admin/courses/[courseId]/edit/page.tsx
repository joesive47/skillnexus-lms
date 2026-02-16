import { notFound, redirect } from 'next/navigation'
import prisma from '@/lib/prisma'

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
  
  console.log('[COURSE_EDIT] Starting - courseId:', courseId)
  
  // Simple validation
  if (!courseId) {
    console.log('[COURSE_EDIT] No courseId provided')
    notFound()
  }

  try {
    console.log('[COURSE_EDIT] Querying database...')
    
    // Ultra-simple query - no Date fields
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true,
        description: true,
        published: true,
        price: true
      }
    })
    
    console.log('[COURSE_EDIT] Query result:', course ? 'found' : 'null')
    
    if (!course) {
      console.log('[COURSE_EDIT] Course not found')
      notFound()
    }

    console.log('[COURSE_EDIT] Rendering page...')

    // Ultra-simple HTML - no external components
    return (
      <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '20px' }}>
          <a 
            href="/dashboard/admin/courses" 
            style={{ 
              padding: '8px 16px', 
              background: '#f0f0f0', 
              borderRadius: '4px',
              textDecoration: 'none',
              color: '#333'
            }}
          >
            ← กลับ
          </a>
        </div>

        <div style={{ 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          padding: '24px',
          background: 'white'
        }}>
          <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>
            แก้ไขคอร์ส: {course.title}
          </h1>
          
          <div style={{ marginBottom: '16px' }}>
            <strong>Course ID:</strong> {course.id}
          </div>
          <div style={{ marginBottom: '16px' }}>
            <strong>Title:</strong> {course.title}
          </div>
          <div style={{ marginBottom: '16px' }}>
            <strong>Description:</strong> {course.description || 'N/A'}
          </div>
          <div style={{ marginBottom: '16px' }}>
            <strong>Price:</strong> {course.price} บาท
          </div>
          <div style={{ marginBottom: '16px' }}>
            <strong>Published:</strong> {course.published ? 'Yes ✅' : 'No ❌'}
          </div>
          
          <div style={{ 
            marginTop: '32px', 
            padding: '16px', 
            background: '#fff3cd', 
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            ⚠️ Ultra-simple debug version - Testing basic rendering
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('[COURSE_EDIT_ERROR] Exception caught:', error)
    console.error('[COURSE_EDIT_ERROR] Error type:', error instanceof Error ? error.constructor.name : typeof error)
    console.error('[COURSE_EDIT_ERROR] Error message:', error instanceof Error ? error.message : String(error))
    console.error('[COURSE_EDIT_ERROR] Stack trace:', error instanceof Error ? error.stack : 'No stack')
    
    // Re-throw to trigger error.tsx
    throw error
  }
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