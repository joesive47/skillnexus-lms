import { auth } from "@/auth"
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
  ArrowRight
} from "lucide-react"

export default async function DashboardPage() {
  const session = await auth()
  
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">แดชบอร์ด</h1>
              <p className="text-gray-300 mt-1">ยินดีต้อนรับสู่ SkillNexus Phase 3</p>
            </div>
            <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30">
              🚀 Phase 3 Active
            </Badge>
          </div>
        </div>
      </div>

      <div className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Phase 3 Quick Access */}
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Phase 3 Features - เข้าถึงอนาคตแล้ว!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <Link href="/vr-learning">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      <Headphones className="w-4 h-4 mr-2" />
                      VR Learning
                    </Button>
                  </Link>
                  <Link href="/blockchain">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                      <Link2 className="w-4 h-4 mr-2" />
                      Blockchain Certs
                    </Button>
                  </Link>
                  <Link href="/enterprise">
                    <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                      <Building2 className="w-4 h-4 mr-2" />
                      Enterprise
                    </Button>
                  </Link>
                  <Link href="/social-learning">
                    <Button className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Social Learning
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
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="text-sm font-medium text-gray-300">
                      หลักสูตรที่เรียนจบ
                    </div>
                    <div className="text-2xl font-bold text-white">
                      0
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="text-sm font-medium text-gray-300">
                      หลักสูตรที่กำลังเรียน
                    </div>
                    <div className="text-2xl font-bold text-white">
                      0
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Link2 className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="text-sm font-medium text-gray-300">
                      Blockchain Certificates
                    </div>
                    <div className="text-2xl font-bold text-white">
                      0
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="text-sm font-medium text-gray-300">
                      คะแนนการเรียน
                    </div>
                    <div className="text-2xl font-bold text-white">
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
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span>หลักสูตรแนะนำ</span>
                  <Link href="/courses">
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      ดูทั้งหมด
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4">
                      <div className="w-full h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mb-4 flex items-center justify-center">
                        <Headphones className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-white font-semibold mb-2">VR Learning Fundamentals</h4>
                      <p className="text-gray-300 text-sm mb-3">เรียนรู้พื้นฐาน VR/AR</p>
                      <Badge className="bg-purple-500/20 text-purple-300">ใหม่!</Badge>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4">
                      <div className="w-full h-32 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg mb-4 flex items-center justify-center">
                        <Link2 className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-white font-semibold mb-2">Blockchain Basics</h4>
                      <p className="text-gray-300 text-sm mb-3">เข้าใจ Blockchain และ Certificates</p>
                      <Badge className="bg-blue-500/20 text-blue-300">ยอดนิยม</Badge>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4">
                      <div className="w-full h-32 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg mb-4 flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-white font-semibold mb-2">Enterprise Management</h4>
                      <p className="text-gray-300 text-sm mb-3">จัดการระบบระดับองค์กร</p>
                      <Badge className="bg-green-500/20 text-green-300">ขั้นสูง</Badge>
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