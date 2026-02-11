'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { submitQuizAttempt } from '@/app/actions/quiz'
import { markLessonComplete } from '@/lib/course-progress'
import { CheckCircle, XCircle, Trophy } from 'lucide-react'
import { DownloadCertificateButton } from '@/components/DownloadCertificateButton'
import { toast } from 'sonner'
import { addNotification } from '@/components/notifications/notification-center'

interface QuizFormProps {
  quiz: {
    id: string
    title: string
    questions: {
      id: string
      text: string
      options: {
        id: string
        text: string
        isCorrect: boolean
      }[]
    }[]
  }
  lessonId: string
  courseId: string
  userId: string
  isFinalExam: boolean
}

export function QuizForm({ quiz, lessonId, courseId, userId, isFinalExam }: QuizFormProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<{
    score: number
    correctAnswers: number
    totalQuestions: number
    percentage: number
    passed: boolean
    questionResults?: any[]
    certificate?: any
    analysis?: {
      scoreDisplay: string
      percentageDisplay: string
      status: string
      minimumRequired: string
    }
  } | null>(null)

  const handleAnswerChange = (questionId: string, optionId: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (Object.keys(answers).length !== quiz.questions.length) {
      toast.error('กรุณาตอบคำถามให้ครบ', {
        description: 'โปรดตอบคำถามทุกข้อก่อนส่งคำตอบ',
      })
      return
    }

    setIsSubmitting(true)
    
    try {
      const response = await submitQuizAttempt(quiz.id, lessonId, answers)
      
      if (response.success && response.passed) {
        // Mark lesson as complete when quiz is passed
        const progressResult = await markLessonComplete(courseId, lessonId)
        
        // Merge certificate info
        const finalResult = {
          score: response.score!,
          correctAnswers: response.correctAnswers!,
          totalQuestions: response.totalQuestions!,
          percentage: response.percentage!,
          passed: response.passed!,
          questionResults: response.questionResults,
          certificate: progressResult.certificate || response.certificate,
          analysis: response.analysis
        }
        
        setResult(finalResult)

        // Show success notification
        toast.success('ยินดีด้วย!', {
          description: isFinalExam 
            ? 'คุณสอบไฟนอลผ่านแล้ว!' 
            : 'คุณทำแบบทดสอบผ่านเกณฑ์!',
        })

        // Add to notification center
        addNotification({
          type: 'progress',
          title: isFinalExam ? 'ผ่านสอบไฟนอล!' : 'ผ่านแบบทดสอบ!',
          message: `คุณทำแบบทดสอบได้ ${response.percentage}%`,
        })

        // Show certificate notification if issued
        if (progressResult.courseComplete && progressResult.certificate) {
          setTimeout(() => {
            toast.success('ได้รับใบรับรอง!', {
              description: 'คุณจบคอร์สและได้รับใบรับรองแล้ว',
              action: {
                label: 'ดูใบรับรอง',
                onClick: () => {
                  window.location.href = `/certificates/${progressResult.certificate.id}`
                }
              },
              duration: 10000,
            })

            // Add certificate notification
            addNotification({
              type: 'certificate',
              title: 'ยินดีด้วย! คุณได้รับใบรับรอง',
              message: 'คุณจบคอร์สและได้รับใบรับรองแล้ว',
              link: `/certificates/${progressResult.certificate.id}`,
              linkText: 'ดูใบรับรอง'
            })
          }, 1000)
        }
      } else if (response.success) {
        setResult({
          score: response.score!,
          correctAnswers: response.correctAnswers!,
          totalQuestions: response.totalQuestions!,
          percentage: response.percentage!,
          passed: response.passed!,
          questionResults: response.questionResults,
          analysis: response.analysis
        })

        toast.error('ไม่ผ่านเกณฑ์', {
          description: 'กรุณาทบทวนเนื้อหาแล้วลองใหม่อีกครั้ง',
        })
      } else {
        toast.error('เกิดข้อผิดพลาด', {
          description: response.error || 'ไม่สามารถส่งคำตอบได้',
        })
      }
    } catch (error) {
      console.error('Quiz submission error:', error)
      toast.error('เกิดข้อผิดพลาด', {
        description: 'ไม่สามารถส่งคำตอบได้ กรุณาลองใหม่อีกครั้ง',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (result) {
    return (
      <Card className={`${result.passed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {result.passed ? (
              <>
                <CheckCircle className="w-6 h-6 text-green-600" />
                {isFinalExam ? 'Final Exam Passed!' : 'Quiz Passed!'}
              </>
            ) : (
              <>
                <XCircle className="w-6 h-6 text-red-600" />
                {isFinalExam ? 'Final Exam Failed' : 'Quiz Failed'}
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Score Summary */}
            <div className="p-4 bg-white rounded-lg border-2 border-gray-200">
              <div className="text-center mb-4">
                <div className={`text-4xl font-bold mb-2 ${
                  result.passed ? 'text-green-600' : 'text-red-600'
                }`}>
                  {result.percentage}%
                </div>
                <div className="text-lg text-gray-700">
                  {result.correctAnswers} / {result.totalQuestions} ข้อ
                </div>
                <Badge className={`mt-2 ${result.passed ? 'bg-green-500' : 'bg-red-500'}`}>
                  {result.passed ? 'ผ่าน' : 'ไม่ผ่าน'} (ต้องการ 80% ขึ้นไป)
                </Badge>
              </div>

              {/* Score Analysis */}
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-sm text-gray-600">ตอบถูก</div>
                  <div className="text-2xl font-bold text-green-600">{result.correctAnswers}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">ตอบผิด</div>
                  <div className="text-2xl font-bold text-red-600">
                    {result.totalQuestions - result.correctAnswers}
                  </div>
                </div>
              </div>

              <p className="text-center text-muted-foreground mt-4">
                {result.passed 
                  ? `🎉 ยินดีด้วย! คุณทำ${isFinalExam ? 'ข้อสอบปลายภาค' : 'แบบทดสอบ'}ผ่าน`
                  : `💪 คุณต้องได้อย่างน้อย 80% เพื่อผ่าน กรุณาทบทวนเนื้อหาแล้วลองใหม่อีกครั้ง`
                }
              </p>
            </div>

            {/* Detailed Results */}
            {result.questionResults && result.questionResults.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <span>📝</span> รายละเอียดการตอบคำถาม
                </h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {result.questionResults.map((q: any, idx: number) => (
                    <div 
                      key={idx}
                      className={`p-3 rounded-lg border ${
                        q.isCorrect 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="flex-shrink-0">
                          {q.isCorrect ? '✅' : '❌'}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm mb-1">
                            ข้อ {q.questionNumber}: {q.questionText}
                          </div>
                          <div className="text-xs space-y-1">
                            <div className={q.isCorrect ? 'text-green-700' : 'text-red-700'}>
                              คำตอบของคุณ: {q.userAnswer}
                            </div>
                            {!q.isCorrect && (
                              <div className="text-green-700">
                                คำตอบที่ถูก: {q.correctAnswer}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {result.certificate && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  <h3 className="font-medium text-yellow-800">🎉 ได้รับใบประกาศนียบัตร!</h3>
                </div>
                <p className="text-yellow-700 text-sm">
                  ยินดีด้วย! คุณได้รับใบประกาศนียบัตรจากการทำข้อสอบผ่านเกณฑ์สำหรับคอร์ส {result.certificate.courseTitle}
                </p>
                <p className="text-yellow-600 text-xs mt-1">
                  Certificate ID: {result.certificate.uniqueId}
                </p>
                {result.certificate.certificateNumber && (
                  <div className="mt-4">
                    <DownloadCertificateButton certificateNumber={result.certificate.certificateNumber} />
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {quiz.title}
            {isFinalExam && (
              <Badge variant="destructive">Final Exam</Badge>
            )}
          </CardTitle>
          <Badge variant="outline">
            {quiz.questions.length} Questions
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {quiz.questions.map((question, index) => (
            <div key={question.id} className="space-y-3">
              <h3 className="font-medium">
                {question.text}
              </h3>
              <RadioGroup
                value={answers[question.id] || ''}
                onValueChange={(value) => handleAnswerChange(question.id, value)}
              >
                {question.options.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.id} id={option.id} />
                    <Label htmlFor={option.id} className="cursor-pointer">
                      {option.text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
          
          <form onSubmit={handleSubmit} className="pt-4 border-t">
            {/* Hidden inputs for form data */}
            <input type="hidden" name="quizId" value={quiz.id} />
            <input type="hidden" name="lessonId" value={lessonId} />
            <input type="hidden" name="answers" value={JSON.stringify(answers)} />
            
            <Button 
              type="submit"
              disabled={isSubmitting || Object.keys(answers).length !== quiz.questions.length}
              className="w-full"
            >
              {isSubmitting ? 'Submitting...' : `Submit ${isFinalExam ? 'Final Exam' : 'Quiz'}`}
            </Button>
            <p className="text-sm text-muted-foreground mt-2 text-center">
              {Object.keys(answers).length}/{quiz.questions.length} questions answered
            </p>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}