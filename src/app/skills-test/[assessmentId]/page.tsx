"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Brain, Clock, Target, CheckCircle, XCircle, BarChart3, BookOpen } from "lucide-react"
import { useParams } from "next/navigation"

interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: number
  skill: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  weight: number
}

interface Assessment {
  id: string
  title: string
  description: string
  category: string
  questions: Question[]
  timeLimit: number
  passingScore: number
  enabled: boolean
  recommendedCourses: string[]
}

export default function PublicSkillsTest() {
  const params = useParams()
  const assessmentId = params.assessmentId as string
  
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<any[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isStarted, setIsStarted] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    // Create sample assessment if not exists
    const sampleAssessment: Assessment = {
      id: "1",
      title: "Web Development Skills Assessment",
      description: "ประเมินทักษะการพัฒนาเว็บไซต์ HTML, CSS, JavaScript",
      category: "programming",
      questions: [
        {
          id: "q1",
          text: "HTML ย่อมาจากอะไร?",
          options: [
            "HyperText Markup Language",
            "High Tech Modern Language", 
            "Home Tool Markup Language",
            "Hyperlink and Text Markup Language"
          ],
          correctAnswer: 0,
          skill: "HTML",
          difficulty: "beginner",
          weight: 1
        },
        {
          id: "q2", 
          text: "CSS ใช้สำหรับอะไร?",
          options: [
            "จัดการฐานข้อมูล",
            "จัดรูปแบบและการแสดงผล",
            "เขียนโปรแกรม JavaScript",
            "สร้างเซิร์ฟเวอร์"
          ],
          correctAnswer: 1,
          skill: "CSS",
          difficulty: "beginner", 
          weight: 1
        },
        {
          id: "q3",
          text: "JavaScript เป็นภาษาโปรแกรมประเภทใด?",
          options: [
            "Compiled Language",
            "Assembly Language", 
            "Interpreted Language",
            "Machine Language"
          ],
          correctAnswer: 2,
          skill: "JavaScript",
          difficulty: "intermediate",
          weight: 2
        }
      ],
      timeLimit: 10,
      passingScore: 70,
      enabled: true,
      recommendedCourses: [
        "HTML & CSS Fundamentals",
        "JavaScript Mastery", 
        "React Development"
      ]
    }

    // Load or create assessment
    const savedAssessments = localStorage.getItem('skillAssessments')
    if (savedAssessments) {
      const assessments: Assessment[] = JSON.parse(savedAssessments)
      const foundAssessment = assessments.find(a => a.id === assessmentId && a.enabled)
      if (foundAssessment) {
        setAssessment(foundAssessment)
        setTimeLeft(foundAssessment.timeLimit * 60)
      } else {
        setAssessment(sampleAssessment)
        setTimeLeft(sampleAssessment.timeLimit * 60)
      }
    } else {
      localStorage.setItem('skillAssessments', JSON.stringify([sampleAssessment]))
      setAssessment(sampleAssessment)
      setTimeLeft(sampleAssessment.timeLimit * 60)
    }
  }, [assessmentId])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isStarted && timeLeft > 0 && !isCompleted) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
    } else if (timeLeft === 0 && isStarted) {
      handleSubmitTest()
    }
    return () => clearTimeout(timer)
  }, [timeLeft, isStarted, isCompleted])

  const startTest = () => {
    if (!userEmail.trim()) {
      alert('กรุณากรอกอีเมลก่อนเริ่มทดสอบ')
      return
    }
    setIsStarted(true)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const nextQuestion = () => {
    if (selectedAnswer === null) return

    const currentQuestion = assessment!.questions[currentQuestionIndex]
    const existingAnswerIndex = userAnswers.findIndex(a => a.questionId === currentQuestion.id)
    
    if (existingAnswerIndex >= 0) {
      const newAnswers = [...userAnswers]
      newAnswers[existingAnswerIndex] = {
        questionId: currentQuestion.id,
        selectedAnswer: selectedAnswer
      }
      setUserAnswers(newAnswers)
    } else {
      setUserAnswers([...userAnswers, {
        questionId: currentQuestion.id,
        selectedAnswer: selectedAnswer
      }])
    }

    if (currentQuestionIndex < assessment!.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
    } else {
      handleSubmitTest()
    }
  }

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      const prevQuestion = assessment!.questions[currentQuestionIndex - 1]
      const prevAnswer = userAnswers.find(a => a.questionId === prevQuestion.id)
      setSelectedAnswer(prevAnswer?.selectedAnswer ?? null)
    }
  }

  const handleSubmitTest = () => {
    if (!assessment) return

    let totalScore = 0
    let maxScore = 0
    const skillBreakdown: Record<string, { correct: number, total: number }> = {}

    assessment.questions.forEach(question => {
      const userAnswer = userAnswers.find(a => a.questionId === question.id)
      maxScore += question.weight
      
      if (!skillBreakdown[question.skill]) {
        skillBreakdown[question.skill] = { correct: 0, total: 0 }
      }
      skillBreakdown[question.skill].total += question.weight

      if (userAnswer && userAnswer.selectedAnswer === question.correctAnswer) {
        totalScore += question.weight
        skillBreakdown[question.skill].correct += question.weight
      }
    })

    const finalScore = Math.round((totalScore / maxScore) * 100)
    const skillScores: Record<string, number> = {}
    
    Object.entries(skillBreakdown).forEach(([skill, data]) => {
      skillScores[skill] = Math.round((data.correct / data.total) * 100)
    })

    const recommendations = assessment.recommendedCourses.filter((_, index) => {
      const skillEntries = Object.entries(skillScores)
      if (skillEntries.length === 0) return true
      const avgScore = skillEntries.reduce((sum, [_, score]) => sum + score, 0) / skillEntries.length
      return avgScore < 80
    })

    const testResults = {
      id: Date.now().toString(),
      assessmentId: assessment.id,
      userEmail: userEmail,
      score: finalScore,
      completedAt: new Date().toISOString(),
      skillBreakdown: skillScores,
      recommendations: recommendations,
      passed: finalScore >= assessment.passingScore
    }

    const savedResults = localStorage.getItem('assessmentResults')
    const existingResults = savedResults ? JSON.parse(savedResults) : []
    existingResults.push(testResults)
    localStorage.setItem('assessmentResults', JSON.stringify(existingResults))

    setResults(testResults)
    setIsCompleted(true)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800"
    if (score >= 70) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">ไม่พบการประเมิน</h2>
            <p className="text-gray-600">การประเมินนี้อาจถูกปิดใช้งานหรือไม่มีอยู่</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isCompleted && results) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                {results.passed ? (
                  <CheckCircle className="w-16 h-16 text-green-500" />
                ) : (
                  <XCircle className="w-16 h-16 text-red-500" />
                )}
              </div>
              <CardTitle className="text-2xl">
                {results.passed ? "🎉 ยินดีด้วย! คุณผ่านการประเมิน" : "📚 ผลการประเมินของคุณ"}
              </CardTitle>
              <CardDescription>
                {assessment.title} - {new Date(results.completedAt).toLocaleString('th-TH')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className={`text-6xl font-bold mb-2 ${getScoreColor(results.score)}`}>
                  {results.score}%
                </div>
                <Badge className={getScoreBadge(results.score)}>
                  {results.passed ? `ผ่าน (ต้องการ ${assessment.passingScore}%)` : `ไม่ผ่าน (ต้องการ ${assessment.passingScore}%)`}
                </Badge>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  การแบ่งคะแนนตามทักษะ
                </h3>
                <div className="grid gap-4">
                  {Object.entries(results.skillBreakdown).map(([skill, score]) => (
                    <div key={skill} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{skill}</span>
                        <span className={getScoreColor(score)}>{score}%</span>
                      </div>
                      <Progress value={score} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>

              {results.recommendations.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    หลักสูตรแนะนำสำหรับคุณ
                  </h3>
                  <div className="grid gap-3">
                    {results.recommendations.map((course: string, index: number) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <Badge variant="outline">📚</Badge>
                        <span>{course}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-center">
                <Button onClick={() => window.location.reload()}>
                  ทำการประเมินใหม่
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card>
            <CardHeader className="text-center">
              <Brain className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-2xl">{assessment.title}</CardTitle>
              <CardDescription className="text-lg">{assessment.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{assessment.questions.length}</div>
                  <div className="text-sm text-gray-600">คำถาม</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{assessment.timeLimit}</div>
                  <div className="text-sm text-gray-600">นาที</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">{assessment.passingScore}%</div>
                  <div className="text-sm text-gray-600">คะแนนผ่าน</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">อีเมลของคุณ</Label>
                  <input
                    id="email"
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="กรอกอีเมลเพื่อรับผลการประเมิน"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <Button 
                  onClick={startTest} 
                  className="w-full" 
                  size="lg"
                  disabled={!userEmail.trim()}
                >
                  เริ่มการประเมิน
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const currentQuestion = assessment.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / assessment.questions.length) * 100

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-semibold">{assessment.title}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-red-600">
                <Clock className="w-4 h-4" />
                <span className="font-mono">{formatTime(timeLeft)}</span>
              </div>
              <Badge variant="outline">
                {currentQuestionIndex + 1} / {assessment.questions.length}
              </Badge>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-lg">
                  คำถามที่ {currentQuestionIndex + 1}
                </CardTitle>
                <CardDescription className="mt-2 text-base">
                  {currentQuestion.text}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary">{currentQuestion.skill}</Badge>
                <Badge variant="outline">{currentQuestion.difficulty}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={selectedAnswer?.toString()} 
              onValueChange={(value) => handleAnswerSelect(parseInt(value))}
              className="space-y-4"
            >
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex justify-between mt-6">
              <Button 
                variant="outline" 
                onClick={previousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                ← ก่อนหน้า
              </Button>
              
              <Button 
                onClick={nextQuestion}
                disabled={selectedAnswer === null}
              >
                {currentQuestionIndex === assessment.questions.length - 1 ? 'ส่งคำตอบ' : 'ถัดไป →'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}