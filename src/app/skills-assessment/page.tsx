'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Target, Brain, TrendingUp, Award, Upload, FileSpreadsheet, Users, BookOpen } from "lucide-react"
import Link from "next/link"
import { ImportPage } from '@/components/skill-assessment/import-page'
import { getCareers } from '@/app/actions/assessment'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

interface Career {
  id: string
  title: string
  description: string | null
  questionCount: number
  skillCount: number
  estimatedTime: number
  difficulty: string
}

function SkillsAssessmentPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [careers, setCareers] = useState<Career[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (mounted && status !== 'loading') {
      loadCareers()
    }
  }, [mounted, status])

  const loadCareers = async () => {
    try {
      const data = await getCareers()
      setCareers(data || [])
    } catch (error) {
      console.error('Failed to load careers:', error)
      setCareers([])
    } finally {
      setLoading(false)
    }
  }

  const handleImportComplete = async () => {
    setLoading(true)
    await loadCareers()
    setActiveTab('overview')
  }

  if (!mounted || status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">กำลังโหลด...</div>
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">ประเมินทักษะอาชีพ</h1>
          <p className="text-xl text-muted-foreground">
            ค้นพบจุดแข็งและพัฒนาทักษะให้ตรงกับตลาดแรงงาน
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">ภาพรวม</TabsTrigger>
            <TabsTrigger value="import">นำเข้าข้อสอบ</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Hero Card */}
            <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">เริ่มต้นประเมินทักษะ</h2>
                    <p className="opacity-90 mb-4">
                      ใช้เวลาเพียง 15-20 นาที เพื่อค้นหาทักษะที่เหมาะกับคุณ
                    </p>
                    <div className="flex items-center gap-4 text-sm opacity-90">
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        ฟรี 100%
                      </div>
                      <div className="flex items-center gap-1">
                        <Brain className="w-4 h-4" />
                        AI-Powered
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        ผลลัพธ์ทันที
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold mb-2">{careers.length}</div>
                    <div className="text-sm opacity-90">สาขาอาชีพพร้อมใช้งาน</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid gap-6 md:grid-cols-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{careers.length}</div>
                  <div className="text-sm text-muted-foreground">สาขาอาชีพ</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <FileSpreadsheet className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {careers.reduce((sum, career) => sum + career.questionCount, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">คำถาม</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Brain className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {careers.reduce((sum, career) => sum + career.skillCount, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">ทักษะ</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {Math.round(careers.reduce((sum, career) => sum + career.estimatedTime, 0) / careers.length) || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">นาที (เฉลี่ย)</div>
                </CardContent>
              </Card>
            </div>

            {/* Available Assessments */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>แบบประเมินที่พร้อมใช้งาน</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={loadCareers}
                    disabled={loading}
                    className="gap-2"
                  >
                    <TrendingUp className="w-4 h-4" />
                    {loading ? 'กำลังอัปเดต...' : 'อัปเดต'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">กำลังโหลด...</div>
                ) : careers.length === 0 ? (
                  <div className="text-center py-8">
                    <FileSpreadsheet className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-muted-foreground mb-4">ยังไม่มีแบบประเมินในระบบ</p>
                    <Button onClick={() => setActiveTab('import')} className="gap-2">
                      <Upload className="w-4 h-4" />
                      นำเข้าข้อสอบ
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {careers.map((career) => (
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
                          
                          <Link href={`/skills-assessment/assessment/${career.id}`}>
                            <Button className="w-full">
                              <Target className="w-4 h-4 mr-2" />
                              เริ่มประเมิน
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Features */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <Target className="w-8 h-8 text-blue-500 mb-2" />
                  <CardTitle>ประเมินทักษะแม่นยำ</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    ระบบ AI วิเคราะห์ทักษะของคุณในหลายมิติ เพื่อให้ผลลัพธ์ที่แม่นยำ
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <TrendingUp className="w-8 h-8 text-green-500 mb-2" />
                  <CardTitle>แนะนำเส้นทางอาชีพ</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    รับคำแนะนำเส้นทางอาชีพที่เหมาะกับทักษะและความสนใจของคุณ
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Brain className="w-8 h-8 text-purple-500 mb-2" />
                  <CardTitle>แผนพัฒนาทักษะ</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    ได้รับแผนการเรียนรู้ที่ปรับแต่งเฉพาะสำหรับคุณ
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <div className="flex gap-4 justify-center">
                <Link href="/courses">
                  <Button variant="outline" className="gap-2">
                    <BookOpen className="w-4 h-4" />
                    ดูหลักสูตรทั้งหมด
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button className="gap-2">
                    <Target className="w-4 h-4" />
                    กลับไปแดชบอร์ด
                  </Button>
                </Link>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="import">
            <ImportPage onImportComplete={handleImportComplete} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Export as dynamic component to prevent SSR issues
export default dynamic(() => Promise.resolve(SkillsAssessmentPage), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-screen">กำลังโหลด...</div>
})