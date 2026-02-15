'use client'

import { useState } from 'react'
import { QuizLockStatus } from './quiz-lock-status'
import { QuizRetryStatus } from './quiz-retry-status'
import { QuizComponent } from './QuizComponent'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface QuizWithPrerequisiteCheckProps {
  quiz: {
    id: string
    title: string
    passScore: number
    questions: any[]
  }
  lessonId: string
  courseId: string
  userId: string
}

export function QuizWithPrerequisiteCheck({
  quiz,
  lessonId,
  courseId,
  userId
}: QuizWithPrerequisiteCheckProps) {
  const [canAccess, setCanAccess] = useState<boolean | null>(null)
  const [canRetry, setCanRetry] = useState<boolean | null>(null)

  // Step 1: รอให้เช็ค prerequisite เสร็จก่อน
  if (canAccess === null) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>{quiz.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <QuizLockStatus
              quizId={quiz.id}
              quizTitle={quiz.title}
              quizPassScore={quiz.passScore}
              onStatusChecked={setCanAccess}
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  // Step 2: ถ้าไม่ผ่าน prerequisite แสดงหน้า lock
  if (!canAccess) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>{quiz.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <QuizLockStatus
              quizId={quiz.id}
              quizTitle={quiz.title}
              quizPassScore={quiz.passScore}
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

  // Step 3: ผ่าน prerequisite แล้ว ให้เช็ค retry cooldown
  if (canRetry === null) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>{quiz.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <QuizRetryStatus
              quizId={quiz.id}
              quizTitle={quiz.title}
              onStatusChecked={setCanRetry}
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  // Step 4: ถ้ายังอยู่ใน cooldown period
  if (!canRetry) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>{quiz.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <QuizRetryStatus
              quizId={quiz.id}
              quizTitle={quiz.title}
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

  // Step 5: ผ่านทุกเงื่อนไขแล้ว ให้แสดง Quiz
  return (
    <QuizComponent
      quiz={{
        id: quiz.id,
        title: quiz.title,
        questions: quiz.questions
      }}
      lessonId={lessonId}
      courseId={courseId}
      userId={userId}
    />
  )
}
