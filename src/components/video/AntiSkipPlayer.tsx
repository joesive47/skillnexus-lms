'use client'

import { useRef } from 'react'
import { SecureVideoPlayer } from './SecureVideoPlayer'

interface AntiSkipPlayerProps {
  youtubeId: string
  onProgress: (watchedTime: number, totalTime: number) => void | Promise<void>
  onComplete: () => void | Promise<void>
  initialWatchedTime?: number
  requiredWatchPercentage?: number
}

/** Compatibility adapter. New lesson pages should use SecureVideoPlayer directly. */
export function AntiSkipPlayer({
  youtubeId,
  onProgress,
  onComplete,
  initialWatchedTime = 0,
  requiredWatchPercentage = 80,
}: AntiSkipPlayerProps) {
  const completedRef = useRef(false)
  return (
    <SecureVideoPlayer
      youtubeId={youtubeId}
      initialWatchedTime={initialWatchedTime}
      requiredWatchPercentage={requiredWatchPercentage}
      onHeartbeat={async (watchedTime, totalTime) => {
        await onProgress(watchedTime, totalTime)
        const completed = totalTime > 0 && watchedTime >= totalTime * requiredWatchPercentage / 100
        if (completed && !completedRef.current) {
          completedRef.current = true
          await onComplete()
        }
        return completed
      }}
    />
  )
}
