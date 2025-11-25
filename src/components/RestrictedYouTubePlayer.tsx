'use client'

import { VideoPlayer, AntiSkipPlayer } from './video'

type Props = {
  videoId?: string
  videoUrl?: string
  className?: string
  onProgress?: (percent: number) => void
  onComplete?: () => void
  lessonId?: string
  courseId?: string
  blockControls?: boolean
  allowFullscreen?: boolean
  autoHideControls?: boolean
  onProgressUpdate?: (currentProgress: number) => void
  isEnrolled?: boolean
  userRole?: string
  antiSkip?: boolean
}

const extractYouTubeId = (url: string) => {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  return match ? match[1] : null
}

function RestrictedYouTubePlayer({
  videoId,
  videoUrl,
  className,
  onProgress,
  onComplete,
  lessonId,
  courseId,
  blockControls,
  allowFullscreen,
  autoHideControls,
  onProgressUpdate,
  isEnrolled = false,
  userRole = 'STUDENT',
  antiSkip = true
}: Props) {
  const finalVideoId = videoId || extractYouTubeId(videoUrl || '') || ''

  const handleProgress = (progress: number) => {
    onProgress?.(progress)
    onProgressUpdate?.(progress)
  }

  const handleComplete = () => {
    onComplete?.()
  }

  // ตรวจสอบสิทธิ์การเข้าถึง
  if (!isEnrolled && userRole !== 'TEACHER' && userRole !== 'ADMIN') {
    return (
      <div className={`aspect-video bg-yellow-50 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center p-6">
          <h3 className="text-lg font-semibold text-yellow-700 mb-2">🔒 ต้องลงทะเบียนเรียน</h3>
          <p className="text-sm text-yellow-600 mb-4">กรุณาลงทะเบียนเรียนหลักสูตรนี้ก่อนเข้าชมวีดีโอ</p>
          <button 
            onClick={() => {
              if (courseId) {
                window.location.href = `/courses/${courseId}`
              }
            }}
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
          >
            ลงทะเบียนเรียน
          </button>
        </div>
      </div>
    )
  }

  if (!finalVideoId) {
    return (
      <div className={`aspect-video bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">ไม่มีวีดีโอ</h3>
          <p className="text-sm text-gray-600">กรุณาระบุ URL หรือ ID ของวีดีโอ</p>
        </div>
      </div>
    )
  }

  const PlayerComponent = antiSkip ? AntiSkipPlayer : VideoPlayer

  return (
    <div className={className}>
      <PlayerComponent
        youtubeId={finalVideoId}
        onProgress={handleProgress}
        onComplete={handleComplete}
        requiredWatchPercentage={85}
      />
    </div>
  )
}

export default RestrictedYouTubePlayer