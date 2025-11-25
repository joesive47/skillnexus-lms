'use client'

import { VideoPlayer } from './VideoPlayer'
import { updateVideoProgress, updateLessonCompletionStatus } from '@/app/actions/video'

interface VideoPlayerWrapperProps {
  youtubeId: string
  lessonId: string
  courseId: string
  userId: string
  initialProgress?: number
  requiredWatchPercentage?: number
}

export function VideoPlayerWrapper({
  youtubeId,
  lessonId,
  courseId,
  userId,
  initialProgress = 0,
  requiredWatchPercentage = 85
}: VideoPlayerWrapperProps) {
  const handleProgress = async (watchedTime: number, totalTime: number) => {
    try {
      await updateVideoProgress(userId, lessonId, watchedTime, totalTime)
    } catch (error) {
      console.error('Failed to update progress:', error)
    }
  }

  const handleComplete = async () => {
    try {
      await updateLessonCompletionStatus(userId, lessonId, courseId)
    } catch (error) {
      console.error('Failed to mark as complete:', error)
    }
  }

  return (
    <VideoPlayer
      youtubeId={youtubeId}
      onProgress={handleProgress}
      onComplete={handleComplete}
      initialWatchedTime={initialProgress}
      requiredWatchPercentage={requiredWatchPercentage}
    />
  )
}