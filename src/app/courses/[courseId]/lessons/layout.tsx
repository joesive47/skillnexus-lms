import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { SidebarNav } from '@/components/classroom/sidebar-nav'
import { TopBar } from '@/components/classroom/top-bar'
import { redirect } from 'next/navigation'
import { extractYouTubeID } from '@/lib/youtube'

interface ClassroomLayoutProps {
  children: React.ReactNode
  params: Promise<{ courseId: string }>
}

export default async function ClassroomLayout({ children, params }: ClassroomLayoutProps) {
  const { courseId } = await params
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect('/login')
  }

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
  
  if (!course) {
    redirect('/dashboard')
  }

  // Get lessons without modules
  const lessonsWithoutModule = await prisma.lesson.findMany({
    where: { 
      courseId: courseId,
      moduleId: null
    },
    orderBy: { order: 'asc' },
    include: {
      watchHistory: {
        where: { userId: session.user.id },
        select: { watchTime: true, completed: true }
      }
    }
  })

  // Transform modules
  const sections = course.modules.map(module => ({
    id: module.id,
    title: module.title,
    order: module.order,
    lessons: module.lessons.map((lesson) => {
      const watchHistory = lesson.watchHistory[0]
      
      return {
        id: lesson.id,
        title: lesson.title || `Lesson ${lesson.order}`,
        type: lesson.lessonType as 'VIDEO' | 'QUIZ' | 'SCORM' | 'INTERACTIVE',
        order: lesson.order,
        youtubeId: extractYouTubeID(lesson.youtubeUrl || '') || undefined,
        isLocked: false,
        isCompleted: watchHistory?.completed || false,
        progress: watchHistory?.watchTime || 0
      }
    })
  }))

  // Add lessons without modules
  if (lessonsWithoutModule.length > 0) {
    sections.push({
      id: 'no-module',
      title: 'Course Lessons',
      order: 999,
      lessons: lessonsWithoutModule.map((lesson) => {
        const watchHistory = lesson.watchHistory[0]
        
        return {
          id: lesson.id,
          title: lesson.title || `Lesson ${lesson.order}`,
          type: lesson.lessonType as 'VIDEO' | 'QUIZ' | 'SCORM' | 'INTERACTIVE',
          order: lesson.order,
          youtubeId: extractYouTubeID(lesson.youtubeUrl || '') || undefined,
          isLocked: false,
          isCompleted: watchHistory?.completed || false,
          progress: watchHistory?.watchTime || 0
        }
      })
    })
  }

  const outline = {
    course: {
      id: course.id,
      title: course.title,
      description: course.description || ''
    },
    sections: sections
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-80 lg:flex-col lg:border-r">
        <SidebarNav outline={outline} courseId={courseId} />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar course={outline.course} courseId={courseId} />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}