'use client'

import { Clock, PlayCircle, CheckCircle, TrendingUp } from 'lucide-react'

interface CourseProgressSummaryProps {
  courseName: string
  totalLessons: number
  completedLessons: number
  totalVideoDuration: number
  watchedDuration: number
  completionPercentage: number
  timeProgressPercentage: number
}

export function CourseProgressSummary({
  courseName,
  totalLessons,
  completedLessons,
  totalVideoDuration,
  watchedDuration,
  completionPercentage,
  timeProgressPercentage
}: CourseProgressSummaryProps) {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (hours > 0) {
      return `${hours} ชม. ${minutes} นาที`
    }
    return `${minutes} นาที`
  }

  const remainingTime = Math.max(0, totalVideoDuration - watchedDuration)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          ความคืบหน้าการเรียน
        </h2>
        <TrendingUp className="text-blue-500" size={24} />
      </div>

      <div className="space-y-4">
        {/* Lesson Progress */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-500" size={20} />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                บทเรียนที่เสร็จสิ้น
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {completedLessons} จาก {totalLessons} บทเรียน
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {Math.round(completionPercentage)}%
            </p>
          </div>
        </div>

        {/* Time Progress */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center gap-3">
            <Clock className="text-blue-500" size={20} />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                เวลาที่ดูแล้ว
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {formatDuration(watchedDuration)} จาก {formatDuration(totalVideoDuration)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {Math.round(timeProgressPercentage)}%
            </p>
          </div>
        </div>

        {/* Video Progress */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center gap-3">
            <PlayCircle className="text-purple-500" size={20} />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                เวลาที่เหลือ
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                อีก {formatDuration(remainingTime)} จึงจะจบ
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">
              {formatDuration(remainingTime)}
            </p>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">ความคืบหน้ารวม</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {Math.round((completionPercentage + timeProgressPercentage) / 2)}%
            </span>
          </div>
          
          <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.round((completionPercentage + timeProgressPercentage) / 2)}%` }}
            />
          </div>
        </div>

        {/* Status Message */}
        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          {completionPercentage === 100 ? (
            <p className="text-green-600 dark:text-green-400 font-medium">
              🎉 ยินดีด้วย! คุณเรียนจบคอร์สนี้แล้ว
            </p>
          ) : timeProgressPercentage >= 80 ? (
            <p className="text-blue-600 dark:text-blue-400">
              📚 คุณดูวีดีโอครบตามเกณฑ์แล้ว ลองทำแบบทดสอบเพื่อจบบทเรียน
            </p>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              ⏰ ดูวีดีโอต่อไปเพื่อความคืบหน้าที่ดีขึ้น
            </p>
          )}
        </div>
      </div>
    </div>
  )
}