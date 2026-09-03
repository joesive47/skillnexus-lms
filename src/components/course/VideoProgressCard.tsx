'use client'

import { Clock, Play, CheckCircle } from 'lucide-react'

interface VideoProgressCardProps {
  lessonTitle: string
  watchedTime: number
  totalTime: number
  isCompleted: boolean
  requiredPercentage?: number
}

export function VideoProgressCard({
  lessonTitle,
  watchedTime,
  totalTime,
  isCompleted,
  requiredPercentage = 80
}: VideoProgressCardProps) {
  const progressPercentage = totalTime > 0 ? (watchedTime / totalTime) * 100 : 0
  const remainingTime = Math.max(0, totalTime - watchedTime)
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2">
          {lessonTitle}
        </h3>
        {isCompleted && (
          <CheckCircle className="text-green-500 flex-shrink-0 ml-2" size={20} />
        )}
      </div>

      {/* Time Information */}
      <div className="flex items-center gap-4 mb-3 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <Clock size={14} />
          <span>{formatTime(watchedTime)} / {formatTime(totalTime)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Play size={14} />
          <span>เหลือ {formatTime(remainingTime)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-gray-600 dark:text-gray-400">
            ความคืบหน้า: {Math.round(progressPercentage)}%
          </span>
          <span className="text-gray-500 dark:text-gray-500">
            ต้องดู {requiredPercentage}%
          </span>
        </div>
        
        <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 relative">
          <div 
            className={`h-full rounded-full transition-all duration-300 ${
              progressPercentage >= requiredPercentage
                ? 'bg-gradient-to-r from-green-500 to-green-400'
                : 'bg-gradient-to-r from-blue-500 to-blue-400'
            }`}
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
          {/* Required threshold marker */}
          <div 
            className="absolute top-0 bg-yellow-400 h-full w-0.5 rounded-full"
            style={{ left: `${requiredPercentage}%` }}
          />
        </div>
      </div>

      {/* Status */}
      <div className="mt-3 flex justify-between items-center">
        <div className="text-xs">
          {progressPercentage >= requiredPercentage ? (
            <span className="text-green-600 dark:text-green-400 font-medium">
              ✓ ผ่านเกณฑ์แล้ว
            </span>
          ) : (
            <span className="text-orange-600 dark:text-orange-400">
              ต้องดูอีก {Math.round(requiredPercentage - progressPercentage)}%
            </span>
          )}
        </div>
        
        {isCompleted && (
          <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
            เสร็จสิ้น
          </span>
        )}
      </div>
    </div>
  )
}