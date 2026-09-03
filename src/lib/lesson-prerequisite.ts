import prisma from './prisma'

/**
 * ตรวจสอบว่า user ผ่านเงื่อนไขของบทก่อนหน้าหรือยัง
 * - VIDEO: ต้องดู ≥ 80%
 * - SCORM: ต้อง completed = true
 * - QUIZ: ต้องสอบผ่าน
 */
export async function checkLessonPrerequisite(
  userId: string,
  lessonId: string
): Promise<{
  canAccess: boolean
  reason?: string
  previousLesson?: {
    id: string
    title: string
    type: string
    progress: number
  }
}> {
  // 1. ดึงข้อมูล lesson และ previous lesson
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: {
      id: true,
      courseId: true,
      order: true,
      lessonType: true,
      title: true
    }
  })

  if (!lesson) {
    return { canAccess: false, reason: 'Lesson not found' }
  }

  // 2. หา lesson ก่อนหน้า (order น้อยกว่า)
  const previousLesson = await prisma.lesson.findFirst({
    where: {
      courseId: lesson.courseId,
      order: {
        lt: lesson.order
      }
    },
    orderBy: {
      order: 'desc' // เอาตัวที่ใกล้ที่สุด
    },
    select: {
      id: true,
      title: true,
      lessonType: true,
      quiz: {
        select: {
          id: true,
          passScore: true
        }
      }
    }
  })

  // 3. ถ้าไม่มี previous lesson = บทแรก ให้เปิดได้เลย
  if (!previousLesson) {
    return { canAccess: true }
  }

  // 4. เช็คว่า previous lesson ผ่านหรือยัง
  const watchHistory = await prisma.watchHistory.findUnique({
    where: {
      userId_lessonId: {
        userId,
        lessonId: previousLesson.id
      }
    }
  })

  // *** VIDEO: ต้องดู ≥ 80% ***
  if (previousLesson.lessonType === 'VIDEO') {
    if (!watchHistory) {
      return {
        canAccess: false,
        reason: 'กรุณาดูบทเรียนก่อนหน้าให้ครบ 80% ก่อน',
        previousLesson: {
          id: previousLesson.id,
          title: previousLesson.title || 'Video Lesson',
          type: 'VIDEO',
          progress: 0
        }
      }
    }

    const progressPercentage = watchHistory.totalTime > 0
      ? (watchHistory.watchTime / watchHistory.totalTime) * 100
      : 0

    if (progressPercentage < 80) {
      return {
        canAccess: false,
        reason: `กรุณาดูบทเรียน "${previousLesson.title || 'Video'}" ให้ครบ 80% ก่อน (ดูไปแล้ว ${Math.round(progressPercentage)}%)`,
        previousLesson: {
          id: previousLesson.id,
          title: previousLesson.title || 'Video Lesson',
          type: 'VIDEO',
          progress: progressPercentage
        }
      }
    }
  }

  // *** SCORM: ต้อง completed = true ***
  if (previousLesson.lessonType === 'SCORM') {
    if (!watchHistory || !watchHistory.completed) {
      return {
        canAccess: false,
        reason: `กรุณาทำบทเรียน "${previousLesson.title || 'SCORM'}" ให้เสร็จก่อน`,
        previousLesson: {
          id: previousLesson.id,
          title: previousLesson.title || 'SCORM Lesson',
          type: 'SCORM',
          progress: watchHistory?.completed ? 100 : 0
        }
      }
    }
  }

  // *** QUIZ: ต้องสอบผ่าน ***
  if (previousLesson.lessonType === 'QUIZ' && previousLesson.quiz) {
    const passScore = previousLesson.quiz.passScore || 70

    // เช็คว่ามี submission ที่ผ่านหรือไม่
    const passedSubmission = await prisma.studentSubmission.findFirst({
      where: {
        userId,
        quizId: previousLesson.quiz.id,
        passed: true
      },
      orderBy: {
        score: 'desc'
      }
    })

    if (!passedSubmission) {
      return {
        canAccess: false,
        reason: `กรุณาทำแบบทดสอบ "${previousLesson.title || 'Quiz'}" ให้ผ่าน (คะแนนขั้นต่ำ: ${passScore}%)`,
        previousLesson: {
          id: previousLesson.id,
          title: previousLesson.title || 'Quiz',
          type: 'QUIZ',
          progress: 0
        }
      }
    }
  }

  // 5. ผ่านเงื่อนไขแล้ว
  return { canAccess: true }
}
