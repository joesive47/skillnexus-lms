import { getCourse } from '@/app/actions/course'
import { CourseForm } from '@/components/course/course-form'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, Video, FileQuestion, Package, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import prisma from '@/lib/prisma'

interface EditCoursePageProps {
  params: Promise<{
    courseId: string
  }>
}

export default async function EditCoursePage({ params }: EditCoursePageProps) {
  const { courseId } = await params
  const result = await getCourse(courseId)
  
  if (!result.success || !result.course) {
    notFound()
  }

  // Get lessons for this course
  const lessons = await prisma.lesson.findMany({
    where: { courseId },
    include: {
      quiz: true,
      scormPackage: true
    },
    orderBy: { order: 'asc' }
  })

  const getLessonIcon = (lesson: any) => {
    if (lesson.scormPackage) return <Package className="w-4 h-4" />
    if (lesson.quiz) return <FileQuestion className="w-4 h-4" />
    if (lesson.youtubeUrl) return <Video className="w-4 h-4" />
    return <BookOpen className="w-4 h-4" />
  }

  const getLessonType = (lesson: any) => {
    if (lesson.scormPackage) return 'SCORM'
    if (lesson.quiz) return 'Quiz'
    if (lesson.youtubeUrl) return 'Video'
    return 'Content'
  }

  return (
    <div className="p-6 space-y-6">
      {/* Existing Lessons */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>บทเรียนในหลักสูตร ({lessons.length})</span>
            <Link href={`/dashboard/admin/courses/${courseId}/lessons/new`}>
              <Button size="sm">
                <BookOpen className="w-4 h-4 mr-2" />
                เพิ่มบทเรียน
              </Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {lessons.length > 0 ? (
            <div className="space-y-3">
              {lessons.map((lesson, index) => (
                <div key={lesson.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {getLessonIcon(lesson)}
                        <h4 className="font-semibold">{lesson.title || 'Untitled Lesson'}</h4>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{getLessonType(lesson)}</Badge>
                        {lesson.duration && (
                          <span className="text-sm text-gray-500">{lesson.duration} นาที</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/admin/courses/${courseId}/lessons/${lesson.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        แก้ไข
                      </Button>
                    </Link>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>ยังไม่มีบทเรียนในหลักสูตรนี้</p>
              <Link href={`/dashboard/admin/courses/${courseId}/lessons/new`}>
                <Button className="mt-4">
                  เพิ่มบทเรียนแรก
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Course Edit Form */}
      <CourseForm course={result.course} mode="edit" />
    </div>
  )
}