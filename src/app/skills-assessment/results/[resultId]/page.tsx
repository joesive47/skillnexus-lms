'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import SkillAssessmentResults from '@/components/skill-assessment/skill-assessment-results'
import { getAssessmentResult } from '@/app/actions/assessment'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function ResultsPage() {
  const router = useRouter()
  const params = useParams()
  const resultId = params.resultId as string

  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadResult()
  }, [resultId])

  const loadResult = async () => {
    try {
      const data = await getAssessmentResult(resultId)
      setResult(data)
      setLoading(false)
    } catch (error) {
      console.error('Error loading result:', error)
      setLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดผลการประเมิน...</p>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">ไม่พบผลการประเมิน</h2>
            <p className="text-gray-600 mb-6">ผลการประเมินอาจถูกลบหรือไม่มีอยู่</p>
            <Button onClick={() => router.push('/skills-assessment')}>
              กลับไปเลือกสาขาอาชีพ
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Transform data for the enhanced dashboard
  const skillData = Object.entries(result.skillScores || {}).map(([name, scores]: [string, any]) => ({
    name,
    score: scores.max > 0 ? Math.round((scores.score / scores.max) * 100) : 0,
    average: Math.floor(Math.random() * 20) + 65 // Mock average
  }))

  const courseRecommendations = [
    {
      title: 'Complete Digital Marketing Course',
      provider: 'Udemy',
      duration: '12 ชั่วโมง',
      rating: 4.8,
      reviews: '12.5k',
      price: '฿2,900',
      skills: ['Social Media', 'Content Creation', 'Analytics'],
      match: 95,
      level: 'Intermediate',
      link: '#'
    },
    {
      title: 'Advanced Content Strategy',
      provider: 'Coursera',
      duration: '8 ชั่วโมง',
      rating: 4.7,
      reviews: '8.2k',
      price: '฿1,900',
      skills: ['Content Planning', 'SEO', 'Brand Strategy'],
      match: 85,
      level: 'Advanced',
      link: '#'
    },
    {
      title: 'Social Media Analytics',
      provider: 'LinkedIn Learning',
      duration: '6 ชั่วโมง',
      rating: 4.6,
      reviews: '5.1k',
      price: '฿1,500',
      skills: ['Data Analysis', 'Reporting', 'KPI Tracking'],
      match: 75,
      level: 'Beginner',
      link: '#'
    }
  ]

  return (
    <SkillAssessmentResults
      assessmentId={resultId}
      skillData={skillData}
      overallScore={Math.round(result.percentage || 0)}
      level={result.level || 'Intermediate'}
      assessmentTitle={result.career?.title || 'Career Assessment'}
      date={new Date(result.completedAt).toLocaleDateString('th-TH')}
      timeSpent={formatTime(result.timeSpent || 0)}
      percentile={Math.floor(Math.random() * 30) + 70}
      avgTimePerQuestion={formatTime(Math.floor((result.timeSpent || 0) / (result.totalQuestions || 1)))}
      accuracy={Math.round(((result.totalScore || 0) / (result.maxScore || 1)) * 100)}
      courseRecommendations={courseRecommendations}
    />
  )
}