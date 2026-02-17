'use client'

import { useState, useEffect } from 'react'
import { QuizLockStatus } from './quiz-lock-status'
import { QuizRetryStatus } from './quiz-retry-status'
import { QuizComponent } from './QuizComponent'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface QuizWithPrerequisiteCheckProps {
  quizId: string
  lessonId: string
  courseId: string
  userId: string
}

interface QuizData {
  id: string
  title: string
  passScore: number
  questions: {
    id: string
    text: string
    order: number
    options: {
      id: string
      text: string
    }[]
  }[]
}

export function QuizWithPrerequisiteCheck({
  quizId,
  lessonId,
  courseId,
  userId
}: QuizWithPrerequisiteCheckProps) {
  const [quizData, setQuizData] = useState<QuizData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [canAccess, setCanAccess] = useState<boolean | null>(null)
  const [canRetry, setCanRetry] = useState<boolean | null>(null)

  // Fetch quiz data from API
  useEffect(() => {
    async function fetchQuiz() {
      try {
        console.log('[QUIZ_CLIENT] Fetching quiz:', quizId)
        const response = await fetch(`/api/quiz/${quizId}`)
        console.log('[QUIZ_CLIENT] Response status:', response.status)
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('[QUIZ_CLIENT] Error response:', errorText)
          throw new Error(`Failed to load quiz (${response.status}): ${errorText}`)
        }
        
        const data = await response.json()
        console.log('[QUIZ_CLIENT] Quiz data loaded:', data.title)
        setQuizData(data)
      } catch (err) {
        console.error('[QUIZ_CLIENT] Fetch error:', err)
        setError(err instanceof Error ? err.message : 'Failed to load quiz')
      } finally {
        setIsLoading(false)
      }
    }
    fetchQuiz()
  }, [quizId])

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">กำลังโหลดแบบทดสอบ...</span>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Error state
  if (error || !quizData) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>เกิดข้อผิดพลาด</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-red-500">{error || 'ไม่พบแบบทดสอบ'}</p>
            <Link href={`/courses/${courseId}/lessons/${lessonId}`}>
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                ย้อนกลับ
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Step 1: Check prerequisite
  if (canAccess === null) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>{quizData.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <QuizLockStatus
              quizId={quizId}
              quizTitle={quizData.title}
              quizPassScore={quizData.passScore}
              onStatusChecked={setCanAccess}
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  // Step 2: Prerequisite not met
  if (!canAccess) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>{quizData.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <QuizLockStatus
              quizId={quizId}
              quizTitle={quizData.title}
              quizPassScore={quizData.passScore}
              onStatusChecked={setCanAccess}
            />
            
            <div className="flex gap-2">
              <Link href={`/courses/${courseId}/lessons/${lessonId}`}>
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  ย้อนกลับ
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Step 3: Check retry cooldown
  if (canRetry === null) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>{quizData.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <QuizRetryStatus
              quizId={quizId}
              quizTitle={quizData.title}
              onStatusChecked={setCanRetry}
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  // Step 4: In cooldown period
  if (!canRetry) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>{quizData.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <QuizRetryStatus
              quizId={quizId}
              quizTitle={quizData.title}
              onStatusChecked={setCanRetry}
              onRetryReady={() => setCanRetry(true)}
            />
            
            <div className="flex gap-2">
              <Link href={`/courses/${courseId}/lessons/${lessonId}`}>
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  ย้อนกลับ
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Step 5: All checks passed - show quiz
  return (
    <QuizComponent
      quiz={quizData}
      lessonId={lessonId}
      courseId={courseId}
      userId={userId}
    />
  )
}
