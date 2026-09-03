import { getCourse } from '@/app/actions/course'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowLeft, FileText, Upload, Play } from 'lucide-react'
import { notFound } from 'next/navigation'
import ScormManager from '@/components/admin/ScormManager'

interface ScormManagementPageProps {
  params: Promise<{
    courseId: string
  }>
}

export default async function ScormManagementPage({ params }: ScormManagementPageProps) {
  const { courseId } = await params
  const result = await getCourse(courseId)
  
  if (!result.success || !result.course) {
    notFound()
  }

  const course = result.course
  const scormLessons = course.lessons?.filter(lesson => lesson.lessonType === 'SCORM') || []

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/dashboard/admin/courses/${courseId}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Course
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">SCORM Management</h1>
        <Badge variant="outline">{course.title}</Badge>
      </div>

      <div className="space-y-6">
        {/* Course Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>SCORM Lessons Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{scormLessons.length}</div>
                <div className="text-sm text-blue-800">Total SCORM Lessons</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {scormLessons.filter(lesson => lesson.scormPackage).length}
                </div>
                <div className="text-sm text-green-800">With Packages</div>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <div className="text-2xl font-bold text-amber-600">
                  {scormLessons.filter(lesson => !lesson.scormPackage).length}
                </div>
                <div className="text-sm text-amber-800">Missing Packages</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SCORM Lessons Management */}
        {scormLessons.length > 0 ? (
          <div className="space-y-4">
            {scormLessons.map((lesson) => (
              <ScormManager
                key={lesson.id}
                lessonId={lesson.id}
                lessonTitle={lesson.title || `Lesson ${lesson.order}`}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No SCORM Lessons</h3>
              <p className="text-gray-600 mb-4">
                This course doesn't have any SCORM lessons yet.
              </p>
              <Link href={`/dashboard/admin/courses/${courseId}/edit`}>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Add SCORM Lessons
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Link href={`/dashboard/admin/courses/${courseId}/edit`}>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Add New SCORM Lesson
                </Button>
              </Link>
              <Link href={`/courses/${courseId}`} target="_blank">
                <Button variant="outline">
                  <Play className="h-4 w-4 mr-2" />
                  Preview Course
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}