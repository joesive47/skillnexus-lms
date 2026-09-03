import Link from 'next/link'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/access-control'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Activity, BookOpen, CheckCircle2, Eye, Users } from 'lucide-react'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function CourseAnalyticsPage() {
  try { await requireAdmin() } catch { redirect('/login') }
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const courses = await prisma.course.findMany({
    include: {
      category: { include: { parent: true } },
      enrollments: { where: { createdAt: { gte: since } }, select: { userId: true } },
      progressSummaries: { select: { progressPercent: true, completedAt: true } },
      trackingEvents: { where: { event: 'VIEW', occurredAt: { gte: since } }, select: { id: true } },
    },
    orderBy: { title: 'asc' },
  })

  const learnerIds = new Set(courses.flatMap((course) => course.enrollments.map((item) => item.userId)))
  const totals = courses.reduce((sum, course) => ({
    views: sum.views + course.trackingEvents.length,
    enrollments: sum.enrollments + course.enrollments.length,
    completions: sum.completions + course.progressSummaries.filter((item) => item.completedAt && item.completedAt >= since).length,
  }), { views: 0, enrollments: 0, completions: 0 })

  const rows = courses.map((course) => {
    const completed = course.progressSummaries.filter((item) => item.completedAt && item.completedAt >= since).length
    const averageProgress = course.progressSummaries.length
      ? Math.round(course.progressSummaries.reduce((sum, item) => sum + item.progressPercent, 0) / course.progressSummaries.length)
      : 0
    return {
      id: course.id,
      title: course.title,
      mainCategory: course.category?.parent?.name || course.category?.name || 'ยังไม่จัดหมวดหมู่',
      subCategory: course.category?.parent ? course.category.name : '—',
      views: course.trackingEvents.length,
      enrollments: course.enrollments.length,
      completed,
      averageProgress,
      enrollmentRate: course.trackingEvents.length ? Math.round(course.enrollments.length / course.trackingEvents.length * 100) : 0,
      completionRate: course.enrollments.length ? Math.round(completed / course.enrollments.length * 100) : 0,
    }
  }).sort((a, b) => b.enrollments - a.enrollments || b.views - a.views)
  const categoryRows = Array.from(rows.reduce((map, row) => {
    const current = map.get(row.mainCategory) || { name: row.mainCategory, courses: 0, views: 0, enrollments: 0, completed: 0 }
    current.courses += 1; current.views += row.views; current.enrollments += row.enrollments; current.completed += row.completed
    map.set(row.mainCategory, current)
    return map
  }, new Map<string, { name: string; courses: number; views: number; enrollments: number; completed: number }>()).values())
    .sort((a, b) => b.enrollments - a.enrollments)

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-3xl font-bold">Course Analytics</h1><p className="text-muted-foreground">ภาพรวม 30 วันล่าสุด แยกตามหลักสูตรและหมวดหมู่</p></div>
        <Button asChild variant="outline"><Link href="/dashboard/admin/course-categories">จัดการหมวดหมู่</Link></Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Metric title="หลักสูตรทั้งหมด" value={courses.length} icon={BookOpen} />
        <Metric title="ผู้เรียนใหม่" value={learnerIds.size} icon={Users} />
        <Metric title="การเข้าชม" value={totals.views} icon={Eye} />
        <Metric title="การลงทะเบียน" value={totals.enrollments} icon={Activity} />
        <Metric title="เรียนจบ" value={totals.completions} icon={CheckCircle2} />
      </div>
      <Card>
        <CardHeader><CardTitle>ผลรายหลักสูตร</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-sm">
            <thead><tr className="border-b text-left"><th className="p-3">หลักสูตร</th><th className="p-3">หมวดหมู่หลัก</th><th className="p-3">หมวดหมู่ย่อย</th><th className="p-3 text-right">เข้าชม</th><th className="p-3 text-right">ลงทะเบียน</th><th className="p-3 text-right">View→Enroll</th><th className="p-3 text-right">เรียนจบ</th><th className="p-3 text-right">Completion</th><th className="p-3 text-right">Progress เฉลี่ย</th></tr></thead>
            <tbody>{rows.map((row) => <tr key={row.id} className="border-b last:border-0"><td className="p-3 font-medium">{row.title}</td><td className="p-3">{row.mainCategory}</td><td className="p-3">{row.subCategory}</td><td className="p-3 text-right">{row.views}</td><td className="p-3 text-right">{row.enrollments}</td><td className="p-3 text-right">{row.enrollmentRate}%</td><td className="p-3 text-right">{row.completed}</td><td className="p-3 text-right">{row.completionRate}%</td><td className="p-3 text-right">{row.averageProgress}%</td></tr>)}</tbody>
          </table>
          {!rows.length && <p className="py-8 text-center text-muted-foreground">ยังไม่มีข้อมูลหลักสูตร</p>}
        </CardContent>
      </Card>
      <Card><CardHeader><CardTitle>ผลตามหมวดหมู่หลัก</CardTitle></CardHeader><CardContent className="overflow-x-auto">
        <table className="w-full min-w-[650px] text-sm"><thead><tr className="border-b text-left"><th className="p-3">หมวดหมู่</th><th className="p-3 text-right">หลักสูตร</th><th className="p-3 text-right">เข้าชม</th><th className="p-3 text-right">ลงทะเบียน</th><th className="p-3 text-right">เรียนจบ</th></tr></thead>
          <tbody>{categoryRows.map(row => <tr key={row.name} className="border-b last:border-0"><td className="p-3 font-medium">{row.name}</td><td className="p-3 text-right">{row.courses}</td><td className="p-3 text-right">{row.views}</td><td className="p-3 text-right">{row.enrollments}</td><td className="p-3 text-right">{row.completed}</td></tr>)}</tbody></table>
      </CardContent></Card>
    </div>
  )
}

function Metric({ title, value, icon: Icon }: { title: string; value: number; icon: typeof BookOpen }) {
  return <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">{title}</CardTitle><Icon className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{value.toLocaleString()}</div></CardContent></Card>
}
