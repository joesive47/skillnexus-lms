'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Sparkles, Share2, Download, Medal, TrendingUp, Zap, 
  BarChart3, Target, CheckCircle, BookOpen, Star
} from 'lucide-react'
import { getAssessmentResult } from '@/app/actions/assessment'
import { SpiderChart } from './spider-chart'

interface DashboardPageProps {
  resultId: string
  onRetake: () => void
}

interface AssessmentResult {
  id: string
  totalScore: number
  maxScore: number
  percentage: number
  level: string
  timeSpent: number
  skillScores: Record<string, { score: number; max: number }>
  career: { title: string }
  completedAt: string | Date
}

const mockCourses = [
  {
    id: '1',
    title: 'Advanced React Development',
    provider: 'TechAcademy',
    duration: '40 ชั่วโมง',
    rating: 4.8,
    reviews: 12500,
    price: 2900,
    match: 95,
    level: 'Intermediate',
    skills: ['React', 'JavaScript', 'TypeScript']
  },
  {
    id: '2',
    title: 'UI/UX Design Fundamentals',
    provider: 'DesignPro',
    duration: '25 ชั่วโมง',
    rating: 4.9,
    reviews: 8200,
    price: 2400,
    match: 85,
    level: 'Beginner',
    skills: ['Figma', 'Design Thinking', 'Prototyping']
  },
  {
    id: '3',
    title: 'Digital Marketing Strategy',
    provider: 'MarketingHub',
    duration: '30 ชั่วโมง',
    rating: 4.7,
    reviews: 15600,
    price: 3200,
    match: 75,
    level: 'Advanced',
    skills: ['SEO', 'Social Media', 'Analytics']
  }
]

export function DashboardPage({ resultId, onRetake }: DashboardPageProps) {
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadResult()
  }, [resultId])

  const loadResult = async () => {
    try {
      const data = await getAssessmentResult(resultId)
      setResult(data)
    } catch (error) {
      console.error('Failed to load result:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getAverageTimePerQuestion = () => {
    if (!result) return '0:00'
    const avgSeconds = Math.floor(result.timeSpent / Object.keys(result.skillScores).length)
    return formatTime(avgSeconds)
  }

  const getPercentile = () => {
    if (!result) return 0
    // Mock calculation based on score
    return Math.max(10, Math.min(95, 100 - result.percentage + Math.random() * 20))
  }

  const getSkillInsights = () => {
    if (!result) return { strengths: [], improvements: [] }
    
    const skills = Object.entries(result.skillScores)
    const strengths = skills
      .filter(([_, data]) => (data.score / data.max) * 100 >= 80)
      .map(([skill]) => skill)
    
    const improvements = skills
      .filter(([_, data]) => (data.score / data.max) * 100 < 70)
      .map(([skill]) => skill)
    
    return { strengths, improvements }
  }

  if (loading) {
    return <div className="flex justify-center p-8">กำลังโหลด...</div>
  }

  if (!result) {
    return <div className="text-center p-8">ไม่พบผลการประเมิน</div>
  }

  const percentile = getPercentile()
  const { strengths, improvements } = getSkillInsights()
  const avgTimePerQuestion = getAverageTimePerQuestion()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Sparkles className="w-12 h-12" />
              <div>
                <h1 className="text-3xl font-bold">ผลการประเมินทักษะ</h1>
                <p className="text-xl opacity-90">{result.career.title}</p>
                <p className="opacity-75">
                  {new Date(result.completedAt).toLocaleDateString('th-TH')} • 
                  เวลาที่ใช้: {formatTime(result.timeSpent)}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-indigo-600">
                <Share2 className="w-4 h-4 mr-2" />
                แชร์
              </Button>
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-indigo-600">
                <Download className="w-4 h-4 mr-2" />
                PDF
              </Button>
              <Button 
                onClick={onRetake}
                className="bg-white text-indigo-600 hover:bg-gray-100"
              >
                ทำใหม่
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{Math.round(result.percentage)}</div>
                <div className="text-lg opacity-90">คะแนนรวม</div>
                <Progress value={result.percentage} className="mt-3 bg-white/20" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Medal className="w-8 h-8" />
                <div>
                  <div className="text-2xl font-bold">{result.level}</div>
                  <div className="opacity-90">ระดับ</div>
                  <div className="text-sm opacity-75">
                    {result.level === 'Expert' ? 'ยอดเยี่ยม!' : 
                     result.level === 'Advanced' ? '18 คะแนนสู่ Expert' :
                     result.level === 'Intermediate' ? '25 คะแนนสู่ Advanced' :
                     '35 คะแนนสู่ Intermediate'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8" />
                <div>
                  <div className="text-2xl font-bold">Top {Math.round(100 - percentile)}%</div>
                  <div className="opacity-90">Percentile</div>
                  <div className="text-sm opacity-75">
                    ดีกว่า {Math.round(percentile)}% ของผู้เข้าทดสอบ
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Zap className="w-8 h-8" />
                <div>
                  <div className="text-2xl font-bold">{avgTimePerQuestion}</div>
                  <div className="opacity-90">เวลาเฉลี่ยต่อข้อ</div>
                  <div className="text-sm opacity-75">
                    เร็วกว่าค่าเฉลี่ย 15%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Spider Chart */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  วิเคราะห์ทักษะรอบด้าน
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SpiderChart skillScores={result.skillScores} />
              </CardContent>
            </Card>
          </div>

          {/* Skill Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  รายละเอียดทักษะ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(result.skillScores).map(([skill, data]) => {
                  const percentage = (data.score / data.max) * 100
                  const trend = percentage >= 80 ? 'up' : percentage >= 60 ? 'neutral' : 'down'
                  
                  return (
                    <div key={skill} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{skill}</span>
                        <div className="flex items-center gap-2">
                          <TrendingUp 
                            className={`w-4 h-4 ${
                              trend === 'up' ? 'text-green-500' : 
                              trend === 'neutral' ? 'text-yellow-500' : 
                              'text-red-500'
                            }`} 
                          />
                          <span className="text-lg font-bold text-indigo-600">
                            {data.score}/{data.max}
                          </span>
                        </div>
                      </div>
                      <Progress value={percentage} className="h-2" />
                      <p className="text-sm text-gray-600">
                        {percentage >= 90 ? 'ระดับเชี่ยวชาญ' :
                         percentage >= 80 ? 'สูงกว่าค่าเฉลี่ย' :
                         percentage >= 70 ? 'เกณฑ์ดี' :
                         percentage >= 60 ? 'ควรพัฒนา' :
                         'ต้องเรียนรู้เพิ่ม'}
                      </p>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recommended Courses */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              หลักสูตรแนะนำ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mockCourses.map(course => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="relative mb-4">
                      <Badge className="absolute -top-2 -right-2 bg-green-500">
                        {course.match}% Match
                      </Badge>
                      <Badge variant="outline" className="mb-2">
                        {course.level}
                      </Badge>
                    </div>
                    
                    <h3 className="font-bold text-lg mb-2 hover:text-indigo-600 cursor-pointer">
                      {course.title}
                    </h3>
                    
                    <div className="text-sm text-gray-600 mb-3">
                      {course.provider} • {course.duration}
                    </div>
                    
                    <div className="flex items-center gap-1 mb-3">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{course.rating}</span>
                      <span className="text-gray-500">({course.reviews.toLocaleString()})</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {course.skills.map(skill => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-indigo-600">
                        ฿{course.price.toLocaleString()}
                      </span>
                      <Button className="bg-gradient-to-r from-indigo-600 to-purple-600">
                        เรียนเลย →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card className="bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-bold text-green-800">จุดแข็ง</h3>
              </div>
              {strengths.length > 0 ? (
                <ul className="space-y-2">
                  {strengths.map(skill => (
                    <li key={skill} className="text-green-700">
                      • {skill} - คะแนนสูงเป็นพิเศษ
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-green-700">ทุกทักษะมีพื้นที่ในการพัฒนา</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-orange-600" />
                <h3 className="text-lg font-bold text-orange-800">ควรพัฒนา</h3>
              </div>
              {improvements.length > 0 ? (
                <ul className="space-y-2">
                  {improvements.map(skill => (
                    <li key={skill} className="text-orange-700">
                      • {skill} - แนะนำให้เรียนรู้เพิ่มเติม
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-orange-700">ทักษะทุกด้านอยู่ในเกณฑ์ดี</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 p-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl">
          <h3 className="text-2xl font-bold mb-4">ต้องการคำแนะนำเพิ่มเติม?</h3>
          <p className="text-gray-600 mb-6">
            พูดคุยกับที่ปรึกษาเพื่อวางแผนการเรียนรู้ที่เหมาะกับคุณ
          </p>
          <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-lg px-8 py-3">
            นัดหมายที่ปรึกษา
          </Button>
        </div>
      </div>
    </div>
  )
}