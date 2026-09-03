'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Clock, AlertCircle, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import { CountdownTimer } from './countdown-timer'

interface QuizRetryStatus {
  canRetry: boolean
  reason?: string
  remainingSeconds?: number
  remainingMinutes?: number
  remainingSecondsDisplay?: number
  nextAvailableTime?: string
  lastAttempt?: {
    score: number
    passed: boolean
    submittedAt: string
    attemptNumber: number
  }
  quiz?: {
    title: string
    retryDelayMinutes: number
    passScore: number
  }
  message: string
}

interface QuizRetryStatusProps {
  quizId: string
  quizTitle: string
  onStatusChecked?: (canRetry: boolean) => void
  onRetryReady?: () => void
}

export function QuizRetryStatus({ 
  quizId, 
  quizTitle,
  onStatusChecked,
  onRetryReady
}: QuizRetryStatusProps) {
  const [status, setStatus] = useState<QuizRetryStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkRetryStatus()
  }, [quizId])

  async function checkRetryStatus() {
    try {
      setLoading(true)
      const response = await fetch(`/api/quiz/${quizId}/check-retry`)
      
      if (!response.ok) {
        throw new Error('Failed to check retry status')
      }

      const data = await response.json()
      setStatus(data)
      onStatusChecked?.(data.canRetry)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  const handleCountdownComplete = () => {
    onRetryReady?.()
    checkRetryStatus() // Refresh status
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span>กำลังตรวจสอบสถานะ...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>เกิดข้อผิดพลาด</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!status) return null

  // ✅ สามารถทำได้
  if (status.canRetry) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-900">พร้อมทำแบบทดสอบ</AlertTitle>
        <AlertDescription className="text-green-800">
          {status.lastAttempt ? (
            <div className="space-y-2">
              <p>
                ครั้งที่แล้ว: คะแนน {status.lastAttempt.score}% 
                {status.lastAttempt.passed ? (
                  <Badge className="ml-2 bg-green-600">ผ่าน</Badge>
                ) : (
                  <Badge variant="destructive" className="ml-2">ไม่ผ่าน</Badge>
                )}
              </p>
              <p className="text-sm">
                ทำครั้งที่ {status.lastAttempt.attemptNumber + 1} • 
                คะแนนขั้นต่ำ: {status.quiz?.passScore}%
              </p>
            </div>
          ) : (
            <p>คุณสามารถเริ่มทำแบบทดสอบได้เลย</p>
          )}
        </AlertDescription>
      </Alert>
    )
  }

  // ⏰ ต้องรอ cooldown
  if (status.reason === 'cooldown_active' && status.remainingSeconds) {
    return (
      <Alert className="border-orange-200 bg-orange-50">
        <Clock className="h-4 w-4 text-orange-600" />
        <AlertTitle className="text-orange-900">
          กรุณารอก่อนทำแบบทดสอบใหม่
        </AlertTitle>
        <AlertDescription className="space-y-4">
          <div className="text-orange-800">
            <p className="mb-2">
              คุณทำแบบทดสอบครั้งที่แล้วไม่ผ่าน (คะแนน: {status.lastAttempt?.score}%)
            </p>
            <p className="text-sm">
              ต้องรออีก <strong>{status.quiz?.retryDelayMinutes} นาที</strong> ก่อนทำใหม่
            </p>
          </div>

          <div className="rounded-md bg-white p-4 border border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                เวลาที่เหลือ:
              </span>
              <CountdownTimer
                targetSeconds={status.remainingSeconds}
                onComplete={handleCountdownComplete}
                autoRefresh={true}
              />
            </div>
            
            <div className="text-xs text-gray-500 mt-2">
              พร้อมทำใหม่เวลา: {status.nextAvailableTime ? 
                new Date(status.nextAvailableTime).toLocaleString('th-TH', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                }) : 'N/A'
              }
            </div>
          </div>

          <div className="flex items-start gap-2 text-sm text-orange-700 bg-orange-100 p-3 rounded-md">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">เคล็ดลับในการสอบ:</p>
              <ul className="list-disc list-inside mt-1 space-y-1 text-xs">
                <li>อ่านโจทย์ให้ละเอียด</li>
                <li>ทบทวนเนื้อหาที่ยังไม่เข้าใจ</li>
                <li>คะแนนขั้นต่ำที่ต้องได้: {status.quiz?.passScore}%</li>
              </ul>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={checkRetryStatus}
            className="w-full gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            ตรวจสอบสถานะอีกครั้ง
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return null
}
