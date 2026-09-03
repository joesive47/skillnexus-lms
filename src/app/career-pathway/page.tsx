import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Target, TrendingUp, BookOpen, Sparkles, ArrowRight, BarChart, Settings } from 'lucide-react'
import Link from 'next/link'

export default async function CareerPathwayPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Badge className="mb-4 bg-purple-100 text-purple-800">
            <Sparkles className="h-3 w-3 mr-1" />
            AI-Powered Career Planning
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Career Pathway Engine</h1>
          <p className="text-gray-600 text-lg">วางแผนเส้นทางอาชีพด้วย AI และบรรลุเป้าหมายของคุณ</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-t-4 border-blue-500">
            <CardHeader>
              <Target className="h-12 w-12 text-blue-600 mb-3" />
              <CardTitle>ประเมินทักษะปัจจุบัน</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">AI วิเคราะห์ทักษะของคุณใน 8 มิติ</p>
              <Link href="/career-pathway/assessment">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  เริ่มประเมิน
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-t-4 border-purple-500">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-purple-600 mb-3" />
              <CardTitle>สร้าง Career Path</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">แผนที่เส้นทางสู่อาชีพที่ฝัน</p>
              <Link href="/career-pathway/planner">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  วางแผนเส้นทาง
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-t-4 border-green-500">
            <CardHeader>
              <BookOpen className="h-12 w-12 text-green-600 mb-3" />
              <CardTitle>คอร์สแนะนำ</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">คอร์สที่เหมาะกับคุณเฉพาะบุคคล</p>
              <Link href="/career-pathway/recommendations">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  ดูคำแนะนำ
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-t-4 border-orange-500">
            <CardHeader>
              <BarChart className="h-12 w-12 text-orange-600 mb-3" />
              <CardTitle>My Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">ติดตามความคืบหน้า</p>
              <Link href="/career-pathway/progress">
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  ดูความคืบหน้า
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {session.user.role === 'ADMIN' && (
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-t-4 border-red-500">
              <CardHeader>
                <Settings className="h-12 w-12 text-red-600 mb-3" />
                <CardTitle>Admin Panel</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">จัดการระบบ</p>
                <Link href="/career-pathway/admin">
                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    เข้าสู่ระบบ
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-t-4 border-purple-500">
            <CardHeader>
              <Sparkles className="h-12 w-12 text-purple-600 mb-3" />
              <CardTitle>AI Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">วิเคราะห์โอกาสความสำเร็จด้วย AI</p>
              <Link href="/career-pathway/analytics">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  วิเคราะห์
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-t-4 border-blue-500">
            <CardHeader>
              <Target className="h-12 w-12 text-blue-600 mb-3" />
              <CardTitle>AI Mentor</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">ปรึกษา AI Career Mentor 24/7</p>
              <Link href="/career-pathway/mentor">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  เริ่มแชท
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xl mb-8">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">🚀 ระบบที่ไม่มีใครทำได้</h2>
                <p className="text-indigo-100 mb-4">
                  AI วิเคราะห์เส้นทางอาชีพจาก 500+ ตำแหน่ง พร้อมแนะนำคอร์สเฉพาะบุคคล
                </p>
                <div className="flex gap-4">
                  <div className="bg-white/20 rounded-lg px-4 py-2">
                    <div className="text-2xl font-bold">500+</div>
                    <div className="text-sm text-indigo-100">อาชีพ</div>
                  </div>
                  <div className="bg-white/20 rounded-lg px-4 py-2">
                    <div className="text-2xl font-bold">1,000+</div>
                    <div className="text-sm text-indigo-100">ทักษะ</div>
                  </div>
                  <div className="bg-white/20 rounded-lg px-4 py-2">
                    <div className="text-2xl font-bold">85%</div>
                    <div className="text-sm text-indigo-100">ความแม่นยำ</div>
                  </div>
                </div>
              </div>
              <Sparkles className="h-32 w-32 text-white/20" />
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle>🎯 ตัวอย่างเส้นทางอาชีพ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">Junior Dev → CTO</p>
                    <p className="text-sm text-gray-600">5 ขั้นตอน • 10 ปี</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Tech</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">Data Analyst → AI Architect</p>
                    <p className="text-sm text-gray-600">4 ขั้นตอน • 7 ปี</p>
                  </div>
                  <Badge className="bg-purple-100 text-purple-800">Data</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">Marketing → CMO</p>
                    <p className="text-sm text-gray-600">4 ขั้นตอน • 8 ปี</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Business</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle>💡 ทำไมต้องใช้ Career Pathway?</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">วิเคราะห์ทักษะแบบ AI</p>
                    <p className="text-sm text-gray-600">ประเมินความสามารถที่แท้จริง</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">เส้นทางที่ชัดเจน</p>
                    <p className="text-sm text-gray-600">รู้ว่าต้องเรียนอะไรบ้าง</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">ประหยัดเวลา</p>
                    <p className="text-sm text-gray-600">เรียนแค่สิ่งที่จำเป็น</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}