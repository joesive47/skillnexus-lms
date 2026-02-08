'use client'

import { useEffect, useRef, useState } from 'react'
import { updateVideoProgress } from '@/app/actions/learning-progress'

interface VideoProgressTrackerProps {
  nodeId: string
  lessonId: string
  courseId: string
  videoRef: React.RefObject<HTMLVideoElement>
  onProgressUpdate?: (progress: number) => void
  onComplete?: () => void
}

export function VideoProgressTracker({
  nodeId,
  lessonId,
  courseId,
  videoRef,
  onProgressUpdate,
  onComplete
}: VideoProgressTrackerProps) {
  const [isTracking, setIsTracking] = useState(false)
  const segmentsRef = useRef<Map<number, number>>(new Map())
  const lastUpdateRef = useRef<number>(0)
  const UPDATE_INTERVAL = 5000 // Update every 5 seconds

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      if (!isTracking) return

      const currentTime = Math.floor(video.currentTime)
      const duration = video.duration

      if (!duration || duration === 0) return

      // Track segment (1-second granularity)
      const segmentStart = currentTime
      const segmentEnd = currentTime + 1
      
      if (!segmentsRef.current.has(segmentStart)) {
        segmentsRef.current.set(segmentStart, segmentEnd)
      }

      // Update progress periodically
      const now = Date.now()
      if (now - lastUpdateRef.current >= UPDATE_INTERVAL) {
        updateProgressToServer(duration)
        lastUpdateRef.current = now
      }
    }

    const handlePlay = () => {
      setIsTracking(true)
    }

    const handlePause = () => {
      if (videoRef.current && videoRef.current.duration) {
        updateProgressToServer(videoRef.current.duration)
      }
    }

    const handleEnded = () => {
      if (videoRef.current && videoRef.current.duration) {
        updateProgressToServer(videoRef.current.duration, true)
      }
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ended', handleEnded)
    }
  }, [videoRef, isTracking])

  const updateProgressToServer = async (duration: number, forceComplete = false) => {
    const video = videoRef.current
    if (!video) return

    const segments = Array.from(segmentsRef.current.entries()).map(([start, end]) => ({
      start: start,
      end: end
    }))

    try {
      const result = await updateVideoProgress({
        lessonId,
        courseId,
        watchTime: video.currentTime,
        totalTime: video.duration || duration,
        segments
      })

      if (result.success && typeof result.progress === 'number') {
        const progressPercent = result.progress
        onProgressUpdate?.(progressPercent)

        if (result.completed || forceComplete) {
          onComplete?.()
        }
      }
    } catch (error) {
      console.error('Error updating video progress:', error)
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.duration) {
        updateProgressToServer(videoRef.current.duration)
      }
    }
  }, [])

  return null // This is a headless component
}
