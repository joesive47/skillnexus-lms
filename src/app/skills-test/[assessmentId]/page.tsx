"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Brain, Clock, Target, CheckCircle, XCircle, BarChart3, BookOpen, AlertCircle } from "lucide-react"
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

interface UserAnswer {
  questionId: string
  selectedAnswer: number
  timestamp: number
}

export default function PublicSkillsTest() {
  const params = useParams()
  const assessmentId = params.assessmentId as string
  
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Map<string, UserAnswer>>(new Map())
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isStarted, setIsStarted] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [userEmail, setUserEmail] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load assessment data
  useEffect(() => {
    loadAssessment()
  }, [assessmentId])

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isStarted && timeLeft > 0 && !isCompleted) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && isStarted && !isCompleted) {
      handleSubmitTest()
    }
    return () => clearTimeout(timer)
  }, [timeLeft, isStarted, isCompleted])

  // Load existing answer when question changes
  useEffect(() => {
    if (assessment && assessment.questions[currentQuestionIndex]) {
      const currentQuestion = assessment.questions[currentQuestionIndex]
      const existingAnswer = userAnswers.get(currentQuestion.id)
      setSelectedAnswer(existingAnswer?.selectedAnswer ?? null)
    }
  }, [currentQuestionIndex, assessment, userAnswers])

  const loadAssessment = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/skills-assessment/${assessmentId}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Assessment loaded:', data.title, 'Questions:', data.questions.length)
        setAssessment(data)
        setTimeLeft(data.timeLimit * 60)
      } else {
        console.log('⚠️ Using fallback assessment')
        // Enhanced fallback assessment
        const sampleAssessment: Assessment = {
          id: "sample-1",
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
            },
            {
              id: "q4",
              text: "React เป็นอะไร?",
              options: [
                "Database",
                "JavaScript Library",
                "Web Server",
                "Operating System"
              ],
              correctAnswer: 1,
              skill: "React",
              difficulty: "intermediate",
              weight: 2
            },
            {
              id: "q5",
              text: "Node.js ใช้สำหรับอะไร?",
              options: [
                "Frontend Development",
                "Database Management",
                "Backend Development",
                "Mobile Development"
              ],
              correctAnswer: 2,
              skill: "Node.js",
              difficulty: "advanced",
              weight: 3
            }
          ],
          timeLimit: 15,
          passingScore: 70,
          enabled: true,
          recommendedCourses: [
            "HTML & CSS Fundamentals",
            "JavaScript Mastery", 
            "React Development",
            "Node.js Backend"
          ]
        }
        setAssessment(sampleAssessment)
        setTimeLeft(sampleAssessment.timeLimit * 60)
      }
    } catch (error) {
      console.error('❌ Failed to load assessment:', error)
      setError('ไม่สามารถโหลดแบบประเมินได้ กรุณาลองใหม่อีกครั้ง')
    } finally {
      setLoading(false)
    }
  }

  const startTest = () => {
    if (!userEmail.trim()) {
      alert('กรุณากรอกอีเมลก่อนเริ่มทดสอบ')
      return
    }
    console.log('🚀 Starting test for:', userEmail)
    setIsStarted(true)
    // Clear any existing answers
    setUserAnswers(new Map())
    setSelectedAnswer(null)
    setCurrentQuestionIndex(0)
  }

  const handleAnswerSelect = useCallback((answerIndex: number) => {
    console.log('📝 Answer selected:', answerIndex, 'for question:', currentQuestionIndex + 1)
    setSelectedAnswer(answerIndex)
  }, [currentQuestionIndex])

  const saveCurrentAnswer = useCallback(() => {
    if (!assessment || selectedAnswer === null) return
    
    const currentQuestion = assessment.questions[currentQuestionIndex]
    const newAnswers = new Map(userAnswers)
    
    newAnswers.set(currentQuestion.id, {
      questionId: currentQuestion.id,
      selectedAnswer: selectedAnswer,
      timestamp: Date.now()
    })
    
    setUserAnswers(newAnswers)
    console.log('💾 Answer saved:', {
      questionId: currentQuestion.id,
      selectedAnswer: selectedAnswer,
      questionText: currentQuestion.text.substring(0, 50) + '...'
    })
  }, [assessment, currentQuestionIndex, selectedAnswer, userAnswers])

  const nextQuestion = () => {
    if (selectedAnswer === null) {
      alert('กรุณาเลือกคำตอบก่อนดำเนินการต่อ')
      return
    }

    // Save current answer first
    saveCurrentAnswer()

    if (currentQuestionIndex < assessment!.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      // For last question, wait a bit to ensure state is updated
      setTimeout(() => {
        handleSubmitTest()
      }, 100)
    }
  }

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      // Save current answer if selected
      if (selectedAnswer !== null) {
        saveCurrentAnswer()
      }
      setCurrentQuestionIndex(prev => prev - 1)
      // selectedAnswer will be set by useEffect
    }
  }

  const handleSubmitTest = useCallback(() => {
    if (!assessment) return

    // Make sure we have the latest userAnswers from state
    const finalAnswers = new Map(userAnswers)
    
    // If there's a selected answer for current question that hasn't been saved yet, save it
    if (selectedAnswer !== null && assessment.questions[currentQuestionIndex]) {
      const currentQuestion = assessment.questions[currentQuestionIndex]
      finalAnswers.set(currentQuestion.id, {
        questionId: currentQuestion.id,
        selectedAnswer: selectedAnswer,
        timestamp: Date.now()
      })
    }

    console.log('📊 Calculating results...')
    console.log('Total answers collected:', finalAnswers.size)
    
    let totalScore = 0
    let maxScore = 0
    const skillBreakdown: Record<string, { correct: number, total: number }> = {}
    const detailedResults: any[] = []

    assessment.questions.forEach((question, index) => {
      const userAnswer = finalAnswers.get(question.id)
      maxScore += question.weight
      
      if (!skillBreakdown[question.skill]) {
        skillBreakdown[question.skill] = { correct: 0, total: 0 }
      }
      skillBreakdown[question.skill].total += question.weight

      const isCorrect = userAnswer && userAnswer.selectedAnswer === question.correctAnswer
      
      if (isCorrect) {
        totalScore += question.weight
        skillBreakdown[question.skill].correct += question.weight
      }

      detailedResults.push({
        questionIndex: index + 1,
        questionText: question.text,
        userAnswer: userAnswer?.selectedAnswer ?? -1,
        correctAnswer: question.correctAnswer,
        isCorrect: isCorrect,
        skill: question.skill,
        weight: question.weight
      })

      console.log(`Q${index + 1}: ${isCorrect ? '✅' : '❌'} User: ${userAnswer?.selectedAnswer ?? 'No answer'}, Correct: ${question.correctAnswer}`)
    })

    const finalScore = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0
    const skillScores: Record<string, number> = {}
    
    Object.entries(skillBreakdown).forEach(([skill, data]) => {
      skillScores[skill] = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0
    })

    console.log('📈 Final Results:', {
      finalScore,
      totalScore,
      maxScore,
      skillScores
    })

    const testResults = {
      id: Date.now().toString(),
      assessmentId: assessment.id,
      userEmail: userEmail,
      score: finalScore,
      totalScore,
      maxScore,
      completedAt: new Date().toISOString(),
      skillBreakdown: skillScores,
      detailedResults,
      recommendations: assessment.recommendedCourses.filter(() => finalScore < 80),
      passed: finalScore >= assessment.passingScore,
      timeSpent: (assessment.timeLimit * 60) - timeLeft
    }

    // Save to localStorage
    try {
      const savedResults = localStorage.getItem('assessmentResults')
      const existingResults = savedResults ? JSON.parse(savedResults) : []
      existingResults.push(testResults)
      localStorage.setItem('assessmentResults', JSON.stringify(existingResults))
    } catch (error) {
      console.error('Failed to save results to localStorage:', error)
    }

    setResults(testResults)
    setIsCompleted(true)
  }, [assessment, userAnswers, selectedAnswer, currentQuestionIndex, userEmail, timeLeft])

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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">กำลังโหลดแบบประเมิน...</h2>
            <p className="text-gray-600">กรุณารอสักครู่</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-red-600">เกิดข้อผิดพลาด</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              ลองใหม่อีกครั้ง
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">ไม่พบแบบประเมิน</h2>
            <p className="text-gray-600">แบบประเมินที่คุณต้องการไม่พบในระบบ</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Results screen
  if (isCompleted && results) {
    // Prepare wrong questions list
    const wrongQuestions = results.detailedResults
      .filter((r: any) => !r.isCorrect)
      .map((r: any) => {
        const question = assessment.questions[r.questionIndex - 1]
        return {
          number: r.questionIndex,
          question: r.questionText,
          userAnswerText: r.userAnswer >= 0 ? question.options[r.userAnswer] : 'ไม่ได้ตอบ',
          correctAnswerText: question.options[r.correctAnswer],
          skill: r.skill
        }
      })

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
                <div className="mt-4 grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {results.detailedResults.filter((r: any) => r.isCorrect).length}/{assessment.questions.length}
                    </div>
                    <div className="text-sm text-muted-foreground">ตอบถูก/ทั้งหมด</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{results.totalScore}/{results.maxScore}</div>
                    <div className="text-sm text-muted-foreground">คะแนนที่ได้</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  การแบ่งคะแนนตามทักษะ
                </h3>
                <div className="grid gap-4">
                  {Object.entries(results.skillBreakdown).map(([skill, score]) => {
                    const numScore = Number(score)
                    return (
                      <div key={skill} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{skill}</span>
                          <span className={getScoreColor(numScore)}>{numScore}%</span>
                        </div>
                        <Progress value={numScore} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Wrong Questions */}
              {wrongQuestions.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-600">
                    <XCircle className="w-5 h-5" />
                    ข้อที่ตอบผิด ({wrongQuestions.length} ข้อ)
                  </h3>
                  <div className="space-y-4">
                    {wrongQuestions.map((item: any, index: number) => (
                      <div key={index} className="border-2 border-red-200 rounded-lg p-4 bg-red-50">
                        <div className="flex items-start gap-3 mb-3">
                          <Badge variant="destructive">ข้อ {item.number}</Badge>
                          <Badge variant="outline">{item.skill}</Badge>
                        </div>
                        <p className="font-medium mb-3">{item.question}</p>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <span className="text-red-600 font-bold">✗</span>
                            <div>
                              <span className="text-sm text-red-600 font-medium">คำตอบของคุณ:</span>
                              <p className="text-red-700">{item.userAnswerText}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-green-600 font-bold">✓</span>
                            <div>
                              <span className="text-sm text-green-600 font-medium">คำตอบที่ถูกต้อง:</span>
                              <p className="text-green-700 font-medium">{item.correctAnswerText}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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

              <div className="text-center space-y-2">
                <div className="text-sm text-gray-600">
                  เวลาที่ใช้: {Math.floor(results.timeSpent / 60)} นาที {results.timeSpent % 60} วินาที
                </div>
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

  // Start screen
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

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">📋 คำแนะนำก่อนเริ่มทดสอบ:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• อ่านคำถามให้ละเอียดก่อนตอบ</li>
                  <li>• คุณสามารถย้อนกลับไปแก้ไขคำตอบได้</li>
                  <li>• ระบบจะบันทึกคำตอบอัตโนมัติ</li>
                  <li>• หากหมดเวลา ระบบจะส่งคำตอบให้อัตโนมัติ</li>
                </ul>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">อีเมลของคุณ *</Label>
                  <input
                    id="email"
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="กรอกอีเมลเพื่อรับผลการประเมิน"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <Button 
                  onClick={startTest} 
                  className="w-full" 
                  size="lg"
                  disabled={!userEmail.trim()}
                >
                  <Target className="w-4 h-4 mr-2" />
                  เริ่มการประเมิน
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Test screen
  const currentQuestion = assessment.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / assessment.questions.length) * 100
  const answeredCount = userAnswers.size

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-semibold">{assessment.title}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-red-600">
                <Clock className="w-4 h-4" />
                <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
              </div>
              <Badge variant="outline">
                {currentQuestionIndex + 1} / {assessment.questions.length}
              </Badge>
              <Badge variant="secondary">
                ตอบแล้ว: {answeredCount}
              </Badge>
            </div>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-lg">
                  คำถามที่ {currentQuestionIndex + 1}
                </CardTitle>
                <CardDescription className="mt-2 text-base leading-relaxed">
                  {currentQuestion.text}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary">{currentQuestion.skill}</Badge>
                <Badge variant="outline">{currentQuestion.difficulty}</Badge>
                <Badge variant="outline">น้ำหนัก: {currentQuestion.weight}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={selectedAnswer?.toString() || ""} 
              onValueChange={(value) => handleAnswerSelect(parseInt(value))}
              className="space-y-4"
            >
              {currentQuestion.options.map((option, index) => (
                <div key={`${currentQuestion.id}-${index}`} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value={index.toString()} id={`option-${currentQuestion.id}-${index}`} />
                  <Label htmlFor={`option-${currentQuestion.id}-${index}`} className="flex-1 cursor-pointer text-base">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex justify-between items-center mt-6">
              <Button 
                variant="outline" 
                onClick={previousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                ← ก่อนหน้า
              </Button>
              
              <div className="text-sm text-gray-600">
                {selectedAnswer !== null ? (
                  <span className="text-green-600">✓ เลือกคำตอบแล้ว</span>
                ) : (
                  <span className="text-orange-600">⚠ กรุณาเลือกคำตอบ</span>
                )}
              </div>
              
              <Button 
                onClick={nextQuestion}
                disabled={selectedAnswer === null}
                className={selectedAnswer !== null ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                {currentQuestionIndex === assessment.questions.length - 1 ? (
                  <>ส่งคำตอบ <CheckCircle className="w-4 h-4 ml-2" /></>
                ) : (
                  'ถัดไป →'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}