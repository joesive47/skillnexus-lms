'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Clock, ArrowLeft, ArrowRight } from 'lucide-react'
import { QuestionOption } from '@/components/skill-assessment/question-option'

interface Question {
  id: string
  questionText: string
  option1: string
  option2: string
  option3: string
  option4: string
  skillName: string
  skillCategory: string
  difficultyLevel: string
  score?: number
  weight?: number
}

interface Career {
  id: string
  title: string
  description: string
  category: string
  questionCount: number
  estimatedTime: number
}

export default function AssessmentPage() {
  const params = useParams()
  const router = useRouter()
  const careerId = params.careerId as string

  // Core state - answers stored as numeric indices (0-3)
  const [career, setCareer] = useState<Career | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [loading, setLoading] = useState(true)

  // Load assessment data
  useEffect(() => {
    const loadAssessment = async () => {
      try {
        const response = await fetch(`/api/skills-assessment/${careerId}`)
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
          
          const transformedQuestions = assessment.questions?.map((q: {
            id: string; text: string; options: string[]; skill: string; difficulty: string; weight?: number
          }) => ({
            id: q.id,
            questionText: q.text,
            option1: q.options[0] || '',
            option2: q.options[1] || '',
            option3: q.options[2] || '',
            option4: q.options[3] || '',
            skillName: q.skill,
            skillCategory: assessment.category,
            difficultyLevel: q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1),
            score: q.weight || 1,
            weight: q.weight || 1
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

  // Debug effect removed - using simple numeric comparison
  useEffect(() => {
    if (questions.length > 0 && currentIndex >= 0) {
      const currentQuestion = questions[currentIndex]
      const currentAnswer = answers[currentQuestion?.id]
      
      // Validate answer is 0-3 index
      if (currentAnswer !== undefined && (currentAnswer < 0 || currentAnswer > 3)) {
        console.warn('Invalid answer index:', currentAnswer)
      }
    }
  }, [currentIndex, answers, questions])

  // Timer
  useEffect(() => {
    if (timeLeft > 0 && questions.length > 0 && !loading) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && questions.length > 0) {
      handleSubmit()
    }
  }, [timeLeft, questions.length, loading])

  // Fixed answer handler - store as numeric index (0-3)
  const selectAnswer = (optionKey: string) => {
    const questionId = questions[currentIndex].id
    // Convert option1-4 to 0-3 index
    const optionIndex = parseInt(optionKey.replace('option', '')) - 1
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }))
  }

  // Fixed navigation - save answer before moving
  const goNext = () => {
    // Save current answer if selected
    if (currentAnswer !== undefined) {
      const questionId = questions[currentIndex].id
      setAnswers(prev => ({ ...prev, [questionId]: currentAnswer }))
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      // For last question, ensure answer is saved before submit
      setTimeout(() => {
        handleSubmit()
      }, 50)
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
    // Ensure current answer is saved
    const finalAnswers = { ...answers }
    if (currentAnswer !== undefined && questions[currentIndex]) {
      finalAnswers[questions[currentIndex].id] = currentAnswer
    }

    // Transform answers to match API format (option IDs)
    const transformedAnswers: Record<string, string[]> = {}
    Object.entries(finalAnswers).forEach(([questionId, answerIndex]) => {
      const question = questions.find(q => q.id === questionId)
      if (question) {
        // Convert index to option text for saveAssessmentResult
        const optionText = question[`option${(answerIndex as number) + 1}` as keyof Question] as string
        transformedAnswers[questionId] = [optionText]
      }
    })

    // Store answers in sessionStorage for results page
    sessionStorage.setItem('assessmentAnswers', JSON.stringify(transformedAnswers))

    const response = await fetch(`/api/skills-assessment/${careerId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: finalAnswers })
    })
    if (!response.ok) {
      alert('ไม่สามารถตรวจคำตอบได้ กรุณาลองใหม่อีกครั้ง')
      return
    }
    const result = await response.json() as {
      score: number
      totalQuestions: number
      correctAnswers: number
      earnedScore: number
      totalScore: number
      skillBreakdown: Record<string, number>
      wrongQuestions: Array<Record<string, unknown>>
    }
    sessionStorage.setItem('wrongQuestions', JSON.stringify(result.wrongQuestions))
    const skillParams = Object.entries(result.skillBreakdown)
      .map(([skill, value]) => `${encodeURIComponent(skill)}:${value}`)
      .join(',')
    router.push(
      `/skills-assessment/results?careerId=${careerId}&score=${result.score}&total=${result.totalQuestions}&correct=${result.correctAnswers}&earned=${result.earnedScore}&totalScore=${result.totalScore}&skills=${skillParams}`
    )
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
  // Fixed: Get current answer only for the current question
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined

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
            <div className="flex justify-end text-sm">
              <span>ตอบแล้ว {answeredCount}/{questions.length} ข้อ</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>



        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">
              {currentQuestion.questionText}
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
                const isSelected = currentAnswer === index
                return (
                  <QuestionOption
                    key={`${currentQuestion.id}-${optionKey}`}
                    optionKey={optionKey}
                    optionText={currentQuestion[optionKey as keyof Question] as string}
                    optionIndex={index}
                    isSelected={isSelected}
                    onSelect={selectAnswer}
                    questionId={currentQuestion.id}
                  />
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
              {questions.map((question, index) => {
                const hasAnswer = answers[question.id] !== undefined
                const isCurrent = index === currentIndex
                
                return (
                  <button
                    key={`overview-${question.id}`}
                    onClick={() => goToQuestion(index)}
                    className={`w-10 h-10 rounded border-2 font-medium transition-all ${
                      isCurrent
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : hasAnswer
                        ? 'border-green-500 bg-green-100 text-green-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {index + 1}
                  </button>
                )
              })}
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
