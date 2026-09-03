import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Award,
  Clock,
  Target,
  Brain,
  Zap,
  Calendar,
  Download,
  Filter
} from "lucide-react"
import Link from "next/link"

export default async function AnalyticsPage() {
  const session = await auth()
  
  // Mock data for demonstration - in real app, fetch from database
  const analyticsData = {
    totalStudents: 1247,
    activeCourses: 89,
    completionRate: 87.5,
    avgStudyTime: 4.2,
    monthlyGrowth: 23.5,
    topSkills: [
      { name: "JavaScript", students: 456, growth: 15.2 },
      { name: "Python", students: 389, growth: 12.8 },
      { name: "React", students: 334, growth: 18.5 },
      { name: "Node.js", students: 298, growth: 14.1 },
      { name: "TypeScript", students: 267, growth: 22.3 }
    ],
    weeklyActivity: [
      { day: "จันทร์", hours: 1250 },
      { day: "อังคาร", hours: 1180 },
      { day: "พุธ", hours: 1320 },
      { day: "พฤหัส", hours: 1290 },
      { day: "ศุกร์", hours: 1150 },
      { day: "เสาร์", hours: 980 },
      { day: "อาทิตย์", hours: 850 }
    ]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center">
                <BarChart3 className="w-8 h-8 mr-3" />
                Analytics Dashboard
              </h1>
              <p className="text-gray-300 mt-1">ข้อมูลเชิงลึกและการวิเคราะห์ระบบการเรียนรู้</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Filter className="w-4 h-4 mr-2" />
                ตัวกรอง
              </Button>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Download className="w-4 h-4 mr-2" />
                ส่งออกรายงาน
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 mb-8">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="text-sm font-medium text-gray-300">
                      นักเรียนทั้งหมด
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {analyticsData.totalStudents.toLocaleString()}
                    </div>
                    <div className="text-xs text-green-400 flex items-center mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +{analyticsData.monthlyGrowth}%
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
                      คอร์สที่เปิดสอน
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {analyticsData.activeCourses}
                    </div>
                    <div className="text-xs text-blue-400 flex items-center mt-1">
                      <Zap className="w-3 h-3 mr-1" />
                      ใช้งานอยู่
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
                      <Target className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="text-sm font-medium text-gray-300">
                      อัตราการจบคอร์ส
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {analyticsData.completionRate}%
                    </div>
                    <div className="text-xs text-green-400 flex items-center mt-1">
                      <Award className="w-3 h-3 mr-1" />
                      เป้าหมาย 85%
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
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="text-sm font-medium text-gray-300">
                      เวลาเรียนเฉลี่ย
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {analyticsData.avgStudyTime}h
                    </div>
                    <div className="text-xs text-yellow-400 flex items-center mt-1">
                      <Calendar className="w-3 h-3 mr-1" />
                      ต่อวัน
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="text-sm font-medium text-gray-300">
                      AI Recommendations
                    </div>
                    <div className="text-2xl font-bold text-white">
                      94%
                    </div>
                    <div className="text-xs text-purple-400 flex items-center mt-1">
                      <Zap className="w-3 h-3 mr-1" />
                      ความแม่นยำ
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Weekly Activity Chart */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  กิจกรรมรายสัปดาห์
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.weeklyActivity.map((day, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-16 text-sm text-gray-300">{day.day}</div>
                      <div className="flex-1 mx-4">
                        <div className="bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                            style={{ width: `${(day.hours / 1400) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="w-16 text-sm text-white text-right">{day.hours}h</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Skills */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  ทักษะยอดนิยม
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.topSkills.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white text-sm font-bold mr-3">
                          {index + 1}
                        </div>
                        <div>
                          <div className="text-white font-medium">{skill.name}</div>
                          <div className="text-gray-400 text-sm">{skill.students} นักเรียน</div>
                        </div>
                      </div>
                      <Badge className="bg-green-500/20 text-green-300">
                        +{skill.growth}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Learning Insights */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                ข้อมูลเชิงลึกการเรียนรู้
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-6 border border-purple-500/20">
                  <h4 className="text-white font-semibold mb-2">Peak Learning Hours</h4>
                  <p className="text-gray-300 text-sm mb-3">
                    นักเรียนส่วนใหญ่เรียนในช่วง 19:00-22:00 น. มีประสิทธิภาพการเรียนรู้สูงสุด
                  </p>
                  <Badge className="bg-purple-500/20 text-purple-300">19:00-22:00</Badge>
                </div>
                
                <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg p-6 border border-blue-500/20">
                  <h4 className="text-white font-semibold mb-2">Optimal Session Length</h4>
                  <p className="text-gray-300 text-sm mb-3">
                    การเรียนรู้ที่มีประสิทธิภาพสูงสุดคือ 45-60 นาทีต่อครั้ง
                  </p>
                  <Badge className="bg-blue-500/20 text-blue-300">45-60 นาที</Badge>
                </div>
                
                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-6 border border-green-500/20">
                  <h4 className="text-white font-semibold mb-2">Retention Rate</h4>
                  <p className="text-gray-300 text-sm mb-3">
                    นักเรียนที่ใช้ VR Learning มีอัตราการจำได้สูงกว่า 40%
                  </p>
                  <Badge className="bg-green-500/20 text-green-300">+40% VR</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">การดำเนินการด่วน</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <Link href="/courses">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <BookOpen className="w-4 h-4 mr-2" />
                    จัดการคอร์ส
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                    <Users className="w-4 h-4 mr-2" />
                    จัดการนักเรียน
                  </Button>
                </Link>
                <Link href="/certificates">
                  <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                    <Award className="w-4 h-4 mr-2" />
                    ใบรับรอง
                  </Button>
                </Link>
                <Button className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
                  <Download className="w-4 h-4 mr-2" />
                  ส่งออกข้อมูล
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}