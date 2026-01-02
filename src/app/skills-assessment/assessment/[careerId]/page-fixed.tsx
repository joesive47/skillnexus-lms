'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Clock, ArrowLeft, ArrowRight } from 'lucide-react'
import { useSession } from 'next-auth/react'

interface Question {
  id: string
  questionText: string
  option1: string
  option2: string
  option3: string
  option4: string
  correctAnswer: string
  skillName: string
  skillCategory: string
  difficultyLevel: string
}

interface Career {
  id: string
  title: string
  description: string
  category: string
  questionCount: number
  estimatedTime: number
}

export default function AssessmentPageFixed() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const careerId = params.careerId as string

  // Core state - simplified
  const [career, setCareer] = useState<Career | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [loading, setLoading] = useState(true)

  // Load assessment data
  useEffect(() => {
    const loadAssessment = async () => {
      try {
        const response = await fetch(`/api/admin/skills-assessment/${careerId}`)
        if (response.ok) {
          const assessment = await response.json()
          
          setCareer({
            id: careerId,
            title: assessment.title,
            description: assessment.description,
            category: assessment.category,
            questionCount: assessment.questions?.length || 0,
            estimatedTime: assessment.timeLimit || 30
          })
          
          const transformedQuestions = assessment.questions?.map((q: any) => ({
            id: q.id,
            questionText: q.text,
            option1: q.options[0] || '',
            option2: q.options[1] || '',
            option3: q.options[2] || '',
            option4: q.options[3] || '',
            correctAnswer: `option${q.correctAnswer + 1}`,
            skillName: q.skill,
            skillCategory: assessment.category,
            difficultyLevel: q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)
          })) || []
          
          setQuestions(transformedQuestions)
          setTimeLeft(assessment.timeLimit * 60)
        }
      } catch (error) {
        console.error('Error loading assessment:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAssessment()
  }, [careerId])

  // Timer
  useEffect(() => {
    if (timeLeft > 0 && questions.length > 0 && !loading) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && questions.length > 0) {
      handleSubmit()
    }
  }, [timeLeft, questions.length, loading])

  // Simple answer handler - no complex logic
  const selectAnswer = (optionKey: string) => {
    const questionId = questions[currentIndex].id
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionKey
    }))
  }

  // Simple navigation - always allowed
  const goNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      handleSubmit()
    }
  }

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const goToQuestion = (index: number) => {
    setCurrentIndex(index)
  }

  const handleSubmit = async () => {
    let correctAnswers = 0
    questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++
      }
    })

    const score = Math.round((correctAnswers / questions.length) * 100)
    router.push(`/skills-assessment/results?careerId=${careerId}&score=${score}&total=${questions.length}&correct=${correctAnswers}`)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">กำลังโหลดแบบประเมิน...</p>
        </div>
      </div>
    )
  }

  if (!career || questions.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-2">แบบประเมินยังไม่พร้อม</h2>
              <p className="text-muted-foreground mb-6">
                แบบประเมินสำหรับ {career?.title} ไม่พบหรือยังไม่พร้อมใช้งาน
              </p>
              <Button onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                กลับไปหน้าหลัก
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100
  const answeredCount = Object.keys(answers).length
  const currentAnswer = answers[currentQuestion.id] // Simple answer lookup

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">{career.title}</h1>
              <p className="text-muted-foreground">{career.description}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-lg font-mono">
                <Clock className="w-5 h-5" />
                <span className={timeLeft < 300 ? 'text-red-500' : 'text-green-600'}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>ข้อ {currentIndex + 1} จาก {questions.length}</span>
              <span>ตอบแล้ว {answeredCount}/{questions.length} ข้อ</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">
              ข้อ {currentIndex + 1}: {currentQuestion.questionText}
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline">{currentQuestion.skillName}</Badge>
              <Badge variant="secondary">{currentQuestion.difficultyLevel}</Badge>
              {currentAnswer && (
                <Badge className="bg-green-100 text-green-700">✓ ตอบแล้ว</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['option1', 'option2', 'option3', 'option4'].map((optionKey, index) => {
                const optionText = currentQuestion[optionKey as keyof Question] as string
                if (!optionText?.trim()) return null
                
                // Simple selection check - no complex logic
                const isSelected = currentAnswer === optionKey
                
                return (
                  <button
                    key={optionKey}
                    onClick={() => selectAnswer(optionKey)}
                    className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {isSelected && (
                          <div className="w-3 h-3 rounded-full bg-white" />
                        )}
                      </div>
                      <span className="font-medium text-gray-600">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <span className={isSelected ? 'font-medium text-blue-700' : 'text-gray-700'}>
                        {optionText}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Navigation - Always enabled */}
        <div className="flex justify-between mb-6">
          <Button
            variant="outline"
            onClick={goPrev}
            disabled={currentIndex === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            ข้อก่อนหน้า
          </Button>

          <Button
            onClick={goNext}
            className={currentIndex === questions.length - 1 ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            {currentIndex === questions.length - 1 ? 'ส่งคำตอบ' : 'ข้อถัดไป'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Question Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">ภาพรวมคำตอบ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-10 gap-2">
              {questions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => goToQuestion(index)}
                  className={`w-10 h-10 rounded border-2 font-medium transition-all ${
                    index === currentIndex
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : answers[question.id]
                      ? 'border-green-500 bg-green-100 text-green-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p>💡 เคล็ดลับ: คลิกหมายเลขข้อเพื่อข้ามไปข้อนั้นได้ทันที</p>
              <p>✅ สีเขียว = ตอบแล้ว | ⚪ สีขาว = ยังไม่ตอบ | 🔵 สีน้ำเงิน = ข้อปัจจุบัน</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}