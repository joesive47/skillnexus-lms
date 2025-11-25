import { auth } from "@/auth"
import { redirect } from "next/navigation"
import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Coins, Plus, History, ShoppingCart } from "lucide-react"
import Link from "next/link"

export default async function CreditsPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { 
      credits: true,
      name: true,
      email: true
    }
  })

  // Get recent enrollments (credit usage history)
  const recentEnrollments = await prisma.enrollment.findMany({
    where: { userId: session.user.id },
    include: {
      course: {
        select: {
          title: true,
          price: true
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 10
  })

  const currentCredits = user?.credits || 0

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">เครดิตของฉัน</h1>
          <p className="text-muted-foreground">
            จัดการเครดิตสำหรับซื้อหลักสูตร
          </p>
        </div>
      </div>

      {/* Current Credits */}
      <Card className="mb-8 bg-gradient-to-r from-green-500 to-blue-600 text-white">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Coins className="w-8 h-8" />
                <h2 className="text-2xl font-bold">เครดิตปัจจุบัน</h2>
              </div>
              <div className="text-4xl font-bold">
                {currentCredits.toLocaleString()} เครดิต
              </div>
              <p className="opacity-90 mt-2">
                1 เครดิต = 1 บาท สำหรับซื้อหลักสูตร
              </p>
            </div>
            <div className="text-right">
              <Button 
                variant="outline" 
                className="text-white border-white hover:bg-white hover:text-green-600 mb-2"
                disabled
              >
                <Plus className="w-4 h-4 mr-2" />
                เติมเครดิต
              </Button>
              <div className="text-sm opacity-75">
                (ฟีเจอร์นี้จะเปิดใช้งานเร็วๆ นี้)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              การใช้เครดิต
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">ซื้อหลักสูตร</h4>
              <p className="text-sm text-blue-700 mb-3">
                ใช้เครดิตเพื่อซื้อหลักสูตรที่คุณสนใจ
              </p>
              <Link href="/courses">
                <Button size="sm" className="w-full">
                  เลือกหลักสูตร
                </Button>
              </Link>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">ประเมินทักษะ</h4>
              <p className="text-sm text-gray-700 mb-3">
                ประเมินทักษะฟรี ไม่ต้องใช้เครดิต
              </p>
              <Link href="/skills-assessment">
                <Button size="sm" variant="outline" className="w-full">
                  เริ่มประเมิน
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              ประวัติการใช้เครดิต
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentEnrollments.length === 0 ? (
              <div className="text-center py-8">
                <History className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">ยังไม่มีประวัติการใช้เครดิต</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentEnrollments.map((enrollment) => (
                  <div 
                    key={enrollment.id} 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-sm">
                        {enrollment.course.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(enrollment.createdAt).toLocaleDateString('th-TH')}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-red-600">
                      -{enrollment.course.price.toLocaleString()} เครดิต
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Credit Info */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>เกี่ยวกับเครดิต</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">วิธีการใช้เครดิต</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 1 เครดิต = 1 บาท</li>
                <li>• ใช้สำหรับซื้อหลักสูตรเท่านั้น</li>
                <li>• เครดิตไม่มีวันหมดอายุ</li>
                <li>• ไม่สามารถถอนเป็นเงินสดได้</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">วิธีการได้รับเครดิต</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• เครดิตเริ่มต้น 1,000 เครดิต</li>
                <li>• ระบบเติมเครดิตจะเปิดใช้งานเร็วๆ นี้</li>
                <li>• โปรโมชั่นพิเศษ (เร็วๆ นี้)</li>
                <li>• รางวัลจากกิจกรรม (เร็วๆ นี้)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}