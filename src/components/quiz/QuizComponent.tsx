'use client'

import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { useRouter } from 'next/navigation'
import { CertificateSuccessDialog } from './certificate-success-dialog'

interface QuizComponentProps {
  quiz: {
    attemptId: string
    expiresAt?: string
    passScore?: number
    id: string
    title: string
    questions: {
      id: string
      text: string
      order: number
      options: {
        id: string
        text: string
        // isCorrect removed - data sanitized on server before sending to client
      }[]
    }[]
  }
  lessonId: string
  courseId: string
  userId: string
  isFinalExam?: boolean
}

export function QuizComponent({ quiz, lessonId, courseId, userId, isFinalExam = false }: QuizComponentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [showCertificateDialog, setShowCertificateDialog] = useState(false)
  const [quizResults, setQuizResults] = useState<{
    correctAnswers: number
    totalQuestions: number
    percentage: number
    passed: boolean
    questionResults: Array<{
      questionId: string
      questionText: string
      userAnswerText: string | null
      correctAnswerText: string
      isCorrect: boolean
    }>
  } | null>(null)
  const router = useRouter()
  const submissionRef = useRef<Promise<void> | null>(null)
  const submittedRef = useRef(false)
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null)
  useEffect(() => {
    if (!quiz.expiresAt || showResults) return
    const update = () => setSecondsLeft(Math.max(0, Math.ceil((new Date(quiz.expiresAt!).getTime() - Date.now()) / 1000)))
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [quiz.expiresAt, showResults])

  const handleAnswerChange = (questionId: string, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }))
  }

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const submitOnce = async () => {
      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId: quiz.id,
          attemptId: quiz.attemptId,
          lessonId,
          answers
        })
      })

      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        const error = new Error(
          payload && typeof payload === 'object' && 'error' in payload && typeof payload.error === 'string'
            ? payload.error
            : 'Failed to submit quiz'
        ) as Error & { status?: number }
        error.status = response.status
        throw error
      }
      return payload
  }

  const handleSubmit = async () => {
    // A quiz session is idempotent on the server. Retain one in-flight request
    // in the browser too, so one click always owns the submission.
    if (submittedRef.current || submissionRef.current) return
    setIsSubmitting(true)

    const submission = (async () => {
      try {
        let result: any
        try {
          result = await submitOnce()
        } catch (error) {
          const status = error instanceof Error && 'status' in error ? Number(error.status) : null
          if (status !== null && status < 500) throw error
          // A completed database transaction can outlive a transient response
          // failure. Retry once with the same attempt ID and immediately read
          // its idempotent result instead of asking the learner to click again.
          await new Promise(resolve => window.setTimeout(resolve, 350))
          result = await submitOnce()
        }
        if (!result || typeof result !== 'object') throw new Error('Quiz result was not returned')
        setScore(result.score)
        setQuizResults(result)
        setShowResults(true)

        submittedRef.current = true
        // Do not refresh the route here: a route refresh can remount this
        // component and discard the just-rendered result. The sidebar listens
        // for this local event and unlocks the next lesson in place instead.
        window.dispatchEvent(new CustomEvent('skillnexus:lesson-completed', {
          detail: { courseId, lessonId }
        }))

        // Certificate issuance is retried independently by the dialog. Score
        // feedback must never wait for that secondary operation.
        if (isFinalExam && result.passed) {
          setTimeout(() => {
            setShowCertificateDialog(true)
          }, 1000) // รอ 1 วินาทีให้เห็นผลคะแนนก่อน
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to submit quiz')
      } finally {
        setIsSubmitting(false)
      }
    })()
    submissionRef.current = submission
    await submission
    submissionRef.current = null
  }

  const currentQ = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100

  if (!showResults && secondsLeft === 0) {
    return <Card><CardContent className="space-y-4 p-6">
      <p>หมดเวลาสำหรับข้อสอบชุดนี้ กรุณาเริ่มทำใหม่</p>
      <Button onClick={() => window.location.reload()}>เริ่มใหม่</Button>
    </CardContent></Card>
  }

  if (showResults && quizResults) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Quiz Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Large Percentage Display */}
            <div className="text-center space-y-2">
              <div className={`text-6xl font-bold ${
                quizResults.percentage >= 80 ? 'text-green-600' :
                quizResults.percentage >= 70 ? 'text-blue-600' :
                quizResults.percentage >= 60 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {quizResults.percentage}%
              </div>
              <div className="text-xl text-gray-600">
                {quizResults.correctAnswers} / {quizResults.totalQuestions} correct
              </div>
              <div className={`text-lg font-medium ${
                quizResults.passed ? 'text-green-600' : 'text-red-600'
              }`}>
                {quizResults.passed ? '✓ Passed' : `✗ Not Passed (${quiz.passScore ?? 70}% required)`}
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {quizResults.correctAnswers}
                </div>
                <div className="text-sm text-green-700">Correct</div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-600">
                  {quizResults.totalQuestions - quizResults.correctAnswers}
                </div>
                <div className="text-sm text-red-700">Incorrect</div>
              </div>
            </div>

            {/* Detailed Question Review */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Detailed Review:</h3>
              <div className="max-h-96 overflow-y-auto space-y-2 border rounded-lg p-4">
                {quizResults.questionResults.map((result, index) => (
                  <div
                    key={result.questionId}
                    className={`p-3 rounded-lg ${
                      result.isCorrect
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className={`font-bold ${
                        result.isCorrect ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {result.isCorrect ? '✓' : '✗'}
                      </span>
                      <div className="flex-1">
                        <div className="font-medium text-sm mb-1">
                          Q{index + 1}: {result.questionText}
                        </div>
                        {!result.isCorrect && (
                          <div className="text-xs space-y-1">
                            <div className="text-red-700">
                              Your answer: {result.userAnswerText || 'No answer'}
                            </div>
                            <div className="text-green-700">
                              Correct answer: {result.correctAnswerText}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 justify-center pt-4 border-t">
              <Button onClick={() => router.push(`/courses/${courseId}/lessons/${lessonId}`)}>
                Back to Lesson
              </Button>
              <Button variant="outline" onClick={() => router.push(`/courses/${courseId}`)}>
                Back to Course
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-4">
        <Button variant="outline" onClick={() => router.push(`/courses/${courseId}/lessons/${lessonId}`)}>
          ← Back to Lesson
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{quiz.title}</CardTitle>
          {secondsLeft !== null && <p className="text-sm text-muted-foreground" role="status">เวลาที่เหลือ {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')}</p>}
          <div className="space-y-2">
            <div className="flex justify-end text-sm text-muted-foreground">
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">{currentQ.text}</h3>
            <div className="space-y-3">
              {currentQ.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={option.id}
                    name={`question-${currentQ.id}`}
                    value={option.id}
                    checked={answers[currentQ.id] === option.id}
                    onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                  />
                  <Label htmlFor={option.id} className="cursor-pointer text-sm font-medium text-gray-900">
                    {option.text}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            
            {currentQuestion === quiz.questions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={!answers[currentQ.id] || isSubmitting}
              >
                {isSubmitting ? 'กำลังตรวจคำตอบ…' : 'ส่งคำตอบและตรวจคะแนน'}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!answers[currentQ.id]}
              >
                Next
              </Button>
            )}
          </div>
          {isSubmitting && (
            <p className="text-center text-sm text-muted-foreground" role="status">
              กำลังบันทึกและตรวจคำตอบ กรุณารอสักครู่ ไม่ต้องกดซ้ำ
            </p>
          )}
        </CardContent>
      </Card>

      {/* Certificate Success Dialog */}
      <CertificateSuccessDialog
        open={showCertificateDialog}
        onClose={() => setShowCertificateDialog(false)}
        courseName={quiz.title}
        score={score}
        courseId={courseId}
      />
    </div>
  )
}
