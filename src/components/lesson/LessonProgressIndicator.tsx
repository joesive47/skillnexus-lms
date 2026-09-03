'use client'

import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface LessonProgressIndicatorProps {
  lessonType: string
  isCompleted: boolean
  watchProgress?: number
  requiredProgress?: number
}

export function LessonProgressIndicator({
  lessonType,
  isCompleted,
  watchProgress = 0,
  requiredProgress = 80
}: LessonProgressIndicatorProps) {
  const getStatusColor = () => {
    if (isCompleted) return 'bg-green-500'
    if (watchProgress >= requiredProgress) return 'bg-blue-500'
    if (watchProgress > 0) return 'bg-yellow-500'
    return 'bg-gray-300'
  }

  const getStatusText = () => {
    if (isCompleted) return 'เสร็จสิ้น'
    if (watchProgress >= requiredProgress) return 'ครบเกณฑ์'
    if (watchProgress > 0) return `${watchProgress.toFixed(0)}%`
    return 'ยังไม่เริ่ม'
  }

  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
      
      {lessonType === 'VIDEO' && watchProgress > 0 && !isCompleted && (
        <div className="flex-1 min-w-0">
          <Progress value={watchProgress} className="h-1" />
        </div>
      )}
      
      <Badge 
        variant={isCompleted ? "default" : watchProgress > 0 ? "secondary" : "outline"}
        className="text-xs"
      >
        {getStatusText()}
      </Badge>
    </div>
  )
}