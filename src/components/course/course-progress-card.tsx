'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { CourseImage } from '@/components/ui/course-image'
import { Play, BookOpen, CheckCircle, Clock } from 'lucide-react'

interface CourseProgressCardProps {
  course: {
    id: string
    title: string
    description: string | null
    imageUrl: string | null
    modules: {
      id: string
      title: string
      lessons: {
        id: string
        title: string | null
        lessonType: string
        watchHistory: {
          completed: boolean
        }[]
      }[]
    }[]
  }
  progress: number
  completedLessons: number
  totalLessons: number
}

export function CourseProgressCard({ 
  course, 
  progress, 
  completedLessons, 
  totalLessons 
}: CourseProgressCardProps) {
  const nextLesson = course.modules
    .flatMap(m => m.lessons)
    .find(l => l.watchHistory.length === 0 || !l.watchHistory[0]?.completed)

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="relative w-16 h-12 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
            {course.imageUrl ? (
              <CourseImage
                src={course.imageUrl}
                alt={course.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg line-clamp-1 mb-1">
              {course.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {course.description || "Continue your learning journey"}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Progress Section */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">
              {completedLessons}/{totalLessons} lessons
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-muted-foreground">
              {progress}% complete
            </span>
            {progress === 100 && (
              <Badge variant="secondary" className="text-xs">
                <CheckCircle className="w-3 h-3 mr-1" />
                Completed
              </Badge>
            )}
          </div>
        </div>

        {/* Next Lesson */}
        {nextLesson && progress < 100 && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Next Lesson</span>
            </div>
            <p className="text-sm text-blue-700 line-clamp-1">
              {nextLesson.title || `Lesson ${nextLesson.id.slice(-4)}`}
            </p>
            <Badge variant="outline" className="text-xs mt-1">
              {nextLesson.lessonType}
            </Badge>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button asChild className="flex-1">
            <Link href={`/courses/${course.id}`}>
              <Play className="w-4 h-4 mr-2" />
              {progress === 0 ? "Start Course" : progress === 100 ? "Review" : "Continue"}
            </Link>
          </Button>
          
          {nextLesson && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/courses/${course.id}/lessons/${nextLesson.id}`}>
                Next
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}