'use client'

import { useState, useCallback, useRef } from 'react'
import { updateVideoProgress } from '@/app/actions/video'

interface UseVideoProgressProps {
  userId: string
  lessonId: string
  onComplete?: () => void
}

export function useVideoProgress({ userId, lessonId, onComplete }: UseVideoProgressProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [progressPercentage, setProgressPercentage] = useState(0)
  const lastSaveTime = useRef(0)

  const handleProgress = useCallback(async (watchedTime: number, videoDuration: number) => {
    // อัปเดต state
    setCurrentTime(watchedTime)
    setTotalTime(videoDuration)
    
    const percentage = videoDuration > 0 ? (watchedTime / videoDuration) * 100 : 0
    setProgressPercentage(percentage)

    // บันทึกความคืบหน้าทุก 5 วินาที หรือเมื่อเสร็จสิ้น
    const shouldSave = 
      Math.abs(watchedTime - lastSaveTime.current) >= 5 || 
      percentage >= 80 ||
      watchedTime >= videoDuration - 1

    if (shouldSave) {
      try {
        const result = await updateVideoProgress(userId, lessonId, watchedTime, videoDuration)
        
        if (result.success) {
          lastSaveTime.current = watchedTime
          
          // ตรวจสอบการเสร็จสิ้น
          if (result.isCompleted && !isCompleted) {
            setIsCompleted(true)
            onComplete?.()
          }
        }
      } catch (error) {
        console.error('Error saving video progress:', error)
      }
    }
  }, [userId, lessonId, isCompleted, onComplete])

  const handleComplete = useCallback(() => {
    if (!isCompleted) {
      setIsCompleted(true)
      onComplete?.()
    }
  }, [isCompleted, onComplete])

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }, [])

  const getRemainingTime = useCallback(() => {
    return Math.max(0, totalTime - currentTime)
  }, [currentTime, totalTime])

  return {
    currentTime,
    totalTime,
    progressPercentage,
    isCompleted,
    handleProgress,
    handleComplete,
    formatTime,
    getRemainingTime
  }
}