'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { useRouter } from 'next/navigation'

interface QuizComponentProps {
  quiz: {
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
}

export function QuizComponent({ quiz, lessonId, courseId, userId }: QuizComponentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
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

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId: quiz.id,
          lessonId,
          answers
        })
      })

      if (response.ok) {
        const result = await response.json()
        setScore(result.score)
        setQuizResults(result)
        setShowResults(true)
      }
    } catch (error) {
      console.error('Error submitting quiz:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentQ = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100

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
                {quizResults.passed ? '✓ Passed' : '✗ Not Passed (70% required)'}
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
                {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
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
        </CardContent>
      </Card>
    </div>
  )
}