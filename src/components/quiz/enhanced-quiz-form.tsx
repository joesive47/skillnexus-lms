'use client'
import { QuizClient } from './quiz-client'
interface Props { quiz: { id: string; title: string; passScore?: number; courseId?: string | null }; lessonId: string }
export function EnhancedQuizForm({ quiz, lessonId }: Props) {
  return <QuizClient quizId={quiz.id} quizTitle={quiz.title} quizPassScore={quiz.passScore ?? 70} lessonId={lessonId} courseId={quiz.courseId || ''} userId="" />
}
