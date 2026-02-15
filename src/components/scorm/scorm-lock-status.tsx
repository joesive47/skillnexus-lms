'use client'

import { useState, useEffect } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Lock, Video, CheckCircle, Loader2, PlayCircle } from 'lucide-react'
import Link from 'next/link'

interface ScormLockStatusProps {
  lessonId: string
  courseId: string
  onStatusChecked?: (canAccess: boolean) => void
}

interface ScormUnlockResponse {
  canAccess: boolean
  videoProgress: number
  requiredProgress: number
  watchHistory?: {
    watchTime: number
    totalTime: number
    completed: boolean
  }
  message: string
  lesson?: {
    id: string
    title: string
    courseId: string
    courseTitle: string
  }
  reason?: string
}

export function ScormLockStatus({ lessonId, courseId, onStatusChecked }: ScormLockStatusProps) {
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<ScormUnlockResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const checkScormUnlock = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/lesson/${lessonId}/check-scorm-unlock`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to check SCORM unlock status')
      }

      setStatus(data)
      onStatusChecked?.(data.canAccess)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      onStatusChecked?.(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkScormUnlock()
  }, [lessonId])

  // Loading state
  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>กำลังตรวจสอบสถานะการเข้าถึง SCORM...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Error state
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>เกิดข้อผิดพลาด</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  // No status (shouldn't happen)
  if (!status) {
    return null
  }

  // SCORM is unlocked - show success message
  if (status.canAccess) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <AlertTitle className="text-green-800">
          พร้อมเข้าถึงเนื้อหา SCORM แล้ว! 🎉
        </AlertTitle>
        <AlertDescription className="text-green-700">
          <div className="space-y-2 mt-2">
            <p>{status.message}</p>
            <div className="flex items-center space-x-2">
              <Video className="w-4 h-4" />
              <span className="text-sm">
                คุณได้ดูวิดีโอแล้ว: <strong>{status.videoProgress}%</strong>
              </span>
            </div>
            {status.watchHistory && (
              <div className="text-xs text-green-600 bg-white px-3 py-2 rounded">
                เวลาที่ดู: {Math.round(status.watchHistory.watchTime / 60)} นาที / 
                {Math.round(status.watchHistory.totalTime / 60)} นาที
              </div>
            )}
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  // SCORM is locked - show requirements
  return (
    <Card className="w-full max-w-2xl mx-auto border-orange-200">
      <CardHeader className="bg-orange-50">
        <CardTitle className="flex items-center space-x-2 text-orange-800">
          <Lock className="w-6 h-6" />
          <span>เนื้อหา SCORM ถูกล็อค</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {/* Lock message */}
        <Alert className="border-orange-200 bg-orange-50">
          <Video className="h-5 w-5 text-orange-600" />
          <AlertTitle className="text-orange-800">ต้องดูวิดีโอก่อน</AlertTitle>
          <AlertDescription className="text-orange-700">
            {status.message}
          </AlertDescription>
        </Alert>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">ความคืบหน้าการดูวิดีโอ</span>
            <Badge 
              variant={status.videoProgress >= status.requiredProgress ? "default" : "secondary"}
              className={status.videoProgress >= status.requiredProgress ? "bg-green-600" : "bg-orange-500"}
            >
              {status.videoProgress}% / {status.requiredProgress}%
            </Badge>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${
                status.videoProgress >= status.requiredProgress 
                  ? 'bg-green-600' 
                  : 'bg-orange-500'
              }`}
              style={{ width: `${Math.min(status.videoProgress, 100)}%` }}
            />
          </div>

          {status.watchHistory && status.watchHistory.totalTime > 0 && (
            <p className="text-xs text-gray-500 text-center">
              ดูแล้ว {Math.round(status.watchHistory.watchTime / 60)} นาที จาก{' '}
              {Math.round(status.watchHistory.totalTime / 60)} นาที
            </p>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
          <h4 className="font-semibold text-blue-900 flex items-center space-x-2">
            <PlayCircle className="w-4 h-4" />
            <span>วิธีปลดล็อค SCORM:</span>
          </h4>
          <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
            <li>กลับไปหน้าวิดีโอของบทเรียนนี้</li>
            <li>ดูวิดีโอให้ครบอย่างน้อย {status.requiredProgress}%</li>
            <li>ระบบจะบันทึกความคืบหน้าอัตโนมัติ</li>
            <li>กลับมาหน้านี้อีกครั้งเพื่อเข้าถึงเนื้อหา SCORM</li>
          </ol>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-3 pt-2">
          <Button asChild variant="default" className="flex-1">
            <Link href={`/courses/${courseId}/lessons/${lessonId}`}>
              <Video className="w-4 h-4 mr-2" />
              ไปดูวิดีโอ
            </Link>
          </Button>

          <Button 
            variant="outline" 
            onClick={checkScormUnlock}
            className="flex-1"
          >
            ตรวจสอบอีกครั้ง
          </Button>
        </div>

        <Button asChild variant="ghost" className="w-full">
          <Link href={`/courses/${courseId}`}>
            กลับไปหน้าคอร์ส
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
