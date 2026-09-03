'use client'

import { useRef } from 'react'
import { SecureVideoPlayer } from './SecureVideoPlayer'
import { updateLessonProgress } from '@/lib/course-progress'
import type { VideoProgressEvidence } from '@/lib/video-presence'
import { toast } from 'sonner'

interface VideoPlayerWrapperProps {
  youtubeId: string
  lessonId: string
  courseId: string
  userId: string
  initialProgress?: number
  initialCompleted?: boolean
  requiredWatchPercentage?: number
  isFinalExam?: boolean
}

export function VideoPlayerWrapper({
  youtubeId,
  lessonId,
  courseId,
  initialProgress = 0,
  initialCompleted = false,
  requiredWatchPercentage = 85,
  isFinalExam = false,
}: VideoPlayerWrapperProps) {
  const completionAnnouncedRef = useRef(initialCompleted)

  const handleHeartbeat = async (watchedTime: number, totalTime: number, evidence: VideoProgressEvidence) => {
    try {
      const result = await updateLessonProgress(courseId, lessonId, {
        watchTime: watchedTime,
        totalTime,
        completed: false,
        evidence,
      })
      const completed = !!(result.watchHistory?.completed || result.courseComplete)
      if (completed && !completionAnnouncedRef.current) {
        completionAnnouncedRef.current = true
        toast.success('ผ่านเกณฑ์การเรียนวิดีโอแล้ว', {
          description: 'ระบบตรวจสอบเวลาเรียนและบันทึกความก้าวหน้าเรียบร้อย',
        })
      }
      return completed
    } catch (error) {
      console.error('Failed to save secure video progress:', error)
      toast.error('บันทึกความก้าวหน้าไม่สำเร็จ', {
        description: 'ระบบจะลองบันทึกอีกครั้งเมื่อเรียนต่อ',
      })
      return false
    }
  }

  return (
    <div className="space-y-4">
      {isFinalExam && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <p className="text-sm text-yellow-800">⚠️ <strong>สอบไฟนอล:</strong> ระบบจะออกใบรับรองเมื่อเวลาเรียนและเงื่อนไขทั้งหมดผ่านการตรวจสอบจากเซิร์ฟเวอร์</p>
        </div>
      )}
      <SecureVideoPlayer
        youtubeId={youtubeId}
        onHeartbeat={handleHeartbeat}
        initialWatchedTime={initialProgress}
        initialCompleted={initialCompleted}
        requiredWatchPercentage={requiredWatchPercentage}
      />
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>🔒 ป้องกันการข้ามวิดีโอและบังคับความเร็ว 1x</span>
        <span>เวลาเรียนจะหยุดเมื่อออกจากหน้าจอ</span>
      </div>
    </div>
  )
}
