# 🔌 LMS API Implementation Guide
## Ready-to-Use API Routes สำหรับ Progress Tracking, SCORM, Quiz, และ Certification

> **เอกสารนี้มี code implementation จริงของทุก API endpoint**  
> Copy-paste ได้เลย พร้อม error handling, validation, และ security

---

## 📋 Table of Contents

1. [Progress Tracking APIs](#1-progress-tracking-apis)
2. [Video Progress API](#2-video-progress-api)
3. [SCORM APIs](#3-scorm-apis)
4. [Quiz APIs](#4-quiz-apis)
5. [Final Exam API](#5-final-exam-api)
6. [Certificate APIs](#6-certificate-apis)
7. [Student Dashboard APIs](#7-student-dashboard-apis)
8. [Unlock Engine API](#8-unlock-engine-api)

---

## 1. Progress Tracking APIs

### GET /api/courses/[courseId]/progress

**ดูความคืบหน้าของคอร์ส**

```typescript
// File: src/app/api/courses/[courseId]/progress/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { courseId } = params

    // Get all lessons with progress
    const lessons = await prisma.lesson.findMany({
      where: { courseId },
      orderBy: [
        { moduleId: 'asc' },
        { order: 'asc' }
      ],
      include: {
        module: true,
        scormPackage: true
      }
    })

    // Get user's watch history
    const watchHistories = await prisma.watchHistory.findMany({
      where: {
        userId: session.user.id,
        lessonId: { in: lessons.map(l => l.id) }
      }
    })

    // Calculate progress for each lesson
    const lessonsWithProgress = lessons.map(lesson => {
      const history = watchHistories.find(wh => wh.lessonId === lesson.id)
      const progressPercent = history?.totalTime 
        ? Math.min((history.watchTime / history.totalTime) * 100, 100)
        : 0

      return {
        id: lesson.id,
        title: lesson.title,
        type: lesson.lessonType,
        isFinalExam: lesson.isFinalExam,
        module: lesson.module?.title,
        order: lesson.order,
        completed: history?.completed || false,
        progressPercent,
      }
    })

    // Calculate overall progress
    const completedCount = lessonsWithProgress.filter(l => l.completed).length
    const totalCount = lessons.length
    const overallProgress = totalCount > 0 
      ? Math.round((completedCount / totalCount) * 100) 
      : 0

    // Check final exam status
    const finalExam = lessonsWithProgress.find(l => l.isFinalExam)
    const finalExamPassed = finalExam?.completed || false

    // Check for certificate
    const certificate = await prisma.courseCertificate.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId
        }
      }
    })

    return NextResponse.json({
      success: true,
      progress: {
        completedLessons: completedCount,
        totalLessons: totalCount,
        percentage: overallProgress,
        isComplete: overallProgress >= 100 && finalExamPassed,
        finalExamPassed
      },
      lessons: lessonsWithProgress,
      finalExam: finalExam ? {
        id: finalExam.id,
        title: finalExam.title,
        passed: finalExamPassed
      } : null,
      certificate,
      canIssueCertificate: overallProgress >= 100 && finalExamPassed && !certificate
    })

  } catch (error) {
    console.error('Error fetching progress:', error)
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    )
  }
}
```

---

## 2. Video Progress API

### POST /api/video/progress

**อัพเดทความคืบหน้าการดูวิดีโอ**

```typescript
// File: src/app/api/video/progress/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

interface VideoProgressRequest {
  lessonId: string
  currentTime: number      // วินาที
  duration: number         // วินาที
  watchedSegment?: {
    start: number
    end: number
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body: VideoProgressRequest = await request.json()
    const { lessonId, currentTime, duration, watchedSegment } = body

    // Validate input
    if (!lessonId || duration <= 0) {
      return NextResponse.json(
        { error: 'Invalid input' },
        { status: 400 }
      )
    }

    // 1. บันทึก video segment (anti-skip tracking)
    if (watchedSegment) {
      await prisma.videoSegment.create({
        data: {
          userId: session.user.id,
          lessonId,
          startTime: watchedSegment.start,
          endTime: watchedSegment.end
        }
      })
    }

    // 2. คำนวณเวลาที่ดูจริงๆ (unique segments)
    const segments = await prisma.videoSegment.findMany({
      where: {
        userId: session.user.id,
        lessonId
      },
      orderBy: { startTime: 'asc' }
    })

    const totalWatchedTime = calculateUniqueWatchTime(segments)
    const percentage = Math.min((totalWatchedTime / duration) * 100, 100)
    const completed = percentage >= 80 // 80% threshold

    // 3. Update WatchHistory
    const watchHistory = await prisma.watchHistory.upsert({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId
        }
      },
      update: {
        watchTime: totalWatchedTime,
        totalTime: duration,
        completed
      },
      create: {
        userId: session.user.id,
        lessonId,
        watchTime: totalWatchedTime,
        totalTime: duration,
        completed
      }
    })

    // 4. Update NodeProgress (if applicable)
    const node = await prisma.learningNode.findFirst({
      where: {
        refId: lessonId,
        nodeType: 'VIDEO'
      }
    })

    if (node && completed) {
      await prisma.nodeProgress.upsert({
        where: {
          userId_nodeId: {
            userId: session.user.id,
            nodeId: node.id
          }
        },
        update: {
          status: 'COMPLETED',
          progressPercent: 100,
          completedAt: new Date()
        },
        create: {
          userId: session.user.id,
          nodeId: node.id,
          courseId: node.courseId,
          status: 'COMPLETED',
          progressPercent: 100,
          completedAt: new Date()
        }
      })
    }

    return NextResponse.json({
      success: true,
      progress: {
        watchTime: totalWatchedTime,
        totalTime: duration,
        percentage: Math.round(percentage),
        completed
      }
    })

  } catch (error) {
    console.error('Video progress error:', error)
    return NextResponse.json(
      { error: 'Failed to update video progress' },
      { status: 500 }
    )
  }
}

// Helper: คำนวณเวลาที่ดูจริง (ไม่ซ้ำกัน)
function calculateUniqueWatchTime(segments: Array<{ startTime: number; endTime: number }>) {
  if (segments.length === 0) return 0

  let totalTime = 0
  let currentEnd = 0

  for (const seg of segments) {
    if (seg.startTime > currentEnd) {
      // ช่วงใหม่ที่ไม่ทับซ้อน
      totalTime += (seg.endTime - seg.startTime)
      currentEnd = seg.endTime
    } else if (seg.endTime > currentEnd) {
      // ช่วงทับซ้อนบางส่วน
      totalTime += (seg.endTime - currentEnd)
      currentEnd = seg.endTime
    }
    // else: ช่วงนี้ซ้ำกับที่ดูแล้ว (ไม่นับ)
  }

  return totalTime
}
```

---

## 3. SCORM APIs

### POST /api/scorm/init

**Initialize SCORM session และโหลดข้อมูลเดิม (resume)**

```typescript
// File: src/app/api/scorm/init/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { lessonId } = await request.json()

    // Get SCORM package
    const scormPackage = await prisma.scormPackage.findUnique({
      where: { lessonId }
    })

    if (!scormPackage) {
      return NextResponse.json(
        { error: 'SCORM package not found' },
        { status: 404 }
      )
    }

    // Get or create SCORM runtime data
    const runtimeData = await prisma.scormRuntimeData.upsert({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId
        }
      },
      update: {},
      create: {
        userId: session.user.id,
        lessonId,
        completionStatus: 'not attempted',
        successStatus: 'unknown'
      }
    })

    // Return existing CMI data (for resume)
    return NextResponse.json({
      success: true,
      registrationId: runtimeData.id,
      packageInfo: {
        version: scormPackage.version,
        title: scormPackage.title,
        identifier: scormPackage.identifier
      },
      cmiData: runtimeData.cmiData || {
        'cmi.core.lesson_status': runtimeData.completionStatus,
        'cmi.core.score.raw': runtimeData.scoreRaw?.toString() || '',
        'cmi.suspend_data': runtimeData.suspendData || '',
        'cmi.core.lesson_location': runtimeData.location || ''
      }
    })

  } catch (error) {
    console.error('SCORM init error:', error)
    return NextResponse.json(
      { error: 'Failed to initialize SCORM' },
      { status: 500 }
    )
  }
}
```

### POST /api/scorm/commit

**บันทึกข้อมูล SCORM (LMSCommit)**

```typescript
// File: src/app/api/scorm/commit/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

interface ScormCommitRequest {
  registrationId: string
  cmiData: Record<string, any>
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body: ScormCommitRequest = await request.json()
    const { registrationId, cmiData } = body

    // Get existing runtime data
    const existing = await prisma.scormRuntimeData.findUnique({
      where: { id: registrationId }
    })

    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Invalid registration' },
        { status: 403 }
      )
    }

    // Parse CMI data (SCORM 1.2 format)
    const lessonStatus = cmiData['cmi.core.lesson_status'] || existing.completionStatus
    const scoreRaw = parseFloat(cmiData['cmi.core.score.raw']) || existing.scoreRaw
    const totalTime = cmiData['cmi.core.total_time'] || existing.totalTime
    const suspendData = cmiData['cmi.suspend_data'] || existing.suspendData
    const location = cmiData['cmi.core.lesson_location'] || existing.location

    // Map SCORM 1.2 to normalized status
    const completionStatus = mapLessonStatus(lessonStatus)
    const successStatus = (lessonStatus === 'passed' || lessonStatus === 'completed')
      ? 'passed'
      : lessonStatus === 'failed'
      ? 'failed'
      : 'unknown'

    // Update SCORM runtime data
    await prisma.scormRuntimeData.update({
      where: { id: registrationId },
      data: {
        completionStatus,
        successStatus,
        scoreRaw,
        totalTime,
        suspendData,
        location,
        cmiData,
        lastCommit: new Date()
      }
    })

    // Update NodeProgress if completed
    const isCompleted = completionStatus === 'completed' && successStatus === 'passed'

    if (isCompleted) {
      const node = await prisma.learningNode.findFirst({
        where: {
          refId: existing.lessonId,
          nodeType: 'SCORM'
        }
      })

      if (node) {
        await prisma.nodeProgress.upsert({
          where: {
            userId_nodeId: {
              userId: session.user.id,
              nodeId: node.id
            }
          },
          update: {
            status: 'COMPLETED',
            progressPercent: 100,
            score: scoreRaw,
            completedAt: new Date()
          },
          create: {
            userId: session.user.id,
            nodeId: node.id,
            courseId: node.courseId,
            status: 'COMPLETED',
            progressPercent: 100,
            score: scoreRaw,
            completedAt: new Date()
          }
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'SCORM data committed',
      status: {
        completionStatus,
        successStatus,
        score: scoreRaw
      }
    })

  } catch (error) {
    console.error('SCORM commit error:', error)
    return NextResponse.json(
      { error: 'Failed to commit SCORM data' },
      { status: 500 }
    )
  }
}

// Helper: แปลง SCORM 1.2 status → normalized status
function mapLessonStatus(status: string): string {
  switch (status) {
    case 'completed':
    case 'passed':
      return 'completed'
    case 'incomplete':
    case 'browsed':
      return 'incomplete'
    case 'failed':
      return 'incomplete' // ยังไม่สำเร็จ
    case 'not attempted':
    default:
      return 'not attempted'
  }
}
```

---

## 4. Quiz APIs

### POST /api/quiz/submit

**ส่งคำตอบ Quiz และตรวจคะแนน**

```typescript
// File: src/app/api/quiz/submit/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

interface QuizSubmitRequest {
  quizId: string
  lessonId?: string
  nodeId?: string
  answers: Array<{
    questionId: string
    selectedOption: string
  }>
  timeSpent: number // วินาที
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body: QuizSubmitRequest = await request.json()
    const { quizId, lessonId, nodeId, answers, timeSpent } = body

    // 1. Get quiz with questions
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: {
            options: true
          }
        }
      }
    })

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      )
    }

    // 2. ตรวจคำตอบ
    let correctCount = 0
    const results = answers.map(answer => {
      const question = quiz.questions.find(q => q.id === answer.questionId)
      if (!question) return null

      const isCorrect = question.correctAnswer === answer.selectedOption
      if (isCorrect) correctCount++

      return {
        questionId: answer.questionId,
        isCorrect,
        selectedOption: answer.selectedOption,
        correctAnswer: question.correctAnswer
      }
    }).filter(Boolean)

    // 3. คำนวณคะแนน
    const totalQuestions = quiz.questions.length
    const score = (correctCount / totalQuestions) * 100
    const passed = score >= quiz.passScore

    // 4. Get attempt number
    const previousAttempts = await prisma.quizAttemptRecord.count({
      where: {
        userId: session.user.id,
        quizId
      }
    })
    const attemptNumber = previousAttempts + 1

    // 5. บันทึก attempt
    const attempt = await prisma.quizAttemptRecord.create({
      data: {
        userId: session.user.id,
        quizId,
        nodeId,
        attemptNumber,
        score,
        passed,
        answers: results,
        startedAt: new Date(Date.now() - timeSpent * 1000),
        submittedAt: new Date(),
        timeSpent,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })

    // 6. Update NodeProgress (ถ้าผ่าน)
    if (passed && nodeId) {
      await prisma.nodeProgress.upsert({
        where: {
          userId_nodeId: {
            userId: session.user.id,
            nodeId
          }
        },
        update: {
          status: 'COMPLETED',
          score,
          completedAt: new Date()
        },
        create: {
          userId: session.user.id,
          nodeId,
          courseId: quiz.courseId || '',
          status: 'COMPLETED',
          score,
          completedAt: new Date()
        }
      })
    }

    // 7. Mark lesson as completed (legacy WatchHistory)
    if (passed && lessonId) {
      await prisma.watchHistory.upsert({
        where: {
          userId_lessonId: {
            userId: session.user.id,
            lessonId
          }
        },
        update: {
          completed: true
        },
        create: {
          userId: session.user.id,
          lessonId,
          completed: true,
          watchTime: 0,
          totalTime: 0
        }
      })
    }

    return NextResponse.json({
      success: true,
      attemptId: attempt.id,
      score: parseFloat(score.toFixed(1)),
      passed,
      correctCount,
      totalQuestions,
      feedback: generateFeedback(score, passed, quiz.passScore),
      results,
      attemptsUsed: attemptNumber,
      canRetry: attemptNumber < 3 // Max 3 attempts
    })

  } catch (error) {
    console.error('Quiz submit error:', error)
    return NextResponse.json(
      { error: 'Failed to submit quiz' },
      { status: 500 }
    )
  }
}

function generateFeedback(score: number, passed: boolean, passScore: number): string {
  if (passed) {
    if (score >= 90) return `🎉 ยอดเยี่ยม! คุณได้ ${score.toFixed(1)}%`
    if (score >= 80) return `✅ ผ่านเกณฑ์! คุณได้ ${score.toFixed(1)}%`
    return `👍 ผ่าน! คุณได้ ${score.toFixed(1)}%`
  } else {
    return `❌ ไม่ผ่าน คุณได้ ${score.toFixed(1)}% ต้องการอย่างน้อย ${passScore}%`
  }
}
```

---

## 5. Final Exam API

### GET /api/final-exam/eligibility

**ตรวจสอบสิทธิ์สอบ Final**

```typescript
// File: src/app/api/final-exam/eligibility/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')

    if (!courseId) {
      return NextResponse.json(
        { error: 'courseId required' },
        { status: 400 }
      )
    }

    // 1. Calculate course progress
    const lessons = await prisma.lesson.findMany({
      where: { courseId, isFinalExam: false }
    })

    const completed = await prisma.watchHistory.count({
      where: {
        userId: session.user.id,
        lessonId: { in: lessons.map(l => l.id) },
        completed: true
      }
    })

    const progressPercent = lessons.length > 0
      ? (completed / lessons.length) * 100
      : 0

    // 2. Check required quizzes
    const requiredQuizNodes = await prisma.learningNode.findMany({
      where: {
        courseId,
        nodeType: 'QUIZ',
        isOptional: false
      }
    })

    const missingQuizzes = []
    for (const node of requiredQuizNodes) {
      const progress = await prisma.nodeProgress.findUnique({
        where: {
          userId_nodeId: {
            userId: session.user.id,
            nodeId: node.id
          }
        }
      })

      if (!progress || progress.status !== 'COMPLETED') {
        missingQuizzes.push(node.title)
      }
    }

    // 3. Check previous final exam attempts
    const finalExamLesson = await prisma.lesson.findFirst({
      where: { courseId, isFinalExam: true }
    })

    let attempts = 0
    let lastAttempt = null
    if (finalExamLesson?.quizId) {
      attempts = await prisma.quizAttemptRecord.count({
        where: {
          userId: session.user.id,
          quizId: finalExamLesson.quizId
        }
      })

      lastAttempt = await prisma.quizAttemptRecord.findFirst({
        where: {
          userId: session.user.id,
          quizId: finalExamLesson.quizId
        },
        orderBy: { submittedAt: 'desc' }
      })
    }

    // 4. Evaluate eligibility
    const eligible = progressPercent >= 100 && missingQuizzes.length === 0 && attempts < 3

    let blockedReason = null
    if (progressPercent < 100) {
      blockedReason = `คุณเรียนไปแล้ว ${progressPercent.toFixed(0)}% ต้องเรียนครบ 100% ก่อน`
    } else if (missingQuizzes.length > 0) {
      blockedReason = `ต้องผ่าน Quiz: ${missingQuizzes.join(', ')}`
    } else if (attempts >= 3) {
      blockedReason = 'คุณสอบครบ 3 ครั้งแล้ว'
    }

    return NextResponse.json({
      eligible,
      blockedReason,
      progress: {
        completedLessons: completed,
        totalLessons: lessons.length,
        percentage: Math.round(progressPercent)
      },
      requiredQuizzes: {
        total: requiredQuizNodes.length,
        missing: missingQuizzes
      },
      finalExam: {
        attemptsUsed: attempts,
        maxAttempts: 3,
        lastAttemptPassed: lastAttempt?.passed || false,
        lastAttemptScore: lastAttempt?.score
      }
    })

  } catch (error) {
    console.error('Eligibility check error:', error)
    return NextResponse.json(
      { error: 'Failed to check eligibility' },
      { status: 500 }
    )
  }
}
```

---

## 6. Certificate APIs

### POST /api/certificates/issue

**ออกใบ Certificate (หลังสอบ Final ผ่าน)**

```typescript
// File: src/app/api/certificates/issue/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { generateCertificatePDF } from '@/lib/certificate-generator'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { courseId } = await request.json()

    // 1. Check if already issued
    const existing = await prisma.courseCertificate.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId
        }
      }
    })

    if (existing) {
      return NextResponse.json({
        success: true,
        certificate: existing,
        message: 'Certificate already issued'
      })
    }

    // 2. Verify eligibility (must pass final exam)
    const finalExamLesson = await prisma.lesson.findFirst({
      where: { courseId, isFinalExam: true }
    })

    if (!finalExamLesson?.quizId) {
      return NextResponse.json(
        { error: 'No final exam found' },
        { status: 400 }
      )
    }

    const passedAttempt = await prisma.quizAttemptRecord.findFirst({
      where: {
        userId: session.user.id,
        quizId: finalExamLesson.quizId,
        passed: true
      }
    })

    if (!passedAttempt) {
      return NextResponse.json(
        { error: 'Final exam not passed' },
        { status: 403 }
      )
    }

    // 3. Get certificate definition
    const definition = await prisma.courseCertificateDefinition.findUnique({
      where: { courseId }
    })

    if (!definition) {
      return NextResponse.json(
        { error: 'Certificate template not found' },
        { status: 404 }
      )
    }

    // 4. Get user and course info
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    const course = await prisma.course.findUnique({
      where: { id: courseId }
    })

    if (!user || !course) {
      return NextResponse.json(
        { error: 'User or course not found' },
        { status: 404 }
      )
    }

    // 5. Create certificate record
    const verificationCode = generateVerificationCode()
    const expiryDate = definition.expiryMonths
      ? new Date(Date.now() + definition.expiryMonths * 30 * 24 * 60 * 60 * 1000)
      : null

    const certificate = await prisma.courseCertificate.create({
      data: {
        userId: session.user.id,
        courseId,
        definitionId: definition.id,
        verificationCode,
        issueDate: new Date(),
        expiryDate,
        status: 'ACTIVE'
      }
    })

    // 6. Generate PDF (background job or sync)
    const pdfUrl = await generateCertificatePDF({
      template: definition.templateHtml,
      data: {
        recipientName: user.name || user.email,
        courseName: course.title,
        issueDate: new Date().toLocaleDateString('th-TH', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        verificationCode,
        issuerName: definition.issuerName,
        issuerTitle: definition.issuerTitle,
        qrCodeUrl: `${process.env.NEXT_PUBLIC_APP_URL}/verify/${verificationCode}`
      }
    })

    // 7. Update certificate with PDF URL
    await prisma.courseCertificate.update({
      where: { id: certificate.id },
      data: { pdfUrl }
    })

    // 8. Log event
    await prisma.certificationEvent.create({
      data: {
        eventType: 'CERTIFICATE_ISSUED',
        userId: session.user.id,
        entityType: 'COURSE_CERTIFICATE',
        entityId: certificate.id,
        metadata: JSON.stringify({
          courseName: course.title,
          verificationCode
        })
      }
    })

    return NextResponse.json({
      success: true,
      certificate: {
        ...certificate,
        pdfUrl
      },
      message: 'Certificate issued successfully'
    })

  } catch (error) {
    console.error('Certificate issue error:', error)
    return NextResponse.json(
      { error: 'Failed to issue certificate' },
      { status: 500 }
    )
  }
}

function generateVerificationCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 12; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}
```

### GET /api/certificates/[certificateId]/download

**ดาวน์โหลด Certificate PDF**

```typescript
// File: src/app/api/certificates/[certificateId]/download/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { certificateId: string } }
) {
  try {
    const { certificateId } = params

    const certificate = await prisma.courseCertificate.findUnique({
      where: { id: certificateId },
      include: {
        user: true,
        course: true
      }
    })

    if (!certificate) {
      return new NextResponse('Certificate not found', { status: 404 })
    }

    if (!certificate.pdfUrl) {
      return new NextResponse('PDF not generated yet', { status: 404 })
    }

    // Fetch PDF from storage
    const pdfResponse = await fetch(certificate.pdfUrl)
    if (!pdfResponse.ok) {
      return new NextResponse('PDF file not found', { status: 404 })
    }

    const pdfBuffer = await pdfResponse.arrayBuffer()

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Certificate_${certificate.course.title.replace(/\s+/g, '_')}.pdf"`
      }
    })

  } catch (error) {
    console.error('Certificate download error:', error)
    return new NextResponse('Failed to download certificate', { status: 500 })
  }
}
```

---

## 7. Student Dashboard APIs

### GET /api/student/certifications

**ดึงรายการ Certificate ทั้งหมดของผู้เรียน**

```typescript
// File: src/app/api/student/certifications/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get course certificates
    const courseCertificates = await prisma.courseCertificate.findMany({
      where: {
        userId: session.user.id,
        status: 'ACTIVE'
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            imageUrl: true
          }
        }
      },
      orderBy: {
        issueDate: 'desc'
      }
    })

    // Get career certificates
    const careerCertificates = await prisma.careerCertificate.findMany({
      where: {
        userId: session.user.id,
        status: 'ACTIVE'
      },
      include: {
        careerPath: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        issueDate: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      courseCertificates: courseCertificates.map(cert => ({
        id: cert.id,
        courseName: cert.course.title,
        courseImage: cert.course.imageUrl,
        issueDate: cert.issueDate.toISOString(),
        expiryDate: cert.expiryDate?.toISOString(),
        verificationCode: cert.verificationCode,
        pdfUrl: `/api/certificates/${cert.id}/download`,
        verifyUrl: `/verify/${cert.verificationCode}`
      })),
      careerCertificates: careerCertificates.map(cert => ({
        id: cert.id,
        careerName: cert.careerPath.name,
        issueDate: cert.issueDate.toISOString(),
        expiryDate: cert.expiryDate?.toISOString(),
        verificationCode: cert.verificationCode,
        pdfUrl: `/api/career-certificates/${cert.id}/download`,
        verifyUrl: `/verify/${cert.verificationCode}`
      })),
      totalCertificates: courseCertificates.length + careerCertificates.length
    })

  } catch (error) {
    console.error('Error fetching certifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch certifications' },
      { status: 500 }
    )
  }
}
```

---

## 8. Unlock Engine API

### GET /api/courses/[courseId]/unlock-status

**ตรวจสอบสถานะการปลดล็อกของบทเรียนแต่ละบท**

```typescript
// File: src/app/api/courses/[courseId]/unlock-status/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { LearningFlowRuleEngine } from '@/lib/learning-flow-engine'

export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { courseId } = params
    const engine = new LearningFlowRuleEngine()

    // Get unlock status for all nodes
    const unlockState = await engine.getCourseUnlockState(
      session.user.id,
      courseId
    )

    return NextResponse.json({
      success: true,
      nodes: unlockState.nodes.map(node => ({
        nodeId: node.nodeId,
        title: node.title,
        nodeType: node.nodeType,
        status: node.status,
        unlockStatus: node.unlockStatus,
        reason: node.reason,
        progress: node.progress,
        isFinalExam: node.isFinalExam
      }))
    })

  } catch (error) {
    console.error('Unlock status error:', error)
    return NextResponse.json(
      { error: 'Failed to get unlock status' },
      { status: 500 }
    )
  }
}
```

---

## 🎯 Summary

เอกสารนี้มี **implementation code จริง** ของ APIs ทั้งหมดที่จำเป็นสำหรับระบบ LMS:

✅ **Progress Tracking** - อัพเดทและดูความคืบหน้า  
✅ **Video Progress** - Anti-skip tracking  
✅ **SCORM** - Init + Commit  
✅ **Quiz** - Submit + Scoring  
✅ **Final Exam** - Eligibility check  
✅ **Certificate** - Issue + Download  
✅ **Dashboard** - My Certifications  
✅ **Unlock Engine** - Check prerequisites  

**พร้อมใช้งาน** - Copy code ไปเลย แล้ว deploy ได้ทันที! 🚀
