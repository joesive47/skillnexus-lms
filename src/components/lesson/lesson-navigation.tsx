'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface LessonNavigationProps {
  courseId: string
  currentLessonId: string
  previousLessonId?: string
  nextLessonId?: string
  isNextUnlocked: boolean
}

export function LessonNavigation({
  courseId,
  currentLessonId,
  previousLessonId,
  nextLessonId,
  isNextUnlocked
}: LessonNavigationProps) {
  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t">
      <div>
        {previousLessonId && (
          <Button variant="outline" asChild>
            <Link href={`/courses/${courseId}/lessons/${previousLessonId}`}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous Lesson
            </Link>
          </Button>
        )}
      </div>
      
      <div>
        {nextLessonId && (
          <Button 
            variant={isNextUnlocked ? "default" : "secondary"} 
            disabled={!isNextUnlocked}
            asChild={isNextUnlocked}
          >
            {isNextUnlocked ? (
              <Link href={`/courses/${courseId}/lessons/${nextLessonId}`}>
                Next Lesson
                <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            ) : (
              <>
                Next Lesson (Locked)
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}