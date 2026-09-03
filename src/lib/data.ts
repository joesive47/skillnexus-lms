import prisma from './prisma'
import { auth } from '@/auth'
import { extractYouTubeID } from './youtube'
// import { withCache } from './redis' // Disabled for now
import { PerformanceMonitor } from './performance'
import { safeArray, safeMap } from './safe-array'

export interface OutlineRes {
  course: {
    id: string
    title: string
    description: string
  }
  sections: {
    id: string
    title: string
    order: number
    lessons: {
      id: string
      title: string
      type: 'VIDEO' | 'QUIZ' | 'SCORM' | 'INTERACTIVE'
      order: number
      youtubeId?: string
      isLocked: boolean
      isCompleted: boolean
      progress: number
    }[]
  }[]
}

export async function getCourseOutline(courseId: string): Promise<OutlineRes | null> {
  const timer = PerformanceMonitor.startTimer('getCourseOutline')
  const session = await auth()
  if (!session?.user?.id) return null

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        orderBy: { order: 'asc' },
        include: {
          lessons: {
            orderBy: { order: 'asc' },
            include: {
              watchHistory: {
                where: { userId: session.user.id },
                select: { watchTime: true, completed: true }
              }
            }
          }
        }
      }
    }
  })

  if (!course) return null

  // Ensure modules is an array and handle potential null/undefined
  const modules = safeArray(course?.modules || [])
  
  // Calculate lock status based on sequential completion
  let allLessons: any[] = []
  try {
    modules.forEach((module: any) => {
      if (module && module.lessons) {
        const lessons = safeArray(module.lessons)
        lessons.forEach((lesson: any) => {
          if (lesson && lesson.id) {
            allLessons.push({ ...lesson, moduleId: module.id })
          }
        })
      }
    })
    allLessons.sort((a, b) => (a.order || 0) - (b.order || 0))
  } catch (error) {
    console.error('Error processing lessons:', error)
    allLessons = []
  }

  const result = {
    course: {
      id: course?.id || '',
      title: course?.title || 'Untitled Course',
      description: course?.description || ''
    },
    sections: safeMap<any, any>(modules, (module: any) => {
      if (!module || !module.id) {
        return null
      }
      
      return {
        id: module.id,
        title: module.title || 'Untitled Module',
        order: module.order || 0,
        lessons: safeMap<any, any>(module.lessons || [], (lesson: any, index) => {
          if (!lesson || !lesson.id) {
            return null
          }
          
          const globalIndex = allLessons.findIndex(l => l && l.id === lesson.id)
          const prevLesson = globalIndex > 0 ? allLessons[globalIndex - 1] : null
          const watchHistoryArray = safeArray(lesson.watchHistory || [])
          const watchHistory = watchHistoryArray.length > 0 ? watchHistoryArray[0] : {}
          
          return {
            id: lesson.id,
            title: lesson.title || `Lesson ${lesson.order || index + 1}`,
            type: (lesson.lessonType as 'VIDEO' | 'QUIZ' | 'SCORM' | 'INTERACTIVE') || 'VIDEO',
            order: lesson.order || index,
            youtubeId: extractYouTubeID(lesson.youtubeUrl || '') || undefined,
            isLocked: globalIndex > 0 && (!prevLesson?.watchHistory?.[0]?.completed),
            isCompleted: (watchHistory as any)?.completed || false,
            progress: (watchHistory as any)?.watchTime || 0
          }
        }).filter(Boolean)
      }
    }).filter(Boolean)
  }
  
  timer()
  return result
}