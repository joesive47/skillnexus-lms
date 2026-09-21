'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

interface CourseProgressCardProps {
  totalLessons: number
  completedLessons: number
  totalVideoDuration?: number
  watchedDuration?: number
  courseName: string
  progressPercentage?: number
}

export function CourseProgressCard({
  totalLessons,
  completedLessons,
  totalVideoDuration = 0,
  watchedDuration = 0,
  courseName,
  progressPercentage,
}: CourseProgressCardProps) {
  const completionPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0
  const displayedProgress = progressPercentage ?? completionPercentage
  const watchPercentage = totalVideoDuration > 0 ? (watchedDuration / totalVideoDuration) * 100 : 0

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (hours > 0) {
      return `${hours}ชม ${minutes}นาที`
    }
    return `${minutes}นาที`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>ความคืบหน้าการเรียน</span>
          <Badge variant={displayedProgress === 100 ? "default" : "secondary"}>
            {displayedProgress.toFixed(0)}%
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>บทเรียนที่เสร็จสิ้น</span>
            <span>{completedLessons}/{totalLessons} บทเรียน</span>
          </div>
          <Progress value={displayedProgress} className="h-2" />
        </div>

        {totalVideoDuration > 0 && (
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>เวลาที่ดูแล้ว</span>
              <span>{formatDuration(watchedDuration)}/{formatDuration(totalVideoDuration)}</span>
            </div>
            <Progress value={watchPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {watchPercentage.toFixed(1)}% ของเวลาทั้งหมด
            </p>
          </div>
        )}

        {displayedProgress === 100 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-green-800 text-sm font-medium">
              🎉 ยินดีด้วย! คุณเรียนจบคอร์ส "{courseName}" แล้ว
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
