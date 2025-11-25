// Activity Tracking Hook
import { useEffect } from 'react'
import { trackUserActivity } from '@/lib/ai-recommendations'

export function useActivityTracking(userId: string) {
  const trackActivity = async (
    action: string,
    target: string,
    targetId: string,
    metadata?: any
  ) => {
    try {
      await trackUserActivity(userId, action, target, targetId, metadata)
    } catch (error) {
      // Silent fail - don't break user experience
      console.error('Activity tracking failed:', error)
    }
  }

  const trackPageView = (page: string) => {
    trackActivity('view', 'page', page)
  }

  const trackCourseView = (courseId: string) => {
    trackActivity('view', 'course', courseId)
  }

  const trackLessonComplete = (lessonId: string, watchTime: number) => {
    trackActivity('complete', 'lesson', lessonId, { watchTime })
  }

  const trackQuizAttempt = (quizId: string, score: number) => {
    trackActivity('attempt', 'quiz', quizId, { score })
  }

  const trackSearch = (query: string, results: number) => {
    trackActivity('search', 'query', query, { results })
  }

  return {
    trackActivity,
    trackPageView,
    trackCourseView,
    trackLessonComplete,
    trackQuizAttempt,
    trackSearch
  }
}