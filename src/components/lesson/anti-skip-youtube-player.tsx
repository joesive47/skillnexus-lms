'use client'

import { AntiSkipPlayer } from '../video'
import { updateLessonProgress } from '@/app/actions/lesson'
import { validateYouTubeID } from '@/lib/video'

interface AntiSkipYouTubePlayerProps {
  youtubeId: string // Clean 11-character YouTube Video ID
  lessonId: string
  initialWatchTime: number
  userId: string
}

export function AntiSkipYouTubePlayer({ 
  youtubeId, 
  lessonId, 
  initialWatchTime,
  userId 
}: AntiSkipYouTubePlayerProps) {
  // Validate YouTube ID format
  const validation = validateYouTubeID(youtubeId)
  if (!validation.isValid) {
    return (
      <div className="aspect-video bg-red-50 border-2 border-red-200 rounded-lg flex items-center justify-center">
        <div className="text-center p-6">
          <div className="text-red-600 mb-2">⚠️ รหัสวีดีโอไม่ถูกต้อง</div>
          <p className="text-sm text-red-700 mb-2">{validation.error}</p>
          <p className="text-xs text-red-500">รหัสที่ได้รับ: "{youtubeId}"</p>
        </div>
      </div>
    )
  }

  const handleProgress = async (watchedTime: number, totalTime: number) => {
    try {
      // Validate progress values
      if (!isFinite(watchedTime) || watchedTime < 0 || !isFinite(totalTime) || totalTime <= 0) {
        console.warn('Invalid progress values:', { watchedTime, totalTime })
        return
      }
      await updateLessonProgress(userId, lessonId, watchedTime)
    } catch (error) {
      console.error('Failed to update progress:', error)
    }
  }

  const handleComplete = async () => {
    try {
      await updateLessonProgress(userId, lessonId, 100)
    } catch (error) {
      console.error('Failed to mark as complete:', error)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <AntiSkipPlayer
        youtubeId={youtubeId}
        onProgress={handleProgress}
        onComplete={handleComplete}
        initialWatchedTime={initialWatchTime}
        requiredWatchPercentage={85}
      />
      
      <div className="mt-4 text-sm text-muted-foreground">
        <div className="flex justify-between items-center">
          <span>⚠️ ระบบป้องกันการข้ามวีดีโอเปิดใช้งาน</span>
          <span className="text-xs text-green-600">✅ Anti-skip active</span>
        </div>
      </div>
    </div>
  )
}