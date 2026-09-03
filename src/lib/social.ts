// Social Features Service - Safe implementation
import { isFeatureEnabled } from './feature-flags'

export async function createDiscussion(
  courseId: string,
  userId: string,
  title: string,
  content: string
) {
  if (!(await isFeatureEnabled('socialFeatures'))) {
    throw new Error('Social features disabled')
  }

  // Social features not fully implemented yet
  console.log(`Discussion created for course ${courseId} by user ${userId}: ${title}`)
  return {
    id: 'temp-id',
    courseId,
    userId,
    title,
    content,
    user: { name: 'User', image: null },
    _count: { replies: 0, likes: 0 }
  }
}

export async function getDiscussions(courseId: string, page = 1, limit = 10) {
  if (!(await isFeatureEnabled('socialFeatures'))) {
    return { discussions: [], total: 0 }
  }

  // Social features not fully implemented yet
  return { discussions: [], total: 0 }
}

export async function toggleLike(discussionId: string, userId: string) {
  if (!(await isFeatureEnabled('socialFeatures'))) {
    return null
  }

  // Social features not fully implemented yet
  console.log(`User ${userId} toggled like on discussion ${discussionId}`)
  return true
}