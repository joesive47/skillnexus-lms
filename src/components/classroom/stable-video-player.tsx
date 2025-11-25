'use client'

import { VideoPlayer } from '../video'
import { updateVideoProgress } from '@/app/actions/video'

interface StableVideoPlayerProps {
  youtubeId: string
  lessonId: string
  initialWatchTime: number
  userId: string
}

export function StableVideoPlayer({ 
  youtubeId, 
  lessonId, 
  initialWatchTime,
  userId 
}: StableVideoPlayerProps) {
  const handleProgress = async (watchedTime: number, totalTime: number) => {
    try {
      await updateVideoProgress(userId, lessonId, watchedTime, totalTime)
    } catch (error) {
      console.error('Failed to update progress:', error)
    }
  }

  const handleComplete = async () => {
    try {
      await updateVideoProgress(userId, lessonId, 100, 100)
    } catch (error) {
      console.error('Failed to mark as complete:', error)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <VideoPlayer
        youtubeId={youtubeId}
        onProgress={handleProgress}
        onComplete={handleComplete}
        initialWatchedTime={initialWatchTime}
        requiredWatchPercentage={85}
      />
    </div>
  )
}