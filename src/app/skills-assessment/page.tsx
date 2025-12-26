import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Target, Brain, TrendingUp, Award, FileSpreadsheet, Users, BookOpen } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function SkillsAssessmentPage() {
  const session = await auth()
  
  const careers = await prisma.career.findMany({
    include: {
      assessmentQuestions: {
        include: {
          skill: true
        }
      }
    }
  })

  const careersData = careers.map(career => ({
    id: career.id,
    title: career.title,
    description: career.description,
    questionCount: career.assessmentQuestions?.length || 0,
    skillCount: new Set(career.assessmentQuestions.map(q => q.skill?.name).filter(Boolean)).size,
    estimatedTime: Math.ceil((career.assessmentQuestions?.length || 0) * 2),
    difficulty: (career.assessmentQuestions?.length || 0) < 15 ? 'Beginner' : 
               (career.assessmentQuestions?.length || 0) <= 20 ? 'Intermediate' : 'Advanced'
  }))

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">ประเมินทักษะอาชีพ ฟรี!</h1>
          <p className="text-xl text-muted-foreground">
            ค้นพบจุดแข็งและพัฒนาทักษะให้ตรงกับตลาดแรงงาน
          </p>
          {!session && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-700 font-medium">
                🎉 ทดลองประเมินทักษะได้ฟรี! หากต้องการผลลัพธ์และคำแนะนำ กรุณาเข้าสู่ระบบ
              </p>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">เริ่มต้นประเมินทักษะ</h2>
                  <p className="opacity-90 mb-4">
                    ใช้เวลาเพียง 15-20 นาที เพื่อค้นหาทักษะที่เหมาะกับคุณ
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold mb-2">{careersData.length}</div>
                  <div className="text-sm opacity-90">สาขาอาชีพพร้อมใช้งาน</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>แบบประเมินที่พร้อมใช้งาน</CardTitle>
            </CardHeader>
            <CardContent>
              {careersData.length === 0 ? (
                <div className="text-center py-8">
                  <FileSpreadsheet className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-muted-foreground mb-4">ยังไม่มีแบบประเมินในระบบ</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {careersData.map((career) => (
                    <Card key={career.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-lg">{career.title}</h3>
                          <Badge variant={career.difficulty === 'Beginner' ? 'secondary' : 
                                        career.difficulty === 'Intermediate' ? 'default' : 'destructive'}>
                            {career.difficulty}
                          </Badge>
                        </div>
                        
                        {career.description && (
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {career.description}
                          </p>
                        )}
                        
                        <div className="space-y-2 text-sm text-muted-foreground mb-4">
                          <div className="flex justify-between">
                            <span>คำถาม:</span>
                            <span>{career.questionCount} ข้อ</span>
                          </div>
                          <div className="flex justify-between">
                            <span>ทักษะ:</span>
                            <span>{career.skillCount} ทักษะ</span>
                          </div>
                          <div className="flex justify-between">
                            <span>เวลาโดยประมาณ:</span>
                            <span>{career.estimatedTime} นาที</span>
                          </div>
                        </div>
                        
                        {session ? (
                          <Link href={`/skills-assessment/assessment/${career.id}`}>
                            <Button className="w-full">
                              <Target className="w-4 h-4 mr-2" />
                              เริ่มประเมิน
                            </Button>
                          </Link>
                        ) : (
                          <Link href="/login">
                            <Button className="w-full" variant="outline">
                              <Target className="w-4 h-4 mr-2" />
                              เข้าสู่ระบบเพื่อประเมิน
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
