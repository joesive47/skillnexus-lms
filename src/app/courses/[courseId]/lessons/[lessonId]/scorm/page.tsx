import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { ScormFullscreenWrapper } from '@/components/scorm/scorm-fullscreen-wrapper'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface ScormLessonPageProps {
  params: Promise<{
    courseId: string
    lessonId: string
  }>
}

export default async function ScormLessonPage({ params }: ScormLessonPageProps) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  const { courseId, lessonId } = await params

  // Get lesson and SCORM package
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      course: true,
      scormPackage: true
    }
  })

  if (!lesson) {
    redirect('/courses')
  }

  // Check if user is enrolled
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId: lesson.courseId
      }
    }
  })

  if (!enrollment && session.user.role !== 'ADMIN') {
    redirect(`/courses/${courseId}`)
  }

  if (!lesson.scormPackage) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Link href={`/courses/${courseId}`}>
                <ArrowLeft className="w-5 h-5 hover:text-blue-600" />
              </Link>
              <span>SCORM Content Not Available</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              This lesson does not have SCORM content available.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <ScormFullscreenWrapper
      packagePath={lesson.scormPackage.packagePath}
      lessonId={lesson.id}
      userId={session.user.id}
      courseId={courseId}
      lessonTitle={lesson.title || 'Untitled Lesson'}
      courseTitle={lesson.course.title || 'Untitled Course'}
    />
  )
}