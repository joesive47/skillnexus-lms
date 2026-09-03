'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Lock, Unlock, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import Link from 'next/link'

interface QuizPrerequisiteStatus {
  canAccess: boolean
  reason?: string
  prerequisiteQuiz?: {
    id: string
    title: string
    requiredScore: number
    userBestScore: number | null
  }
  message: string
}

interface QuizLockStatusProps {
  quizId: string
  quizTitle: string
  quizPassScore: number
  onStatusChecked?: (canAccess: boolean) => void
}

export function QuizLockStatus({ 
  quizId, 
  quizTitle, 
  quizPassScore,
  onStatusChecked 
}: QuizLockStatusProps) {
  const [status, setStatus] = useState<QuizPrerequisiteStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkPrerequisite()
  }, [quizId])

  async function checkPrerequisite() {
    try {
      setLoading(true)
      const response = await fetch(`/api/quiz/${quizId}/check-prerequisite`)
      
      if (!response.ok) {
        throw new Error('Failed to check prerequisite')
      }

      const data = await response.json()
      setStatus(data)
      onStatusChecked?.(data.canAccess)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span>กำลังตรวจสอบเงื่อนไข...</span>
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

  // ✅ สามารถเข้าทำได้
  if (status.canAccess) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-900">พร้อมทำแบบทดสอบ</AlertTitle>
        <AlertDescription className="text-green-800">
          {status.prerequisiteQuiz ? (
            <span>
              ✅ คุณผ่านแบบทดสอบ <strong>"{status.prerequisiteQuiz.title}"</strong> แล้ว 
              (คะแนน: {status.prerequisiteQuiz.userBestScore}%)
            </span>
          ) : (
            <span>คุณสามารถเริ่มทำแบบทดสอบนี้ได้เลย</span>
          )}
        </AlertDescription>
      </Alert>
    )
  }

  // 🔒 ล็อคอยู่
  return (
    <Alert variant="destructive" className="border-yellow-400 bg-yellow-50">
      <Lock className="h-4 w-4 text-yellow-700" />
      <AlertTitle className="text-yellow-900">
        แบบทดสอบนี้ถูกล็อค
      </AlertTitle>
      <AlertDescription className="space-y-3">
        <p className="text-yellow-800">
          {status.message}
        </p>
        
        {status.prerequisiteQuiz && (
          <div className="mt-3 rounded-md bg-white p-3 border border-yellow-200">
            <p className="text-sm font-medium text-gray-900 mb-2">
              📋 ต้องทำแบบทดสอบต่อไปนี้ให้ผ่านก่อน:
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">
                  {status.prerequisiteQuiz.title}
                </p>
                <p className="text-sm text-gray-600">
                  คะแนนขั้นต่ำ: {status.prerequisiteQuiz.requiredScore}%
                </p>
                {status.prerequisiteQuiz.userBestScore !== null && (
                  <p className="text-sm text-red-600">
                    คะแนนสูงสุดของคุณ: {status.prerequisiteQuiz.userBestScore}% 
                    (ต้องเพิ่มอีก {status.prerequisiteQuiz.requiredScore - status.prerequisiteQuiz.userBestScore}%)
                  </p>
                )}
              </div>
              <Link href={`/quiz/${status.prerequisiteQuiz.id}`}>
                <Button size="sm" className="gap-2">
                  ไปทำแบบทดสอบ
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </AlertDescription>
    </Alert>
  )
}
