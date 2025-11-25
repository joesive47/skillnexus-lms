'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Target, ShoppingBag } from "lucide-react"
import { safeArray, safeMap } from "@/lib/safe-array"
import Link from "next/link"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface StudentAnalyticsProps {
  data: {
    totalCourses: number
    totalCertificates: number
    totalWatchTime: number
    averageQuizScore: number
    recentQuizzes: Array<{ quiz: { title: string }, score: number, passed: boolean }>
    courseProgress: Array<{ title: string, progress: number, watchTime: number }>
  }
}

interface AdminAnalyticsProps {
  data: {
    totalUsers: number
    totalCourses: number
    totalEnrollments: number
    totalCertificates: number
    popularCourses: Array<{ title: string, enrollments: number }>
    monthlyEnrollments: Array<{ month: string, count: number }>
    quizPerformance: Array<{ title: string, passRate: number, avgScore: number, attempts: number }>
    recentSubmissions: Array<{ user: { name: string }, quiz: { title: string }, score: number, passed: boolean }>
  }
}

export function StudentAnalyticsDashboard({ data }: StudentAnalyticsProps) {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  return (
    <div className="space-y-6">
      {/* Course Shopping CTA */}
      <Card className="bg-gradient-to-r from-green-500 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">เลือกซื้อหลักสูตรใหม่</h3>
              <p className="opacity-90">ค้นหาและลงทะเบียนหลักสูตรที่เหมาะกับคุณ</p>
            </div>
            <Link href="/courses">
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-green-600">
                <ShoppingBag className="w-4 h-4 mr-2" />
                ดูหลักสูตร
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Skills Assessment CTA */}
      <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">ประเมินทักษะอาชีพของคุณ</h3>
              <p className="opacity-90">ค้นพบจุดแข็งและพัฒนาทักษะให้ตรงกับตลาดแรงงาน</p>
            </div>
            <Link href="/skills-assessment">
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-indigo-600">
                <Target className="w-4 h-4 mr-2" />
                เริ่มประเมิน
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">คอร์สที่ลงทะเบียน</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalCourses}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ใบประกาศนียบัตร</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalCertificates}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">เวลาเรียนรวม</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(data.totalWatchTime / 60)} นาที</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">คะแนนเฉลี่ย</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.averageQuizScore}/10</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>ความคืบหน้าคอร์ส</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {safeMap<{ title: string, progress: number, watchTime: number }, JSX.Element>(data.courseProgress, (course, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="truncate">{course.title}</span>
                  <span>{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>แบบทดสอบล่าสุด</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {safeMap<{ quiz: { title: string }, score: number, passed: boolean }, JSX.Element>(data.recentQuizzes, (quiz, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm truncate">{quiz.quiz.title}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{quiz.score}/10</span>
                  <Badge variant={quiz.passed ? "default" : "destructive"}>
                    {quiz.passed ? "ผ่าน" : "ไม่ผ่าน"}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function AdminAnalyticsDashboard({ data }: AdminAnalyticsProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ผู้ใช้ทั้งหมด</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalUsers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">คอร์สทั้งหมด</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalCourses}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">การลงทะเบียน</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalEnrollments}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ใบประกาศนียบัตร</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalCertificates}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>การลงทะเบียนรายเดือน</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.monthlyEnrollments}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>คอร์สยอดนิยม</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {safeMap<{ title: string, enrollments: number }, JSX.Element>(data.popularCourses, (course, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm truncate">{course.title}</span>
                <Badge variant="secondary">{course.enrollments} คน</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ผลการสอบ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {safeArray<{ title: string, passRate: number, avgScore: number, attempts: number }>(data.quizPerformance).slice(0, 5).map((quiz, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="truncate">{quiz.title}</span>
                  <span>{quiz.passRate}% ผ่าน ({quiz.attempts} ครั้ง)</span>
                </div>
                <Progress value={quiz.passRate} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}