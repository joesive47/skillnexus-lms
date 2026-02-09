'use client'

import { useState, useEffect } from "react"
import { submitQuizAttempt } from "@/app/actions/quiz"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"

interface Question {
  id: string
  text: string
  type: string
  correctAnswer?: string
  options: { id: string; text: string; isCorrect: boolean }[]
}

interface Quiz {
  id: string
  title: string
  timeLimit?: number
  randomize: boolean
  questions: Question[]
}

interface EnhancedQuizFormProps {
  quiz: Quiz
  lessonId: string
}

export function EnhancedQuizForm({ quiz, lessonId }: EnhancedQuizFormProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit ? quiz.timeLimit * 60 : 0)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const questions = quiz.randomize 
    ? [...quiz.questions].sort(() => Math.random() - 0.5)
    : quiz.questions

  useEffect(() => {
    if (quiz.timeLimit && timeLeft > 0 && !submitted) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [timeLeft, submitted, quiz.timeLimit])

  const handleSubmit = async () => {
    if (submitting) return
    setSubmitting(true)
    setSubmitted(true)

    const result = await submitQuizAttempt(quiz.id, lessonId, answers)
    
    if (result.success) {
      toast.success(`คะแนน: ${result.score}/${result.totalQuestions} (${result.percentage}%)`)
      if (result.passed) {
        toast.success("ผ่านแบบทดสอบแล้ว!")
      }
    } else {
      toast.error("เกิดข้อผิดพลาด")
    }
    setSubmitting(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const renderQuestion = (question: Question, index: number) => {
    switch (question.type) {
      case 'TRUE_FALSE':
        return (
          <RadioGroup
            value={answers[question.id] || ""}
            onValueChange={(value) => setAnswers(prev => ({ ...prev, [question.id]: value }))}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id={`${question.id}-true`} />
              <Label htmlFor={`${question.id}-true`}>จริง</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id={`${question.id}-false`} />
              <Label htmlFor={`${question.id}-false`}>เท็จ</Label>
            </div>
          </RadioGroup>
        )

      case 'FILL_BLANK':
        return (
          <Input
            placeholder="กรอกคำตอบ"
            value={answers[question.id] || ""}
            onChange={(e) => setAnswers(prev => ({ ...prev, [question.id]: e.target.value }))}
            disabled={submitted}
          />
        )

      default: // MULTIPLE_CHOICE
        return (
          <RadioGroup
            value={answers[question.id] || ""}
            onValueChange={(value) => setAnswers(prev => ({ ...prev, [question.id]: value }))}
          >
            {question.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={option.id} disabled={submitted} />
                <Label htmlFor={option.id}>{option.text}</Label>
              </div>
            ))}
          </RadioGroup>
        )
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            {quiz.title}
            {quiz.timeLimit && (
              <div className="text-right">
                <div className="text-sm text-muted-foreground">เวลาที่เหลือ</div>
                <div className={`text-lg font-mono ${timeLeft < 300 ? 'text-red-500' : ''}`}>
                  {formatTime(timeLeft)}
                </div>
              </div>
            )}
          </CardTitle>
          {quiz.timeLimit && (
            <Progress 
              value={(timeLeft / (quiz.timeLimit * 60)) * 100} 
              className="h-2"
            />
          )}
        </CardHeader>
      </Card>

      {questions.map((question, index) => (
        <Card key={question.id}>
          <CardHeader>
            <CardTitle className="text-lg">
              {question.text}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderQuestion(question, index)}
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-center">
        <Button 
          onClick={handleSubmit} 
          disabled={submitted || submitting}
          size="lg"
        >
          {submitting ? "กำลังส่ง..." : "ส่งคำตอบ"}
        </Button>
      </div>
    </div>
  )
}