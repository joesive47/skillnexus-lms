'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, ChevronRight, CheckCircle, Award, Target, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { getAssessmentQuestions, saveAssessmentResult } from '@/app/actions/assessment'
import { useSession } from 'next-auth/react'

export default function AssessmentPage() {
  const router = useRouter()
  const params = useParams()
  const { data: session } = useSession()
  const careerId = params.careerId as string

  const [questions, setQuestions] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const [startTime, setStartTime] = useState<number>(Date.now())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [currentSkill, setCurrentSkill] = useState('')

  useEffect(() => {
    loadQuestions()
  }, [careerId])

  useEffect(() => {
    if (questions.length > 0) {
      setCurrentSkill(questions[currentIndex]?.skill?.name || '')
    }
  }, [currentIndex, questions])

  const loadQuestions = async () => {
    try {
      const data = await getAssessmentQuestions(careerId)
      setQuestions(data)
      setLoading(false)
    } catch (error) {
      console.error('Error loading questions:', error)
      setLoading(false)
    }
  }

  const handleAnswerSelect = (questionId: string, optionIndex: string) => {
    const question = questions.find(q => q.id === questionId)
    const isMultipleChoice = question?.correctAnswer.includes(',')
    
    if (isMultipleChoice) {
      const currentAnswers = answers[questionId] || []
      const newAnswers = currentAnswers.includes(optionIndex)
        ? currentAnswers.filter(a => a !== optionIndex)
        : [...currentAnswers, optionIndex]
      
      setAnswers(prev => ({
        ...prev,
        [questionId]: newAnswers
      }))
    } else {
      setAnswers(prev => ({
        ...prev,
        [questionId]: [optionIndex]
      }))
    }
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      handleFinish()
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleFinish = async () => {
    if (!session?.user?.id) {
      router.push('/login')
      return
    }

    setSaving(true)
    try {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000)
      const result = await saveAssessmentResult({
        userId: session.user.id,
        careerId,
        answers,
        timeSpent
      })

      if (result.success) {
        router.push(`/skills-assessment/results/${result.resultId}`)
      }
    } catch (error) {
      console.error('Error saving result:', error)
    } finally {
      setSaving(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)

    return () => clearInterval(timer)
  }, [startTime])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อสอบ...</p>
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">ไม่พบข้อสอบ</h2>
            <p className="text-gray-600 mb-6">ไม่มีข้อสอบสำหรับสาขาอาชีพนี้</p>
            <Button onClick={() => router.push('/skills-assessment')}>
              กลับไปเลือกสาขาอาชีพ
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100
  const currentAnswers = answers[currentQuestion.id] || []
  const isMultipleChoice = currentQuestion.correctAnswer.includes(',')

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Top Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => router.push('/skills-assessment')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                กลับไปเลือกสาขาอาชีพ
              </Button>
              <div>
                <h1 className="font-semibold text-gray-900">{questions[0]?.career?.title}</h1>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="font-mono">{formatTime(elapsedTime)}</span>
              </div>
              <div className="text-sm font-medium text-gray-600">
                {currentIndex + 1} / {questions.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Progress Bar */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">ความคืบหน้า</span>
              <span className="text-sm font-medium text-indigo-600">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 mb-4" />
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Target className="w-4 h-4" />
              <span>ทักษะที่กำลังประเมิน: <span className="font-medium text-gray-900">{currentSkill}</span></span>
            </div>
          </CardContent>
        </Card>

        {/* Question Card */}
        <Card className="mb-6 shadow-lg">
          <CardContent className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    {currentQuestion.score} คะแนน
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 leading-relaxed">
                  คำถามที่ {currentIndex + 1}: {currentQuestion.questionText}
                </h2>
                {isMultipleChoice && (
                  <p className="text-sm text-gray-600 mt-2">* สามารถเลือกได้หลายคำตอบ</p>
                )}
              </div>
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              {[
                { key: '1', text: currentQuestion.option1 },
                { key: '2', text: currentQuestion.option2 },
                { key: '3', text: currentQuestion.option3 },
                { key: '4', text: currentQuestion.option4 }
              ].map((option) => (
                <Card
                  key={option.key}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    currentAnswers.includes(option.key)
                      ? 'border-indigo-500 bg-indigo-50 shadow-md'
                      : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                  }`}
                  onClick={() => handleAnswerSelect(currentQuestion.id, option.key)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        currentAnswers.includes(option.key)
                          ? 'border-indigo-500 bg-indigo-500'
                          : 'border-gray-300'
                      }`}>
                        {currentAnswers.includes(option.key) && (
                          <CheckCircle className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span className="text-gray-900 font-medium">{option.key}.</span>
                      <span className="text-gray-900">{option.text}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="px-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            ย้อนกลับ
          </Button>

          <Button
            onClick={handleNext}
            disabled={currentAnswers.length === 0 || saving}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 px-6"
          >
            {saving ? (
              'กำลังบันทึก...'
            ) : currentIndex === questions.length - 1 ? (
              <>
                ดูผลประเมิน
                <CheckCircle className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                ถัดไป
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Auto-save Indicator */}
        <div className="text-center mt-4">
          <span className="text-sm text-gray-500">
            บันทึกอัตโนมัติ ✓
          </span>
        </div>
      </div>
    </div>
  )
}