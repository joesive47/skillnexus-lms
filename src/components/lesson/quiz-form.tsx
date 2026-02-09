'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { submitQuizAttempt } from '@/app/actions/quiz'
import { CheckCircle, XCircle, Trophy } from 'lucide-react'

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
  userId: string
  isFinalExam: boolean
}

export function QuizForm({ quiz, lessonId, userId, isFinalExam }: QuizFormProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<{
    score: number
    passed: boolean
    totalQuestions: number
    certificate?: any
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
      alert('Please answer all questions before submitting.')
      return
    }

    setIsSubmitting(true)
    
    try {
      const response = await submitQuizAttempt(quiz.id, lessonId, answers)
      
      if (response.success) {
        setResult({
          score: response.score!,
          passed: response.passed!,
          totalQuestions: quiz.questions.length,
          certificate: response.certificate
        })
      } else {
        alert(response.error || 'Failed to submit quiz')
      }
    } catch (error) {
      console.error('Quiz submission error:', error)
      alert('Failed to submit quiz. Please try again.')
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
            <div>
              <p className="text-lg font-medium">
                Score: {result.score}/{result.totalQuestions} ({Math.round((result.score / result.totalQuestions) * 100)}%)
              </p>
              <p className="text-muted-foreground">
                {result.passed 
                  ? `Congratulations! You've successfully completed this ${isFinalExam ? 'final exam' : 'quiz'}.`
                  : `You need at least 80% to pass. Please review the material and try again.`
                }
              </p>
            </div>
            
            {result.certificate && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  <h3 className="font-medium text-yellow-800">Certificate Earned!</h3>
                </div>
                <p className="text-yellow-700 text-sm">
                  Congratulations! You've earned a certificate for completing {result.certificate.courseTitle}.
                </p>
                <p className="text-yellow-600 text-xs mt-1">
                  Certificate ID: {result.certificate.uniqueId}
                </p>
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