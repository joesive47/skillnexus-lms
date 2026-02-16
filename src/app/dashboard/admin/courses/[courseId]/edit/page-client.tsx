'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function EditCoursePageClient() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId as string
  
  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCourse() {
      try {
        console.log('[CLIENT] Fetching course:', courseId)
        
        const res = await fetch(`/api/courses/${courseId}`)
        
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }
        
        const data = await res.json()
        console.log('[CLIENT] Course loaded:', data)
        setCourse(data)
      } catch (err) {
        console.error('[CLIENT] Error:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    if (courseId) {
      fetchCourse()
    }
  }, [courseId])

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div>Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '40px', color: 'red' }}>
        <div>Error: {error}</div>
        <button onClick={() => router.back()}>Go Back</button>
      </div>
    )
  }

  if (!course) {
    return (
      <div style={{ padding: '40px' }}>
        <div>Course not found</div>
        <button onClick={() => router.push('/dashboard/admin/courses')}>
          Back to Courses
        </button>
      </div>
    )
  }

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <button 
        onClick={() => router.push('/dashboard/admin/courses')}
        style={{ 
          padding: '8px 16px', 
          marginBottom: '20px',
          background: '#f0f0f0',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        ← Back
      </button>

      <div style={{ 
        border: '1px solid #ddd', 
        borderRadius: '8px', 
        padding: '24px',
        background: 'white'
      }}>
        <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>
          Edit Course: {course.title}
        </h1>
        
        <div style={{ marginBottom: '12px' }}>
          <strong>ID:</strong> {course.id}
        </div>
        <div style={{ marginBottom: '12px' }}>
          <strong>Title:</strong> {course.title}
        </div>
        <div style={{ marginBottom: '12px' }}>
          <strong>Description:</strong> {course.description || 'N/A'}
        </div>
        <div style={{ marginBottom: '12px' }}>
          <strong>Price:</strong> {course.price} THB
        </div>
        <div style={{ marginBottom: '12px' }}>
          <strong>Published:</strong> {course.published ? '✅ Yes' : '❌ No'}
        </div>

        <div style={{ 
          marginTop: '24px', 
          padding: '12px', 
          background: '#e3f2fd',
          borderRadius: '4px'
        }}>
          🚧 Client Component Version - Fetching via API
        </div>
      </div>
    </div>
  )
}
