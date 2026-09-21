import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Users, Award, Plus, Eye, TrendingUp, Edit } from 'lucide-react'
import Link from 'next/link'
import { CourseImage } from '@/components/ui/course-image'
import { LogoutButton } from '@/components/auth/logout-button'
import { requireAdminOrTeacher } from '@/lib/access-control'
import { managedCourseWhere } from '@/lib/course-ownership'

export const dynamic = 'force-dynamic'

export default async function InstructorDashboard() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if (session.user.role !== 'TEACHER' && session.user.role !== 'ADMIN') redirect('/dashboard')

  const courseManager = await requireAdminOrTeacher()
  const courseWhere = managedCourseWhere(courseManager)

  // Instructors only see courses explicitly assigned to them; administrators
  // retain access to every course.
  const courses = await prisma.course.findMany({
      where: courseWhere,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { enrollments: true, lessons: true } },
      },
    })

  const courseIds = courses.map((course) => course.id)
  const [totalEnrollments, totalCertificates] = await Promise.all([
    prisma.enrollment.count({ where: { courseId: { in: courseIds } } }),
    prisma.certificate.count({ where: { status: 'ACTIVE', courseId: { in: courseIds } } }),
  ])

  const publishedCount = courses.filter(c => c.published).length
  const draftCount = courses.length - publishedCount

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Instructor Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            ยินดีต้อนรับ, {session.user.name || session.user.email}
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button asChild>
            <Link href="/instructor/courses/new">
              <Plus className="h-4 w-4 mr-2" />
              สร้างหลักสูตรใหม่
            </Link>
          </Button>
          <LogoutButton />
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-4 sm:gap-4 sm:mb-8">
        {[
          { label: 'หลักสูตรทั้งหมด', value: courses.length, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'เผยแพร่แล้ว', value: publishedCount, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'ผู้เรียนทั้งหมด', value: totalEnrollments, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'ใบรับรองออกแล้ว', value: totalCertificates, icon: Award, color: 'text-yellow-600', bg: 'bg-yellow-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 sm:text-sm">{label}</p>
                  <p className={`text-2xl font-bold ${color} sm:text-3xl`}>{value}</p>
                </div>
                <span className={`p-2 rounded-xl ${bg}`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Course list */}
      <div id="my-courses" className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">หลักสูตรของฉัน</h2>
        {draftCount > 0 && (
          <Badge variant="outline" className="text-xs">
            {draftCount} แบบร่าง
          </Badge>
        )}
      </div>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">ยังไม่มีหลักสูตร</h3>
            <p className="text-gray-500 mb-6 text-sm">เริ่มสร้างหลักสูตรแรกของคุณได้เลย</p>
            <Button asChild>
              <Link href="/instructor/courses/new">
                <Plus className="h-4 w-4 mr-2" />
                สร้างหลักสูตรใหม่
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden hover:shadow-md transition-shadow">
              {/* Thumbnail */}
              <div className="relative h-36 bg-gradient-to-br from-blue-100 to-purple-100">
                {course.imageUrl ? (
                  <CourseImage src={course.imageUrl} alt={course.title} fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <BookOpen className="h-12 w-12 text-blue-300" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge
                    className={course.published
                      ? 'bg-green-100 text-green-800 border-green-300'
                      : 'bg-yellow-100 text-yellow-800 border-yellow-300'}
                  >
                    {course.published ? 'เผยแพร่แล้ว' : 'แบบร่าง'}
                  </Badge>
                </div>
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-base leading-tight line-clamp-2">{course.title}</CardTitle>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5" />
                    {course._count.lessons} บทเรียน
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {course._count.enrollments} ผู้เรียน
                  </span>
                  <span className="font-medium text-gray-700">
                    {course.price === 0 ? 'ฟรี' : `฿${course.price.toLocaleString()}`}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button asChild size="sm" variant="outline" className="flex-1">
                    <Link href={`/instructor/courses/${course.id}/edit`}>
                      <Edit className="h-3.5 w-3.5 mr-1.5" />
                      แก้ไข
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="ghost" className="px-2.5">
                    <Link href={`/courses/${course.id}`}>
                      <Eye className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
