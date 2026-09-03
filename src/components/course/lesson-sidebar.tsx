import prisma from '@/lib/prisma'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Lock, CheckCircle, PlayCircle, Clock } from 'lucide-react'
import { safeArray } from '@/lib/safe-array'

interface LessonNavigationSidebarProps {
  course: {
    id: string
    title: string
    modules: {
      id: string
      title: string
      lessons: {
        id: string
        title: string | null
        order: number
        lessonType: string
        isFinalExam: boolean
        watchHistory: {
          completed: boolean
          watchTime: number
        }[]
      }[]
    }[]
  }
  courseId: string
  userId: string
}

async function getUserRole(userId: string): Promise<string | null> {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    return user?.role ?? null
  } catch (error) {
    console.error('Error fetching user role:', error)
    return null
  }
}

async function getFirstLesson(courseId: string): Promise<string | null> {
  try {
    const firstLesson = await prisma.lesson.findFirst({
      where: { courseId },
      orderBy: { order: 'asc' }
    })
    return firstLesson?.id ?? null
  } catch (error) {
    console.error('Error fetching first lesson:', error)
    return null
  }
}

function isLessonUnlocked(lesson: any, userRole: string | null, firstLessonId: string | null, allLessons: any[]) {
  // Admin/teacher can access all lessons
  if (userRole === 'ADMIN' || userRole === 'TEACHER') {
    return true
  }

  // First lesson is always unlocked
  if (lesson.id === firstLessonId) {
    return true
  }

  // Check if user has watch history for this lesson
  if (lesson.watchHistory && lesson.watchHistory.length > 0) {
    return true
  }

  // Check if previous lesson is completed (sequential unlock)
  const currentIndex = allLessons.findIndex(l => l.id === lesson.id)
  if (currentIndex > 0) {
    const prevLesson = allLessons[currentIndex - 1]
    return prevLesson.watchHistory?.some((wh: any) => wh.completed) || false
  }

  return false
}

export async function LessonNavigationSidebar({ 
  course, 
  courseId, 
  userId 
}: LessonNavigationSidebarProps) {
  // Pre-fetch data to avoid async operations in render
  const userRole = await getUserRole(userId)
  const firstLessonId = await getFirstLesson(courseId)
  
  // Flatten all lessons for sequential checking
  const allLessons: any[] = []
  const modules = safeArray(course.modules)
  
  modules.forEach((module: any) => {
    const lessons = safeArray(module.lessons)
    lessons.forEach((lesson: any) => {
      allLessons.push({ ...lesson, moduleId: module.id })
    })
  })
  allLessons.sort((a, b) => a.order - b.order)

  return (
    <Card className="h-full rounded-none border-0">
      <CardContent className="p-4">
        <h3 className="font-medium mb-4">Course Content</h3>
        <div className="space-y-4">
          {modules.map((module: any) => {
            const lessons = safeArray(module.lessons)
            
            return (
              <div key={module.id}>
                <h4 className="text-sm font-medium text-muted-foreground mb-3 px-2">
                  {module.title}
                </h4>
                <div className="space-y-1">
                  {lessons.map((lesson: any) => {
                    const watchHistory = safeArray(lesson.watchHistory)
                    const isCompleted = watchHistory.some((wh: any) => wh.completed)
                    const hasProgress = watchHistory.length > 0
                    const firstWatch = watchHistory[0] as { watchTime?: number } | undefined
                    const watchTime = firstWatch?.watchTime || 0
                    const unlocked = isLessonUnlocked(lesson, userRole, firstLessonId ?? null, allLessons)
                    
                    return (
                      <Link
                        key={lesson.id}
                        href={unlocked ? `/courses/${courseId}/lessons/${lesson.id}` : '#'}
                        className={`flex items-center gap-3 p-3 rounded-lg text-sm transition-all duration-200 ${
                          unlocked 
                            ? 'hover:bg-muted cursor-pointer hover:shadow-sm' 
                            : 'cursor-not-allowed opacity-60'
                        } ${isCompleted ? 'bg-green-50 border border-green-200' : ''}`}
                      >
                        <div className="flex-shrink-0">
                          {!unlocked ? (
                            <Lock className="w-4 h-4 text-gray-400" />
                          ) : isCompleted ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : hasProgress ? (
                            <Clock className="w-4 h-4 text-yellow-600" />
                          ) : (
                            <PlayCircle className="w-4 h-4 text-gray-500" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className={`truncate ${isCompleted ? 'font-medium text-green-800' : ''}`}>
                            {lesson.title || `Lesson ${lesson.order}`}
                          </div>
                          
                          <div className="flex items-center gap-2 mt-1">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                lesson.lessonType === 'VIDEO' ? 'border-blue-200 text-blue-700' :
                                lesson.lessonType === 'QUIZ' ? 'border-purple-200 text-purple-700' :
                                lesson.lessonType === 'FINAL_EXAM' ? 'border-red-200 text-red-700' :
                                'border-gray-200 text-gray-700'
                              }`}
                            >
                              {lesson.lessonType}
                            </Badge>
                            
                            {lesson.isFinalExam && (
                              <Badge variant="destructive" className="text-xs">
                                Final Exam
                              </Badge>
                            )}
                          </div>
                          
                          {hasProgress && watchTime > 0 && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Progress: {Math.floor(watchTime)}s
                            </div>
                          )}
                        </div>
                        
                        {isCompleted && (
                          <div className="flex-shrink-0">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          </div>
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}