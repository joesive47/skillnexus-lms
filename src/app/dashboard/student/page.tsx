import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { UserRole } from "@/lib/types"
import prisma from '@/lib/prisma'
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Award, Clock, Target } from "lucide-react"

export default async function StudentDashboard() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  if (session.user.role !== UserRole.STUDENT) {
    redirect("/dashboard")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { credits: true, name: true, email: true }
  })

  // Get student stats
  const [enrollments, certificates, watchHistory] = await Promise.all([
    prisma.enrollment.count({ where: { userId: session.user.id } }),
    prisma.certificate.count({ where: { userId: session.user.id } }),
    prisma.watchHistory.findMany({
      where: { userId: session.user.id },
      select: { watchTime: true }
    })
  ])

  const totalWatchTime = watchHistory.reduce((sum, w) => sum + w.watchTime, 0)

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">แดชบอร์ดนักเรียน</h1>
          <p className="text-muted-foreground">ยินดีต้อนรับ, {user?.name || user?.email}</p>
        </div>
        <div className="bg-green-600 text-white px-4 py-2 rounded-lg">
          💰 เครดิต: {user?.credits?.toLocaleString() || 0}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">คอร์สที่ลงทะเบียน</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrollments}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ใบประกาศนียบัตร</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{certificates}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">เวลาเรียนรวม</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(totalWatchTime / 60)} นาที</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">เครดิต</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.credits || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Action Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>เลือกซื้อหลักสูตร</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              ค้นหาและลงทะเบียนหลักสูตรที่เหมาะกับคุณ
            </p>
            <Link href="/courses">
              <Button className="w-full">
                <BookOpen className="w-4 h-4 mr-2" />
                ดูหลักสูตร
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ประเมินทักษะ</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              ค้นพบจุดแข็งและพัฒนาทักษะให้ตรงกับตลาดแรงงาน
            </p>
            <Link href="/skills-assessment">
              <Button className="w-full" variant="outline">
                <Award className="w-4 h-4 mr-2" />
                เริ่มประเมิน
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ใบประกาศนียบัตร</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              ดูและดาวน์โหลดใบประกาศนียบัตรของคุณ
            </p>
            <Link href="/dashboard/certificates">
              <Button className="w-full" variant="outline">
                <Award className="w-4 h-4 mr-2" />
                ดูใบประกาศนียบัตร
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}