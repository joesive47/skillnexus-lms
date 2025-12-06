import { getCourses } from '@/app/actions/course'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Trash2, Edit, Plus, Eye } from 'lucide-react'
import { DeleteCourseForm } from './delete-course-form'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { CourseImage } from '@/components/ui/course-image'

export default async function AdminCoursesPage() {
  const session = await auth()
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }
  const result = await getCourses()
  
  if (!result.success) {
    return <div className="p-6">Error: {result.error}</div>
  }

  const courses = result.courses || []

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Courses</h1>
        <Link href="/dashboard/admin/courses/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Course
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden">
            <div className="relative aspect-video bg-gray-100">
              {course.imageUrl ? (
                <CourseImage
                  src={course.imageUrl}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-100 to-purple-100">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📚</div>
                    <p className="text-sm text-gray-600">No Cover Image</p>
                  </div>
                </div>
              )}
              <div className="absolute top-2 right-2">
                <Badge variant={course.published ? "default" : "secondary"}>
                  {course.published ? "Published" : "Draft"}
                </Badge>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{course.title}</CardTitle>
              <p className="text-sm text-muted-foreground overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>
                {course.description || "No description available"}
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>{course._count.lessons || 0} lessons</span>
                  <span>{course._count.enrollments} students</span>
                </div>
                <div className="text-lg font-semibold text-green-600">
                  {course.price === 0 ? "Free" : `$${course.price}`}
                </div>
              </div>
              <div className="flex gap-2">
                <Link href={`/courses/${course.id}`} className="flex-1">
                  <Button variant="default" size="sm" className="w-full">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                </Link>
                <Link href={`/dashboard/admin/courses/${course.id}/edit`}>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </Link>
                <DeleteCourseForm courseId={course.id} courseTitle={course.title} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No courses found</p>
          <Link href="/dashboard/admin/courses/new" className="mt-4 inline-block">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create your first course
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}