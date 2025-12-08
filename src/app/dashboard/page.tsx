import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import CreditBalance from "@/components/dashboard/CreditBalance"
import { Phase3Showcase } from "@/components/phase3/phase3-showcase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { 
  BookOpen, 
  Award, 
  Users, 
  TrendingUp,
  Headphones,
  Link2,
  Building2,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Package,
  Zap,
  Video
} from "lucide-react"

export default async function DashboardPage() {
  const session = await auth()
  
  // Redirect based on role
  if (session?.user?.role === 'ADMIN') {
    redirect('/admin/dashboard')
  }
  if (session?.user?.role === 'TEACHER') {
    redirect('/teacher/dashboard')
  }
  if (session?.user?.role === 'STUDENT') {
    redirect('/student/dashboard')
  }
  
  // If no session, redirect to login
  if (!session?.user) {
    redirect('/login')
  }
  
  let user: { id: string; credits: number } | null = null
  let transactions: any[] = []
  
  if (session?.user?.email) {
    user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, credits: true }
    })
    
    if (user) {
      transactions = await prisma.transaction.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 10
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">แดชบอร์ด</h1>
              <p className="text-gray-600 mt-1">ยินดีต้อนรับสู่ upPowerSkill</p>
            </div>
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
              🚀 All Features
            </Badge>
          </div>
        </div>
      </div>

      <div className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Quick Access */}
          <div className="mb-8">
            <Card className="bg-white shadow-lg border-gray-200">
              <CardHeader>
                <CardTitle className="text-slate-800 flex items-center text-2xl font-bold">
                  <Zap className="w-7 h-7 mr-3 text-blue-600" />
                  เครื่องมือและฟีเจอร์
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <Link href="/courses">
                    <Button className="w-full h-24 flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg">
                      <BookOpen className="w-8 h-8 mb-2" />
                      <span className="font-semibold">คอร์สเรียน</span>
                      <span className="text-xs opacity-90">เรียนออนไลน์</span>
                    </Button>
                  </Link>
                  <Link href="/skills-assessment">
                    <Button className="w-full h-24 flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg">
                      <TrendingUp className="w-8 h-8 mb-2" />
                      <span className="font-semibold">ประเมินทักษะ</span>
                      <span className="text-xs opacity-90">ทดสอบความรู้</span>
                    </Button>
                  </Link>
                  <Link href="/dashboard/student/bard-certificates">
                    <Button className="w-full h-24 flex flex-col items-center justify-center bg-gradient-to-br from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white shadow-lg">
                      <Award className="w-8 h-8 mb-2" />
                      <span className="font-semibold">ใบประกาศนียบัตร</span>
                      <span className="text-xs opacity-90">BARD Certs</span>
                    </Button>
                  </Link>
                  <Link href="/dashboard/classrooms">
                    <Button className="w-full h-24 flex flex-col items-center justify-center bg-gradient-to-br from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg">
                      <Users className="w-8 h-8 mb-2" />
                      <span className="font-semibold">ห้องเรียน</span>
                      <span className="text-xs opacity-90">เรียนร่วมกัน</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Credit Balance */}
          {user && (
            <div className="mb-8">
              <CreditBalance 
                credits={user.credits} 
                transactions={transactions}
              />
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-white shadow-md border-gray-200 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Award className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="text-sm font-bold text-slate-700">
                      หลักสูตรที่เรียนจบ
                    </div>
                    <div className="text-4xl font-extrabold text-slate-900">
                      0
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-md border-gray-200 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                      <BookOpen className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="text-sm font-bold text-slate-700">
                      หลักสูตรที่กำลังเรียน
                    </div>
                    <div className="text-4xl font-extrabold text-slate-900">
                      0
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-md border-gray-200 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Link2 className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="text-sm font-bold text-slate-700">
                      Blockchain Certificates
                    </div>
                    <div className="text-4xl font-extrabold text-slate-900">
                      0
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-md border-gray-200 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                      <TrendingUp className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="text-sm font-bold text-slate-700">
                      คะแนนการเรียน
                    </div>
                    <div className="text-4xl font-extrabold text-slate-900">
                      95%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Phase 3 Showcase */}
          <div className="mt-8">
            <Phase3Showcase />
          </div>

          {/* Recommended Courses */}
          <div className="mt-8">
            <Card className="bg-white shadow-lg border-gray-200">
              <CardHeader>
                <CardTitle className="text-slate-800 flex items-center justify-between text-2xl">
                  <span className="font-bold">หลักสูตรแนะนำ</span>
                  <Link href="/courses">
                    <Button variant="outline" className="border-slate-400 text-slate-800 hover:bg-slate-100 font-bold">
                      ดูทั้งหมด
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="bg-white shadow-md border-gray-200 hover:shadow-xl transition-shadow">
                    <CardContent className="p-5">
                      <div className="w-full h-36 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl mb-4 flex items-center justify-center shadow-lg">
                        <Headphones className="w-12 h-12 text-white" />
                      </div>
                      <h4 className="text-slate-900 font-bold mb-2 text-lg">VR Learning Fundamentals</h4>
                      <p className="text-slate-700 text-sm mb-3 font-medium">เรียนรู้พื้นฐาน VR/AR</p>
                      <Badge className="bg-purple-100 text-purple-800 border-0 font-bold">ใหม่!</Badge>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white shadow-md border-gray-200 hover:shadow-xl transition-shadow">
                    <CardContent className="p-5">
                      <div className="w-full h-36 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl mb-4 flex items-center justify-center shadow-lg">
                        <Link2 className="w-12 h-12 text-white" />
                      </div>
                      <h4 className="text-slate-900 font-bold mb-2 text-lg">Blockchain Basics</h4>
                      <p className="text-slate-700 text-sm mb-3 font-medium">เข้าใจ Blockchain และ Certificates</p>
                      <Badge className="bg-blue-100 text-blue-800 border-0 font-bold">ยอดนิยม</Badge>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white shadow-md border-gray-200 hover:shadow-xl transition-shadow">
                    <CardContent className="p-5">
                      <div className="w-full h-36 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl mb-4 flex items-center justify-center shadow-lg">
                        <Building2 className="w-12 h-12 text-white" />
                      </div>
                      <h4 className="text-slate-900 font-bold mb-2 text-lg">Enterprise Management</h4>
                      <p className="text-slate-700 text-sm mb-3 font-medium">จัดการระบบระดับองค์กร</p>
                      <Badge className="bg-green-100 text-green-800 border-0 font-bold">ขั้นสูง</Badge>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}