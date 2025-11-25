'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface LessonNavigationProps {
  courseId: string
  currentLessonId: string
  lessons: Array<{
    id: string
    title: string | null
    order: number
  }>
}

export function LessonNavigation({ courseId, currentLessonId, lessons }: LessonNavigationProps) {
  const currentIndex = lessons.findIndex(lesson => lesson.id === currentLessonId)
  const previousLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null

  return (
    <div className="flex justify-between items-center pt-4 border-t">
      <div>
        {previousLesson && (
          <Link href={`/dashboard/admin/courses/${courseId}/classroom?lesson=${previousLesson.id}`}>
            <Button variant="outline" size="sm">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous: {previousLesson.title || `Lesson ${previousLesson.order}`}
            </Button>
          </Link>
        )}
      </div>
      
      <div className="text-sm text-muted-foreground">
        Lesson {currentIndex + 1} of {lessons.length}
      </div>
      
      <div>
        {nextLesson && (
          <Link href={`/dashboard/admin/courses/${courseId}/classroom?lesson=${nextLesson.id}`}>
            <Button variant="outline" size="sm">
              Next: {nextLesson.title || `Lesson ${nextLesson.order}`}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}