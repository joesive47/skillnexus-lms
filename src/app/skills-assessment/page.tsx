import { auth } from '@/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Target, Brain, TrendingUp, Award, FileSpreadsheet, Users, BookOpen, Settings, Upload } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function getAssessments() {
  try {
    // Add cache busting parameter
    const timestamp = Date.now()
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/admin/skills-assessment?t=${timestamp}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
    
    if (!response.ok) {
      console.error('Failed to fetch admin assessments:', response.status)
      return []
    }
    
    const adminAssessments = await response.json()
    
    // Transform admin assessments to public format
    return adminAssessments
      .filter((assessment: any) => assessment.enabled)
      .map((assessment: any) => ({
        id: assessment.id,
        title: assessment.title,
        description: assessment.description || `ประเมินทักษะด้าน ${assessment.title}`,
        category: assessment.category || 'general',
        questionCount: assessment.questions?.length || 0,
        skillCount: new Set(assessment.questions?.map((q: any) => q.skill) || []).size,
        estimatedTime: assessment.timeLimit || 30,
        difficulty: (assessment.questions?.length || 0) > 30 ? 'Advanced' : 
                   (assessment.questions?.length || 0) > 15 ? 'Intermediate' : 'Beginner'
      }))
  } catch (error) {
    console.error('Error fetching admin assessments:', error)
    return []
  }
}

export default async function SkillsAssessmentPage() {
  const session = await auth()
  const assessmentsData = await getAssessments()

  // assessmentsData is already processed from the API

  return (
    <div className="container mx-auto px-4 py-5 sm:px-6 sm:py-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold sm:text-4xl mb-3 sm:mb-4">ประเมินทักษะอาชีพ ฟรี!</h1>
          <p className="text-base text-muted-foreground sm:text-xl">
            ค้นพบจุดแข็งและพัฒนาทักษะให้ตรงกับตลาดแรงงาน
          </p>
          {!session && (
            <div className="mt-4 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200 text-left sm:text-center">
              <p className="text-blue-700 font-medium text-sm sm:text-base">
                🎉 ทดลองประเมินทักษะได้ฟรี! เวลาเพิ่มเป็น 30 นาที พร้อมฟีเจอร์หยุดชั่วคราว! หากต้องการผลลัพธ์และคำแนะนำ กรุณาเข้าสู่ระบบ
              </p>
            </div>
          )}
        </div>

        <div className="space-y-5 sm:space-y-8">
          {/* Admin Management Section */}
          {session?.user?.role === 'ADMIN' && (
            <Card className="bg-gradient-to-r from-green-500 to-teal-600 text-white">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-bold mb-1 sm:text-xl sm:mb-2">🛠️ จัดการระบบประเมินทักษะ</h2>
                    <p className="opacity-90 text-sm sm:text-base">สร้าง แก้ไข และจัดการแบบประเมินทักษะ</p>
                  </div>
                  <Link href="/dashboard/admin/skills-assessment" className="self-start sm:self-auto">
                    <Button variant="secondary" className="bg-white text-green-600 hover:bg-gray-100 text-sm">
                      <Settings className="w-4 h-4 mr-2" />
                      จัดการแบบประเมิน
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardContent className="p-5 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-2 sm:text-2xl">เริ่มต้นประเมินทักษะ</h2>
                  <p className="opacity-90 text-sm sm:text-base">ใช้เวลาเพียง 20-30 นาที เพื่อค้นหาทักษะที่เหมาะกับคุณ</p>
                </div>
                <div className="sm:text-right">
                  <div className="text-2xl font-bold">{assessmentsData.length}</div>
                  <div className="text-sm opacity-90">แบบประเมินพร้อมใช้งาน</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">แบบประเมินที่พร้อมใช้งาน</CardTitle>
            </CardHeader>
            <CardContent>
              {assessmentsData.length === 0 ? (
                <div className="text-center py-8">
                  <FileSpreadsheet className="w-12 h-12 mx-auto text-gray-400 mb-4 sm:w-16 sm:h-16" />
                  <p className="text-muted-foreground mb-4">ยังไม่มีแบบประเมินในระบบ</p>
                  {session?.user?.role === 'ADMIN' && (
                    <Link href="/dashboard/admin/skills-assessment">
                      <Button variant="outline" className="text-sm">
                        <Settings className="w-4 h-4 mr-2" />
                        สร้างแบบประเมิน
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {assessmentsData.map((assessment: any) => (
                    <Card key={assessment.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-start justify-between mb-3 gap-2">
                          <h3 className="font-semibold text-base sm:text-lg leading-tight">{assessment.title}</h3>
                          <Badge variant={assessment.difficulty === 'Beginner' ? 'secondary' :
                                        assessment.difficulty === 'Intermediate' ? 'default' : 'destructive'}
                                 className="shrink-0 text-xs">
                            {assessment.difficulty}
                          </Badge>
                        </div>
                        {assessment.description && (
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{assessment.description}</p>
                        )}
                        <div className="space-y-1.5 text-sm text-muted-foreground mb-4">
                          <div className="flex justify-between"><span>คำถาม:</span><span>{assessment.questionCount} ข้อ</span></div>
                          <div className="flex justify-between"><span>ทักษะ:</span><span>{assessment.skillCount} ทักษะ</span></div>
                          <div className="flex justify-between"><span>เวลา:</span><span>{assessment.estimatedTime} นาที</span></div>
                        </div>
                        {session ? (
                          <Link href={`/skills-test/${assessment.id}`}>
                            <Button className="w-full text-sm">
                              <Target className="w-4 h-4 mr-2" />เริ่มประเมิน
                            </Button>
                          </Link>
                        ) : (
                          <Link href="/login">
                            <Button className="w-full text-sm" variant="outline">
                              <Target className="w-4 h-4 mr-2" />เข้าสู่ระบบเพื่อประเมิน
                            </Button>
                          </Link>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
