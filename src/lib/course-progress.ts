/**
 * Course Progress and Certification Helper Functions
 * ใช้สำหรับบันทึกความก้าวหน้าและออกใบรับรอง
 */

export interface LessonProgress {
  watchTime: number
  totalTime: number
  completed: boolean
}

export interface CourseProgress {
  totalLessons: number
  completedLessons: number
  percentage: number
  isComplete: boolean
  finalExamCompleted?: boolean
}

export interface Certificate {
  id: string
  verificationCode: string
  issueDate: string
  expiryDate?: string
  status: string
  pdfUrl?: string
}

/**
 * บันทึกความก้าวหน้าการเรียนบทเรียน
 */
export async function updateLessonProgress(
  courseId: string,
  lessonId: string,
  progress: LessonProgress
): Promise<{
  success: boolean
  watchHistory: any
  courseComplete?: boolean
  certificate?: Certificate
  message: string
}> {
  try {
    const response = await fetch(
      `/api/courses/${courseId}/lessons/${lessonId}/complete`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(progress),
      }
    )

    if (!response.ok) {
      throw new Error('Failed to update progress')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error updating lesson progress:', error)
    throw error
  }
}

/**
 * ดึงความก้าวหน้าของบทเรียน
 */
export async function getLessonProgress(
  courseId: string,
  lessonId: string
): Promise<{
  watchHistory: any | null
  progress: number
}> {
  try {
    const response = await fetch(
      `/api/courses/${courseId}/lessons/${lessonId}/complete`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch lesson progress')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching lesson progress:', error)
    throw error
  }
}

/**
 * จบคอร์สและออกใบรับรอง
 */
export async function completeCourse(
  courseId: string
): Promise<{
  success: boolean
  courseComplete: boolean
  progress: CourseProgress
  certificate?: Certificate
  message: string
}> {
  try {
    const response = await fetch(`/api/courses/${courseId}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to complete course')
    }

    return await response.json()
  } catch (error) {
    console.error('Error completing course:', error)
    throw error
  }
}

/**
 * ตรวจสอบสถานะการจบคอร์ส
 */
export async function getCourseCompletion(
  courseId: string
): Promise<{
  progress: CourseProgress
  certificate?: Certificate
  canIssueCertificate: boolean
}> {
  try {
    const response = await fetch(`/api/courses/${courseId}/complete`)

    if (!response.ok) {
      throw new Error('Failed to fetch course completion')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching course completion:', error)
    throw error
  }
}

/**
 * ดึงความก้าวหน้าทั้งหมดของคอร์ส
 */
export async function getCourseProgress(
  courseId: string
): Promise<{
  progress: CourseProgress
  lessons: Array<{
    id: string
    title: string
    type: string
    isFinalExam: boolean
    completed: boolean
    progressPercent: number
  }>
  finalExam?: {
    id: string
    title: string
    completed: boolean
    passed: boolean
  }
  certificate?: Certificate
  canIssueCertificate: boolean
}> {
  try {
    const response = await fetch(`/api/courses/${courseId}/progress`)

    if (!response.ok) {
      throw new Error('Failed to fetch course progress')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching course progress:', error)
    throw error
  }
}

/**
 * Auto-save progress (เรียกทุกๆ 30 วินาที หรือเมื่อออกจากหน้า)
 */
export function useAutoSaveProgress(
  courseId: string,
  lessonId: string,
  getCurrentProgress: () => LessonProgress
) {
  // Save every 30 seconds
  const intervalId = setInterval(async () => {
    try {
      const progress = getCurrentProgress()
      if (progress.watchTime > 0) {
        await updateLessonProgress(courseId, lessonId, progress)
      }
    } catch (error) {
      console.error('Auto-save failed:', error)
    }
  }, 30000)

  // Save on page unload
  const handleBeforeUnload = async () => {
    try {
      const progress = getCurrentProgress()
      if (progress.watchTime > 0) {
        // Use sendBeacon for reliable save on page unload
        const data = JSON.stringify(progress)
        navigator.sendBeacon(
          `/api/courses/${courseId}/lessons/${lessonId}/complete`,
          new Blob([data], { type: 'application/json' })
        )
      }
    } catch (error) {
      console.error('Save on unload failed:', error)
    }
  }

  window.addEventListener('beforeunload', handleBeforeUnload)

  // Cleanup function
  return () => {
    clearInterval(intervalId)
    window.removeEventListener('beforeunload', handleBeforeUnload)
  }
}

/**
 * Mark lesson as completed (100%)
 */
export async function markLessonComplete(
  courseId: string,
  lessonId: string,
  totalTime?: number
): Promise<any> {
  return updateLessonProgress(courseId, lessonId, {
    watchTime: totalTime || 100,
    totalTime: totalTime || 100,
    completed: true,
  })
}
