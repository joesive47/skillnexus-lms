'use client'

import { useEffect, useState } from 'react'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { CheckCircle, Circle, Clock, Trophy } from 'lucide-react'
import { getCourseProgress } from '@/lib/course-progress'

interface CourseProgressBarProps {
  courseId: string
  showDetails?: boolean
  className?: string
}

export function CourseProgressBar({ 
  courseId, 
  showDetails = false,
  className = '' 
}: CourseProgressBarProps) {
  const [progress, setProgress] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProgress()
  }, [courseId])

  const loadProgress = async () => {
    try {
      const data = await getCourseProgress(courseId)
      setProgress(data)
    } catch (error) {
      console.error('Failed to load progress:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </div>
    )
  }

  if (!progress) return null

  const { progress: stats, finalExam, certificate, lessons } = progress
  const isComplete = stats.isComplete

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Progress Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              ความก้าวหน้า
            </span>
            {isComplete && (
              <Badge className="bg-green-500">
                <Trophy className="w-3 h-3 mr-1" />
                จบแล้ว
              </Badge>
            )}
          </div>
          <span className="text-sm text-gray-600">
            {stats.completedLessons}/{stats.totalLessons} บทเรียน
          </span>
        </div>
        
        <Progress value={stats.percentage} className="h-3" />
        
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-500">
            {stats.percentage}% เสร็จสมบูรณ์
          </span>
          {finalExam && (
            <Badge variant={finalExam.passed ? 'default' : 'outline'} className="text-xs">
              {finalExam.passed ? '✅ สอบไฟนอลผ่าน' : '⏳ รอสอบไฟนอล'}
            </Badge>
          )}
        </div>
      </div>

      {/* Certificate Status */}
      {certificate && (
        <Card className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-yellow-900">
                🎉 คุณได้รับใบรับรองแล้ว!
              </p>
              <p className="text-sm text-yellow-700">
                รหัสยืนยัน: {certificate.verificationCode}
              </p>
            </div>
            <a
              href={`/certificates/${certificate.id}`}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap"
            >
              ดูใบรับรอง
            </a>
          </div>
        </Card>
      )}

      {/* Can Issue Certificate */}
      {!certificate && progress.canIssueCertificate && (
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div className="flex-1">
              <p className="font-medium text-green-900">
                ✅ คุณจบคอร์สแล้ว!
              </p>
              <p className="text-sm text-green-700">
                คลิกเพื่อรับใบรับรอง
              </p>
            </div>
            <a
              href={`/courses/${courseId}/certificate`}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap"
            >
              รับใบรับรอง
            </a>
          </div>
        </Card>
      )}

      {/* Detailed Lesson List (Optional) */}
      {showDetails && lessons && lessons.length > 0 && (
        <div className="space-y-2 mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            รายละเอียดบทเรียน
          </h4>
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {lessons.map((lesson: any, index: number) => (
              <div
                key={lesson.id}
                className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                  lesson.completed 
                    ? 'bg-green-50 hover:bg-green-100' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                {lesson.completed ? (
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                )}
                
                <span className={`text-sm flex-1 ${
                  lesson.completed ? 'text-green-900' : 'text-gray-600'
                }`}>
                  {index + 1}. {lesson.title || 'บทเรียน'}
                </span>

                {lesson.isFinalExam && (
                  <Badge variant="destructive" className="text-xs">
                    Final
                  </Badge>
                )}

                {!lesson.completed && lesson.progressPercent > 0 && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {lesson.progressPercent}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Steps */}
      {!isComplete && stats.percentage > 0 && (
        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
          💡 <strong>สิ่งที่ต้องทำต่อ:</strong>
          <ul className="ml-4 mt-1 space-y-1">
            {stats.completedLessons < stats.totalLessons && (
              <li>• เรียนบทเรียนที่เหลืออีก {stats.totalLessons - stats.completedLessons} บท</li>
            )}
            {finalExam && !finalExam.passed && (
              <li>• ทำสอบไฟนอลให้ผ่าน</li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

export default CourseProgressBar
