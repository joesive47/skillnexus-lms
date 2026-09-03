'use client'

import { useEffect } from 'react'

export function CourseTracker({ courseId, event }: { courseId: string; event: 'VIEW' | 'START' | 'RESUME' }) {
  useEffect(() => {
    const key = `skillnexus-course-session-${courseId}`
    let sessionId = sessionStorage.getItem(key)
    if (!sessionId) {
      sessionId = crypto.randomUUID()
      sessionStorage.setItem(key, sessionId)
    }
    void fetch(`/api/courses/${courseId}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, sessionId, source: 'course-detail' }),
      keepalive: true,
    })
  }, [courseId, event])

  return null
}
