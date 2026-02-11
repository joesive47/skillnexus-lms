'use client'

import { useEffect, useState } from 'react'
import { VideoPlayer } from './VideoPlayer'
import { updateLessonProgress } from '@/lib/course-progress'
import { toast } from 'sonner'
import { addNotification } from '@/components/notifications/notification-center'

interface VideoPlayerWrapperProps {
  youtubeId: string
  lessonId: string
  courseId: string
  userId: string
  initialProgress?: number
  requiredWatchPercentage?: number
  isFinalExam?: boolean
}

export function VideoPlayerWrapper({
  youtubeId,
  lessonId,
  courseId,
  userId,
  initialProgress = 0,
  requiredWatchPercentage = 85,
  isFinalExam = false
}: VideoPlayerWrapperProps) {
  const [lastSavedTime, setLastSavedTime] = useState(0)
  const [certificateIssued, setCertificateIssued] = useState(false)

  // Auto-save progress every 30 seconds
  const handleProgress = async (watchedTime: number, totalTime: number) => {
    try {
      // Only save if 30 seconds have passed since last save
      if (Math.abs(watchedTime - lastSavedTime) >= 30) {
        await updateLessonProgress(courseId, lessonId, {
          watchTime: watchedTime,
          totalTime: totalTime,
          completed: false
        })
        setLastSavedTime(watchedTime)
      }
    } catch (error) {
      console.error('Failed to save progress:', error)
    }
  }

  // Mark as complete when video ends
  const handleComplete = async (watchedTime: number, totalTime: number) => {
    try {
      const result = await updateLessonProgress(courseId, lessonId, {
        watchTime: totalTime,
        totalTime: totalTime,
        completed: true
      })

      // Show success message
      toast.success('บันทึกความก้าวหน้าสำเร็จ', {
        description: result.message,
      })

      // Check if certificate was issued (for final exam)
      if (result.courseComplete && result.certificate && !certificateIssued) {
        setCertificateIssued(true)
        const certificateId = result.certificate.id
        
        // Show certificate notification with toast
        toast.success('ยินดีด้วย! คุณได้รับใบรับรอง', {
          description: 'คลิกเพื่อดูใบรับรอง',
          action: {
            label: 'ดูใบรับรอง',
            onClick: () => {
              window.location.href = `/certificates/${certificateId}`
            }
          },
          duration: 10000,
        })

        // Add to notification center
        addNotification({
          type: 'certificate',
          title: 'ยินดีด้วย! คุณได้รับใบรับรอง',
          message: `คุณได้รับใบรับรองสำหรับคอร์สนี้แล้ว`,
          link: `/certificates/${certificateId}`,
          linkText: 'ดูใบรับรอง'
        })
      }
    } catch (error) {
      console.error('Failed to mark as complete:', error)
      toast.error('เกิดข้อผิดพลาด', {
        description: 'ไม่สามารถบันทึกความก้าวหน้าได้'
      })
    }
  }

  return (
    <div className="space-y-4">
      {isFinalExam && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            ⚠️ <strong>สอบไฟนอล:</strong> เมื่อคุณดูวิดีโอนี้จบและผ่านเกณฑ์ ระบบจะออกใบรับรองให้อัตโนมัติ
          </p>
        </div>
      )}
      
      <VideoPlayer
        youtubeId={youtubeId}
        onProgress={handleProgress}
        onComplete={handleComplete}
        initialWatchedTime={initialProgress}
        requiredWatchPercentage={requiredWatchPercentage}
      />
    </div>
  )
}