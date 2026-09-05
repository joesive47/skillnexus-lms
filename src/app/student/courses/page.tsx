import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { BookOpen, Clock, Award } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function StudentCoursesPage() {
  const session = await auth()

  if (!session?.user) redirect('/login')
  if (session.user.role !== 'STUDENT') redirect('/dashboard')

  const userId = session.user.id

  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            imageUrl: true,
            _count: { select: { lessons: true } },
            progressSummaries: {
              where: { userId },
              select: { progressPercent: true, lastActivity: true },
              take: 1,
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const coursesWithProgress = enrollments.map((e) => ({
      ...e,
      progress: Math.min(100, Math.max(0, Math.round(e.course.progressSummaries[0]?.progressPercent ?? 0))),
    }))

    const completed = coursesWithProgress.filter((e) => e.progress >= 100)
    const inProgress = coursesWithProgress.filter((e) => e.progress > 0 && e.progress < 100)
    const notStarted = coursesWithProgress.filter((e) => e.progress === 0)

    return (
      <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">หลักสูตรของฉัน</h1>
          <p className="text-gray-500 text-sm mt-1">
            ลงทะเบียนแล้ว {enrollments.length} หลักสูตร
            {completed.length > 0 && ` · เสร็จสิ้น ${completed.length} หลักสูตร`}
          </p>
        </div>

        {enrollments.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">ยังไม่มีหลักสูตรที่ลงทะเบียน</h2>
              <p className="text-gray-500 mb-6">เริ่มต้นเรียนรู้ด้วยการเลือกหลักสูตรที่สนใจ</p>
              <Button asChild>
                <Link href="/courses">ดูหลักสูตรทั้งหมด</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-10">
            {/* In Progress */}
            {inProgress.length > 0 && (
              <section>
                <h2 className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2 sm:text-lg sm:mb-4">
                  <Clock className="h-4 w-4 text-blue-500 sm:h-5 sm:w-5" /> กำลังเรียน ({inProgress.length})
                </h2>
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 sm:gap-4">
                  {inProgress.map((e) => (
                    <CourseCard key={e.id} enrollment={e} progress={e.progress} />
                  ))}
                </div>
              </section>
            )}

            {/* Not Started */}
            {notStarted.length > 0 && (
              <section>
                <h2 className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2 sm:text-lg sm:mb-4">
                  <BookOpen className="h-4 w-4 text-gray-400 sm:h-5 sm:w-5" /> ยังไม่ได้เริ่ม ({notStarted.length})
                </h2>
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 sm:gap-4">
                  {notStarted.map((e) => (
                    <CourseCard key={e.id} enrollment={e} progress={0} />
                  ))}
                </div>
              </section>
            )}

            {/* Completed */}
            {completed.length > 0 && (
              <section>
                <h2 className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2 sm:text-lg sm:mb-4">
                  <Award className="h-4 w-4 text-green-500 sm:h-5 sm:w-5" /> เสร็จสิ้นแล้ว ({completed.length})
                </h2>
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 sm:gap-4">
                  {completed.map((e) => (
                    <CourseCard key={e.id} enrollment={e} progress={100} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error('Student courses page error:', error)
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-red-600 mb-4">เกิดข้อผิดพลาดในการโหลดหลักสูตร กรุณาลองใหม่</p>
            <Button asChild variant="outline">
              <Link href="/student/dashboard">กลับไปแดชบอร์ด</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }
}

function CourseCard({
  enrollment,
  progress,
}: {
  enrollment: {
    course: {
      id: string
      title: string
      description: string | null
      imageUrl: string | null
      _count: { lessons: number }
    }
  }
  progress: number
}) {
  const { course } = enrollment
  return (
    <Card className="flex flex-col hover:shadow-md transition-shadow">
      {course.imageUrl && (
        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
          <img src={course.imageUrl} alt={course.title} className="h-full w-full object-cover" />
        </div>
      )}
      <CardHeader className="pb-2">
        <CardTitle className="text-base leading-tight">{course.title}</CardTitle>
        {course.description && (
          <p className="text-sm text-gray-500 line-clamp-2">{course.description}</p>
        )}
      </CardHeader>
      <CardContent className="flex-1 pb-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{course._count.lessons} บทเรียน</span>
            <span className="font-medium text-gray-700">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          {progress >= 100 && (
            <Badge className="bg-green-100 text-green-800 border-green-300 w-full justify-center">
              ✓ เสร็จสิ้นแล้ว
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" variant={progress >= 100 ? 'outline' : 'default'}>
          <Link href={`/courses/${course.id}`}>
            {progress === 0 ? 'เริ่มเรียน' : progress >= 100 ? 'ดูอีกครั้ง' : 'เรียนต่อ'}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
