import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { UserRole } from "@/lib/types"
import prisma from '@/lib/prisma'
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Award, Clock, Target, TrendingUp, CheckCircle, ArrowRight, Sparkles } from "lucide-react"

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

  const [enrollments, certificates, watchHistory] = await Promise.all([
    prisma.enrollment.count({ where: { userId: session.user.id } }),
    prisma.certificate.count({ where: { userId: session.user.id } }),
    prisma.watchHistory.findMany({
      where: { userId: session.user.id },
      select: { watchTime: true }
    })
  ])

  const totalWatchTime = watchHistory.reduce((sum, w) => sum + w.watchTime, 0)

  const learningPath = [
    { title: 'JavaScript Basics', status: 'completed', progress: 100 },
    { title: 'React Fundamentals', status: 'in-progress', progress: 65 },
    { title: 'Node.js Backend', status: 'locked', progress: 0 },
    { title: 'Full Stack Project', status: 'locked', progress: 0 },
  ]

  const skillAssessment = {
    technical: 75,
    soft: 60,
    business: 45,
    overall: 60
  }

  const badges = [
    { name: 'Fast Learner', icon: '⚡', earned: true },
    { name: 'Course Completer', icon: '🎓', earned: true },
    { name: 'Skill Master', icon: '🏆', earned: false },
    { name: 'Team Player', icon: '🤝', earned: true },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name || user?.email}</p>
          </div>
          <div className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold">
            💰 Credits: {user?.credits?.toLocaleString() || 0}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Enrolled Courses</CardTitle>
              <BookOpen className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{enrollments}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Certificates</CardTitle>
              <Award className="h-5 w-5 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{certificates}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Learning Time</CardTitle>
              <Clock className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{Math.round(totalWatchTime / 60)}m</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Skill Score</CardTitle>
              <Target className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{skillAssessment.overall}%</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <div className="lg:col-span-2">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Learning Path
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {learningPath.map((course, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        {course.status === 'completed' ? (
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        ) : course.status === 'in-progress' ? (
                          <div className="h-6 w-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <div className="h-6 w-6 border-2 border-gray-300 rounded-full" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium text-gray-900">{course.title}</span>
                          <span className="text-sm text-gray-600">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              course.status === 'completed' ? 'bg-green-600' :
                              course.status === 'in-progress' ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                      <Badge className={
                        course.status === 'completed' ? 'bg-green-100 text-green-800' :
                        course.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {course.status === 'completed' ? 'Completed' :
                         course.status === 'in-progress' ? 'In Progress' : 'Locked'}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center text-sm text-gray-500">
                  เส้นทางการเรียนรู้ของคุณ
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="bg-white shadow-sm mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  Skill Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Technical</span>
                      <span className="text-sm font-bold text-gray-900">{skillAssessment.technical}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${skillAssessment.technical}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Soft Skills</span>
                      <span className="text-sm font-bold text-gray-900">{skillAssessment.soft}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: `${skillAssessment.soft}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Business</span>
                      <span className="text-sm font-bold text-gray-900">{skillAssessment.business}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-600 h-2 rounded-full" style={{ width: `${skillAssessment.business}%` }} />
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-center text-sm text-gray-500">
                  คะแนนทักษะโดยรวม
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-900">
                  <Award className="h-5 w-5" />
                  Badges & Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {badges.map((badge, idx) => (
                    <div 
                      key={idx}
                      className={`p-3 rounded-lg text-center ${
                        badge.earned ? 'bg-white shadow-sm' : 'bg-gray-100 opacity-50'
                      }`}
                    >
                      <div className="text-3xl mb-1">{badge.icon}</div>
                      <div className="text-xs font-medium text-gray-900">{badge.name}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>คอร์สเรียนของฉัน</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4 text-sm">
                เข้าเรียนและติดตามความคืบหน้าของคอร์สที่ลงทะเบียน
              </p>
              <Link href="/courses">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <BookOpen className="w-4 h-4 mr-2" />
                  ดูคอร์สทั้งหมด
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>ประเมินทักษะ</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4 text-sm">
                ทดสอบความรู้และทักษะของคุณ
              </p>
              <Link href="/skills-assessment">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <Target className="w-4 h-4 mr-2" />
                  เริ่มทดสอบ
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>ใบประกาศนียบัตร BARD</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4 text-sm">
                ดูและดาวน์โหลดใบประกาศนียบัตรที่ได้รับ
              </p>
              <Link href="/dashboard/student/bard-certificates">
                <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                  <Award className="w-4 h-4 mr-2" />
                  ดูใบประกาศนียบัตร
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}