'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
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
  nextLesson?: { href: string; title: string }
}

export function VideoPlayerWrapper({
  youtubeId,
  lessonId,
  courseId,
  initialProgress = 0,
  initialCompleted = false,
  requiredWatchPercentage = 85,
  isFinalExam = false,
  nextLesson,
}: VideoPlayerWrapperProps) {
  const router = useRouter()
  const completionAnnouncedRef = useRef(initialCompleted)
  const [isCompleted, setIsCompleted] = useState(initialCompleted)

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
        setIsCompleted(true)
        toast.success('ผ่านเกณฑ์การเรียนวิดีโอแล้ว', {
          description: 'ระบบตรวจสอบเวลาเรียนและบันทึกความก้าวหน้าเรียบร้อย',
        })
        // Refresh the server-rendered classroom layout once, after the API has
        // confirmed completion. This updates locks and checkmarks immediately
        // without interrupting the learner or requiring a browser refresh.
        window.setTimeout(() => router.refresh(), 0)
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
        <span>ตำแหน่งเรียนบันทึกอัตโนมัติ และหยุดนับเวลาเมื่อออกจากหน้าจอ</span>
      </div>
      {isCompleted && nextLesson && (
        <Link
          href={nextLesson.href}
          className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
        >
          เรียนบทถัดไป: {nextLesson.title}
        </Link>
      )}
    </div>
  )
}
