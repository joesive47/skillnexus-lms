import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Gamepad2, Plus, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import InteractiveResultsDashboard from '@/components/admin/InteractiveResultsDashboard'

export default async function InteractivePage() {
  const session = await auth()
  
  if (!session?.user?.id || !['ADMIN', 'TEACHER'].includes(session.user.role)) {
    redirect('/login')
  }

  // Get all interactive lessons
  const interactiveLessons = await prisma.lesson.findMany({
    where: {
      OR: [
        { type: 'interactive' },
        { lessonType: 'INTERACTIVE' }
      ]
    },
    include: {
      course: {
        select: {
          title: true,
          id: true
        }
      },
      _count: {
        select: {
          interactiveResults: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  // Get courses for creating new interactive lessons
  const courses = await prisma.course.findMany({
    select: {
      id: true,
      title: true
    },
    orderBy: {
      title: 'asc'
    }
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Gamepad2 className="h-6 w-6" />
            Interactive Lessons Management
          </h1>
          <p className="text-muted-foreground">
            Manage interactive content and view learning analytics
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create New Interactive Lesson */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create Interactive Lesson
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Select a course and lesson to add interactive content
              </p>
              
              {courses.length > 0 ? (
                <div className="space-y-2">
                  {courses.slice(0, 3).map((course) => (
                    <Link
                      key={course.id}
                      href={`/dashboard/admin/courses/${course.id}/edit`}
                    >
                      <Button variant="outline" className="w-full justify-start">
                        {course.title}
                      </Button>
                    </Link>
                  ))}
                  {courses.length > 3 && (
                    <Link href="/dashboard/admin/courses">
                      <Button variant="ghost" className="w-full">
                        View All Courses ({courses.length})
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-2">No courses found</p>
                  <Link href="/dashboard/admin/courses/new">
                    <Button>Create Course First</Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Interactive Lessons</span>
                <Badge variant="secondary">{interactiveLessons.length}</Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Attempts</span>
                <Badge variant="secondary">
                  {interactiveLessons.reduce((sum, lesson) => sum + lesson._count.interactiveResults, 0)}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active Courses</span>
                <Badge variant="secondary">
                  {new Set(interactiveLessons.map(l => l.course.id)).size}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Lessons List */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive Lessons ({interactiveLessons.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {interactiveLessons.length > 0 ? (
            <div className="space-y-4">
              {interactiveLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Gamepad2 className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="font-medium">{lesson.title || 'Untitled Interactive Lesson'}</p>
                      <p className="text-sm text-muted-foreground">
                        Course: {lesson.course.title}
                      </p>
                      {lesson.launchUrl && (
                        <p className="text-xs text-muted-foreground">
                          URL: {lesson.launchUrl}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {lesson._count.interactiveResults} attempts
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Link href={`/courses/${lesson.course.id}/lessons/${lesson.id}`}>
                        <Button variant="outline" size="sm">
                          Preview
                        </Button>
                      </Link>
                      <Link href={`/dashboard/admin/courses/${lesson.course.id}`}>
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Gamepad2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="mb-2">No interactive lessons found</p>
              <p className="text-sm">Create your first interactive lesson to get started</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Overall Analytics */}
      {interactiveLessons.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Overall Interactive Learning Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <InteractiveResultsDashboard />
          </CardContent>
        </Card>
      )}
    </div>
  )
}