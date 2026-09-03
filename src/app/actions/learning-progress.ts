'use server'
import { revalidatePath } from 'next/cache'
import { requireUser, requireLessonAccess, publicError } from '@/lib/access-control'
import { recordVideoProgress } from '@/lib/learning-evidence'
import { saveScormProgress } from '@/lib/scorm-progress-secure'
import { submitQuizSession } from '@/lib/quiz-session'

export interface VideoProgressUpdate {
  lessonId: string; courseId: string; watchTime: number; totalTime: number
  segments?: { start: number; end: number }[]; deviceId?: string; idempotencyKey?: string
}
export async function updateVideoProgress(data: VideoProgressUpdate) {
  try {
    const user = await requireUser()
    await requireLessonAccess(user.id, data.lessonId, data.courseId)
    const result = await recordVideoProgress(user.id, data.lessonId, data.watchTime)
    revalidatePath('/courses/' + data.courseId)
    return { success: true, progress: result.progressPercentage, completed: result.completed, status: result.completed ? 'COMPLETED' : 'IN_PROGRESS' }
  } catch (error) { return { success: false, error: publicError(error) } }
}
export interface ScormProgressUpdate {
  lessonId: string; courseId: string; cmiData: Record<string, unknown>; deviceId?: string; idempotencyKey?: string
}
export async function updateScormProgress(data: ScormProgressUpdate) {
  try {
    const user = await requireUser()
    const result = await saveScormProgress(user.id, data.lessonId, data.cmiData, data.courseId)
    revalidatePath('/courses/' + data.courseId)
    return { success: true, completed: result.completed, status: result.status }
  } catch (error) { return { success: false, error: publicError(error) } }
}
export interface QuizSubmission {
  quizId: string; lessonId?: string; courseId: string; answers: Record<string, string>
  timeSpent: number; idempotencyKey?: string; attemptId?: string
}
export async function submitQuiz(data: QuizSubmission) {
  try {
    const result = await submitQuizSession(data.quizId, data.lessonId || '', data.answers, data.attemptId)
    revalidatePath('/courses/' + data.courseId)
    return { ...result, correctCount: result.correctAnswers }
  } catch (error) { return { success: false as const, error: publicError(error) } }
}
