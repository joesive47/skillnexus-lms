import { getCourse } from '@/app/actions/course'
import { CourseForm } from '@/components/course/course-form'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CourseImage } from '@/components/ui/course-image'
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

  // Get lessons for this course with all fields
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
      {/* Course Header with Cover Image */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Course Cover Image */}
            <div className="lg:col-span-1">
              <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                <CourseImage
                  src={result.course.imageUrl}
                  alt={result.course.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">สถานะ:</span>
                  <Badge variant={result.course.published ? "default" : "secondary"}>
                    {result.course.published ? "เผยแพร่แล้ว" : "แบบร่าง"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">ราคา:</span>
                  <span className="font-semibold">
                    {result.course.price === 0 ? "ฟรี" : `฿${result.course.price.toLocaleString('th-TH')}`}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Course Info */}
            <div className="lg:col-span-2">
              <h1 className="text-2xl font-bold mb-2">{result.course.title}</h1>
              <p className="text-gray-600 mb-4">
                {result.course.description || "ไม่มีคำอธิบาย"}
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">จำนวนบทเรียน:</span>
                  <span className="ml-2 font-semibold">{lessons.length} บท</span>
                </div>
                <div>
                  <span className="text-gray-600">สร้างเมื่อ:</span>
                  <span className="ml-2 font-semibold">
                    {new Date(result.course.createdAt).toLocaleDateString('th-TH')}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">อัปเดตล่าสุด:</span>
                  <span className="ml-2 font-semibold">
                    {new Date(result.course.updatedAt).toLocaleDateString('th-TH')}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Course ID:</span>
                  <span className="ml-2 font-mono text-xs">{result.course.id}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge variant="outline">{getLessonType(lesson)}</Badge>
                        {lesson.duration && (
                          <span className="text-sm text-gray-500">{lesson.duration} นาที</span>
                        )}
                      </div>
                      {/* Show All Lesson Details */}
                      <div className="mt-2 space-y-2">
                        {/* Video URL */}
                        {lesson.youtubeUrl && (
                          <div className="p-2 bg-blue-50 rounded text-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-600">Video URL:</span>
                              <a 
                                href={lesson.youtubeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline truncate max-w-md"
                              >
                                {lesson.youtubeUrl}
                              </a>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2"
                                onClick={() => {
                                  navigator.clipboard.writeText(lesson.youtubeUrl || '')
                                }}
                              >
                                คัดลอก
                              </Button>
                            </div>
                          </div>
                        )}
                        
                        {/* SCORM Package */}
                        {lesson.scormPackage && (
                          <div className="p-2 bg-purple-50 rounded text-xs">
                            <div className="font-medium text-gray-600 mb-1">SCORM Package:</div>
                            <div className="space-y-1 text-gray-700">
                              <div>• เวอร์ชัน: {lesson.scormPackage.version}</div>
                              <div>• Path: {lesson.scormPackage.packagePath}</div>
                              {lesson.scormPackage.title && (
                                <div>• ชื่อ: {lesson.scormPackage.title}</div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Quiz */}
                        {lesson.quiz && (
                          <div className="p-2 bg-green-50 rounded text-xs">
                            <div className="font-medium text-gray-600 mb-1">Quiz:</div>
                            <div className="space-y-1 text-gray-700">
                              <div>• ชื่อ: {lesson.quiz.title}</div>
                              <div>• เวลา: {lesson.quiz.timeLimit || 'ไม่จำกัด'} นาที</div>
                              <div>• สุ่มคำถาม: {lesson.quiz.randomize ? 'ใช่' : 'ไม่'}</div>
                            </div>
                          </div>
                        )}
                        
                        {/* Content */}
                        {lesson.content && (
                          <div className="p-2 bg-yellow-50 rounded text-xs">
                            <span className="font-medium text-gray-600">เนื้อหา:</span>
                            <div className="text-gray-700 mt-1 max-h-20 overflow-y-auto">
                              {lesson.content.substring(0, 200)}{lesson.content.length > 200 ? '...' : ''}
                            </div>
                          </div>
                        )}
                        
                        {/* Metadata */}
                        <div className="p-2 bg-gray-50 rounded text-xs text-gray-500">
                          <div className="flex gap-4">
                            <span>ID: {lesson.id}</span>
                            <span>Order: {lesson.order}</span>
                            <span>สร้าง: {new Date(lesson.createdAt).toLocaleDateString('th-TH')}</span>
                          </div>
                        </div>
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