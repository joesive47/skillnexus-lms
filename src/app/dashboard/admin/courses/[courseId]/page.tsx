import { getCourse } from '@/app/actions/course'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Edit, ArrowLeft, Play, FileText, Gamepad2, Package } from 'lucide-react'
import { notFound } from 'next/navigation'
import InteractiveResultsDashboard from '@/components/admin/InteractiveResultsDashboard'

interface CourseDetailPageProps {
  params: Promise<{
    courseId: string
  }>
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { courseId } = await params
  const result = await getCourse(courseId)
  
  if (!result.success || !result.course) {
    notFound()
  }

  const course = result.course

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/admin/courses">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{course.title}</h1>
        <Badge variant={course.published ? "default" : "secondary"}>
          {course.published ? "Published" : "Draft"}
        </Badge>
      </div>

      <div className="grid gap-6">
        {/* Course Info */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Course Information</CardTitle>
                <p className="text-muted-foreground mt-2">{course.description}</p>
              </div>
              <Link href={`/dashboard/admin/courses/${course.id}/edit`}>
                <Button>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Course
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium">Price:</span>
                <p>${course.price || 0}</p>
              </div>
              <div>
                <span className="font-medium">Lessons:</span>
                <p>{course._count.lessons || 0}</p>
              </div>
              <div>
                <span className="font-medium">Students:</span>
                <p>{course._count.enrollments}</p>
              </div>
              <div>
                <span className="font-medium">Status:</span>
                <p>{course.published ? "Published" : "Draft"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lessons */}
        <Card>
          <CardHeader>
            <CardTitle>Lessons ({course.lessons?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {course.lessons && course.lessons.length > 0 ? (
              <div className="space-y-3">
                {course.lessons.map((lesson, index) => (
                  <div key={lesson.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {lesson.order}
                      </span>
                      <div className="flex items-center gap-2">
                        {lesson.lessonType === 'VIDEO' ? (
                          <Play className="w-4 h-4 text-blue-500" />
                        ) : lesson.lessonType === 'INTERACTIVE' ? (
                          <Gamepad2 className="w-4 h-4 text-purple-500" />
                        ) : lesson.lessonType === 'SCORM' ? (
                          <Package className="w-4 h-4 text-orange-500" />
                        ) : (
                          <FileText className="w-4 h-4 text-green-500" />
                        )}
                        <div>
                          <p className="font-medium">{lesson.title || 'Untitled Lesson'}</p>
                          <p className="text-sm text-muted-foreground">
                            {lesson.lessonType} • {lesson.duration ? `${Math.round(lesson.duration / 60)} min` : 'No duration'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {lesson.lessonType === 'VIDEO' && lesson.youtubeUrl && (
                        <Badge variant="outline">YouTube</Badge>
                      )}
                      {lesson.lessonType === 'INTERACTIVE' && lesson.launchUrl && (
                        <Badge variant="outline">Interactive</Badge>
                      )}
                      {lesson.lessonType === 'QUIZ' && lesson.quizId && (
                        <Badge variant="outline">Quiz</Badge>
                      )}
                      {lesson.lessonType === 'SCORM' && (
                        <Badge variant={lesson.scormPackage ? "default" : "destructive"}>
                          {lesson.scormPackage ? "SCORM Ready" : "No Package"}
                        </Badge>
                      )}
                      <span className="text-sm text-muted-foreground">
                        {lesson.requiredCompletionPercentage}% required
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No lessons found</p>
                <Link href={`/dashboard/admin/courses/${course.id}/edit`} className="mt-2 inline-block">
                  <Button variant="outline">Add Lessons</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* SCORM Management */}
        {course.lessons?.some(lesson => lesson.lessonType === 'SCORM') && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>SCORM Management</span>
                <Link href={`/dashboard/admin/courses/${course.id}/scorm`}>
                  <Button variant="outline" size="sm">
                    <Package className="w-4 h-4 mr-2" />
                    Manage SCORM
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center p-3 bg-blue-50 rounded">
                  <div className="font-bold text-blue-600">
                    {course.lessons?.filter(l => l.lessonType === 'SCORM').length || 0}
                  </div>
                  <div className="text-blue-800">SCORM Lessons</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded">
                  <div className="font-bold text-green-600">
                    {course.lessons?.filter(l => l.lessonType === 'SCORM' && l.scormPackage).length || 0}
                  </div>
                  <div className="text-green-800">With Packages</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded">
                  <div className="font-bold text-red-600">
                    {course.lessons?.filter(l => l.lessonType === 'SCORM' && !l.scormPackage).length || 0}
                  </div>
                  <div className="text-red-800">Missing Packages</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Interactive Results Dashboard */}
        {course.lessons?.some(lesson => lesson.lessonType === 'INTERACTIVE') && (
          <Card>
            <CardHeader>
              <CardTitle>Interactive Lessons Results</CardTitle>
            </CardHeader>
            <CardContent>
              <InteractiveResultsDashboard courseId={course.id} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}