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