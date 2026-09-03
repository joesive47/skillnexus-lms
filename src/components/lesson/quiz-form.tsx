'use client'
import { QuizClient } from '@/components/quiz/quiz-client'
interface Props { quiz: { id: string; title: string; passScore?: number }; lessonId: string; courseId: string; userId: string; isFinalExam: boolean }
export function QuizForm({ quiz, ...props }: Props) {
  return <QuizClient {...props} quizId={quiz.id} quizTitle={quiz.title} quizPassScore={quiz.passScore ?? 70} />
}
