'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, Clock, Award } from 'lucide-react'

interface ProgressIndicatorProps {
  nodeId: string
  nodeType: 'VIDEO' | 'SCORM' | 'QUIZ'
  currentProgress: number
  requiredProgress?: number
  score?: number | null
  requiredScore?: number | null
  timeSpent?: number
  status?: string
}

export function ProgressIndicator({
  nodeId,
  nodeType,
  currentProgress,
  requiredProgress = 80,
  score,
  requiredScore,
  timeSpent = 0,
  status
}: ProgressIndicatorProps) {
  const [localProgress, setLocalProgress] = useState(currentProgress)

  useEffect(() => {
    setLocalProgress(currentProgress)
  }, [currentProgress])

  const isCompleted = localProgress >= requiredProgress
  const progressColor = isCompleted ? 'bg-green-600' : 'bg-blue-600'

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Card className="border-l-4" style={{ borderLeftColor: isCompleted ? '#16a34a' : '#2563eb' }}>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">ความคืบหน้า</span>
              <span className="text-sm font-bold text-blue-600">
                {Math.round(localProgress)}%
              </span>
            </div>
            <div className="relative">
              <Progress value={localProgress} className="h-3" />
              {requiredProgress < 100 && (
                <div
                  className="absolute top-0 h-3 w-0.5 bg-yellow-500"
                  style={{ left: `${requiredProgress}%` }}
                  title={`ต้องการอย่างน้อย ${requiredProgress}%`}
                />
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              ต้องการ {requiredProgress}% เพื่อผ่าน
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            {/* Time Spent */}
            {timeSpent > 0 && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground text-xs">เวลาที่ใช้</p>
                  <p className="font-medium">{formatTime(timeSpent)}</p>
                </div>
              </div>
            )}

            {/* Score for QUIZ */}
            {nodeType === 'QUIZ' && score !== null && score !== undefined && (
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground text-xs">คะแนน</p>
                  <p className="font-medium">{Math.round(score)}%</p>
                </div>
              </div>
            )}

            {/* Status */}
            <div className="flex items-center gap-2">
              {isCompleted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-muted-foreground text-xs">สถานะ</p>
                    <p className="font-medium text-green-600">เสร็จสมบูรณ์</p>
                  </div>
                </>
              ) : (
                <>
                  <Award className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-muted-foreground text-xs">สถานะ</p>
                    <p className="font-medium text-blue-600">กำลังเรียน</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Type-specific Info */}
          {nodeType === 'VIDEO' && (
            <p className="text-xs text-muted-foreground bg-blue-50 p-2 rounded">
              💡 ต้องดูวิดีโออย่างน้อย {requiredProgress}% ของความยาวทั้งหมด
            </p>
          )}

          {nodeType === 'SCORM' && (
            <p className="text-xs text-muted-foreground bg-purple-50 p-2 rounded">
              💡 ต้องทำกิจกรรมให้เสร็จสมบูรณ์และผ่านเกณฑ์
            </p>
          )}

          {nodeType === 'QUIZ' && (
            <p className="text-xs text-muted-foreground bg-orange-50 p-2 rounded">
              💡 ต้องได้คะแนนอย่างน้อย {requiredScore || requiredProgress}% เพื่อผ่าน
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
