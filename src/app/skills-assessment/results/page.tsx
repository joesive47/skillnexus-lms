'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Trophy, 
  Target, 
  BookOpen, 
  TrendingUp, 
  Clock, 
  Star,
  ArrowLeft,
  Download,
  Share2
} from 'lucide-react'
import Link from 'next/link'

interface SkillAnalysis {
  skillName: string
  score: number
  level: string
  recommendation: string
}

export default function AssessmentResultsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const careerId = searchParams.get('careerId')
  const score = parseInt(searchParams.get('score') || '0')
  const total = parseInt(searchParams.get('total') || '0')
  const correct = parseInt(searchParams.get('correct') || '0')
  const earned = parseInt(searchParams.get('earned') || '0')
  const totalScore = parseInt(searchParams.get('totalScore') || '0')
  const skillsParam = searchParams.get('skills') || ''

  const [careerTitle, setCareerTitle] = useState('')
  const [skillAnalysis, setSkillAnalysis] = useState<SkillAnalysis[]>([])

  useEffect(() => {
    // Parse skill scores from URL
    if (skillsParam) {
      const skills = skillsParam.split(',').map(item => {
        const [skillName, scoreStr] = item.split(':')
        const skillScore = parseInt(scoreStr) || 0
        return {
          skillName: decodeURIComponent(skillName),
          score: skillScore,
          level: skillScore >= 80 ? 'Expert' : skillScore >= 60 ? 'Intermediate' : 'Beginner',
          recommendation: skillScore >= 80 
            ? 'ทักษะดีมาก! พร้อมสำหรับงานระดับสูง' 
            : skillScore >= 60
            ? 'ทักษะอยู่ในระดับดี ควรฝึกฝนเพิ่มเติม'
            : 'ควรเริ่มต้นเรียนรู้พื้นฐานเพิ่มเติม'
        }
      })
      setSkillAnalysis(skills)
    }
  }, [skillsParam])

  const getScoreLevel = (score: number) => {
    if (score >= 80) return { level: 'Expert', color: 'text-green-600', bgColor: 'bg-green-100' }
    if (score >= 60) return { level: 'Intermediate', color: 'text-blue-600', bgColor: 'bg-blue-100' }
    return { level: 'Beginner', color: 'text-orange-600', bgColor: 'bg-orange-100' }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-blue-600'
    return 'text-orange-600'
  }

  const getRecommendations = () => {
    if (score >= 80) {
      return [
        'ทักษะของคุณอยู่ในระดับสูง! ลองท้าทายตัวเองกับโปรเจคจริง',
        'พิจารณาเรียนคอร์ส Advanced AI Applications',
        'แชร์ความรู้กับชุมชนหรือสอนผู้อื่น'
      ]
    } else if (score >= 60) {
      return [
        'ทักษะของคุณอยู่ในระดับกลาง ควรฝึกฝนเพิ่มเติม',
        'แนะนำคอร์ส Intermediate Prompt Engineering',
        'ลองทำโปรเจคเล็กๆ เพื่อฝึกฝนทักษะ'
      ]
    } else {
      return [
        'ควรเริ่มต้นด้วยพื้นฐาน AI และ Prompt Engineering',
        'แนะนำคอร์ส Beginner AI Fundamentals',
        'ฝึกฝนการเขียน Prompt เบื้องต้นทุกวัน'
      ]
    }
  }

  const scoreInfo = getScoreLevel(score)

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <Trophy className={`w-16 h-16 mx-auto ${getScoreColor(score)}`} />
          </div>
          <h1 className="text-3xl font-bold mb-2">ผลการประเมินทักษะ</h1>
          <p className="text-xl text-muted-foreground">{careerTitle}</p>
        </div>

        {/* Score Summary */}
        <Card className="mb-6">
          <CardContent className="p-8">
            <div className="text-center">
              <div className={`text-6xl font-bold mb-4 ${getScoreColor(score)}`}>
                {score}%
              </div>
              <Badge className={`text-lg px-4 py-2 ${scoreInfo.bgColor} ${scoreInfo.color}`}>
                {score >= 70 ? '✅ ผ่าน' : '❌ ไม่ผ่าน'} ({scoreInfo.level})
              </Badge>
              <div className="mt-6 grid grid-cols-2 gap-4 max-w-md mx-auto">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{correct}/{total}</div>
                  <div className="text-sm text-muted-foreground">ตอบถูก/ทั้งหมด</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{earned}/{totalScore}</div>
                  <div className="text-sm text-muted-foreground">คะแนนที่ได้</div>
                </div>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                {score >= 70 ? '🎉 ยินดีด้วย! คุณผ่านการประเมิน' : '💪 พยายามอีกครั้ง! (ต้องการ 70%)'}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skill Breakdown */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              การวิเคราะห์ทักษะ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {skillAnalysis.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{skill.skillName}</span>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${getScoreColor(skill.score)}`}>
                        {Math.round(skill.score)}%
                      </span>
                      <Badge variant="outline">{skill.level}</Badge>
                    </div>
                  </div>
                  <Progress value={skill.score} className="h-2" />
                  <p className="text-sm text-muted-foreground">{skill.recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              คำแนะนำสำหรับคุณ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getRecommendations().map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <span>{recommendation}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Learning Path */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              เส้นทางการเรียนรู้ที่แนะนำ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">ขั้นที่ 1 (1-2 สัปดาห์)</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  พื้นฐาน AI และการเขียน Prompt เบื้องต้น
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">ขั้นที่ 2 (2-4 สัปดาห์)</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  เทคนิค Advanced Prompting และ Fine-tuning
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">ขั้นที่ 3 (1-2 เดือน)</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  โปรเจคจริงและการประยุกต์ใช้งาน
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => router.push('/skills-assessment')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            ทำแบบประเมินอื่น
          </Button>
          
          <Link href="/courses">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <BookOpen className="w-4 h-4 mr-2" />
              ดูคอร์สที่แนะนำ
            </Button>
          </Link>
          
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            ดาวน์โหลดผล
          </Button>
          
          <Button variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            แชร์ผลลัพธ์
          </Button>
        </div>

        {/* Certificate Preview */}
        {score >= 70 && (
          <Card className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-6 text-center">
              <Trophy className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">🎉 ยินดีด้วย!</h3>
              <p className="text-muted-foreground mb-4">
                คุณผ่านการประเมินแล้ว! สามารถรับใบรับรองทักษะได้
              </p>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                รับใบรับรองทักษะ
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}