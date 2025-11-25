import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { UserRole } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, DollarSign, Edit, BarChart3, Plus } from "lucide-react"
import Link from "next/link"
import { getTeacherCourses } from "@/app/actions/course"
import Image from "next/image"
import { TestCertificationButton } from "@/components/admin/test-certification-button"

export default async function TeacherDashboard() {
  const session = await auth()
  
  if (!session?.user || (session.user.role !== UserRole.TEACHER && session.user.role !== UserRole.ADMIN)) {
    redirect("/dashboard")
  }

  // Get actual courses from database
  const coursesResult = await getTeacherCourses()
  const courses = coursesResult.success ? coursesResult.courses : []
  
  const teacherData = {
    name: session.user.name || "Teacher",
    courses,
    totalStudents: courses?.reduce((sum, course) => sum + course._count.enrollments, 0) || 0,
    totalEarnings: 0, // Calculate from actual data
    pendingPayout: 0,
    revenueShare: 70
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
          <p className="text-muted-foreground">Manage your courses and track performance</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/teacher/create">
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </Link>
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teacherData.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Across all courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${teacherData.totalEarnings}</div>
            <p className="text-xs text-muted-foreground">Lifetime revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payout</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${teacherData.pendingPayout}</div>
            <p className="text-xs text-muted-foreground">Next payout</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Share</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teacherData.revenueShare}%</div>
            <p className="text-xs text-muted-foreground">Your share rate</p>
          </CardContent>
        </Card>
      </div>

      {/* My Courses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            My Courses
          </CardTitle>
          <CardDescription>Manage and edit your course content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teacherData.courses?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No courses created yet</p>
                <Button asChild className="mt-4">
                  <Link href="/dashboard/teacher/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Course
                  </Link>
                </Button>
              </div>
            ) : (
              teacherData.courses?.map((course) => (
                <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    {course.imageUrl && (
                      <Image
                        src={course.imageUrl}
                        alt={course.title}
                        width={60}
                        height={40}
                        className="rounded object-cover"
                      />
                    )}
                    <div>
                      <h4 className="font-medium">{course.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {course._count.enrollments} students enrolled • {course._count.modules} modules
                      </p>
                      {course.price && (
                        <p className="text-sm font-medium text-green-600">
                          ${course.price}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {course.published ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Published
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          Draft
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/teacher/courses/${course.id}/analytics`}>
                        <BarChart3 className="h-4 w-4 mr-1" />
                        Analytics
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/teacher/courses/${course.id}/edit`}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Content Management</CardTitle>
            <CardDescription>Create and manage your course content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/dashboard/teacher/courses">
                <BookOpen className="h-4 w-4 mr-2" />
                Manage All Courses
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/dashboard/teacher/content">
                <Edit className="h-4 w-4 mr-2" />
                Content Creation Tool
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Student Performance</CardTitle>
            <CardDescription>Track student progress and quiz results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/dashboard/teacher/analytics">
                <BarChart3 className="h-4 w-4 mr-2" />
                Performance Analytics
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/dashboard/teacher/students">
                <Users className="h-4 w-4 mr-2" />
                Student Progress
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* E2E Testing Section - Admin Only */}
      {session.user.role === UserRole.ADMIN && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800">Admin E2E Testing</CardTitle>
            <CardDescription className="text-orange-600">
              Test the complete certification pipeline for any course
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-orange-700">
                Select a course to simulate the complete learning flow: all lessons marked as completed, 
                all quizzes passed, and certificate generation triggered.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teacherData.courses?.map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-3 bg-white border border-orange-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-sm">{course.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {course._count.modules} modules
                      </p>
                    </div>
                    <TestCertificationButton courseId={course.id} courseTitle={course.title} />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}