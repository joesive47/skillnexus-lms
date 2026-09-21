import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { AccessError, publicError, requireUser } from '@/lib/access-control'
import { getCourseProgress } from '@/lib/learning-evidence'

export async function GET(_request: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
  try {
    const user = await requireUser()
    const { courseId } = await params
    const progress = await getCourseProgress(user.id, courseId)
    const [certificate, course] = await Promise.all([
      prisma.certificate.findUnique({ where: { userId_courseId: { userId: user.id, courseId } } }),
      prisma.course.findUnique({ where: { id: courseId }, select: { hasCertificate: true } }),
    ])
    const finalExam = progress.lessons.find(lesson => lesson.isFinalExam) || null
    return NextResponse.json({
      progress: { completedLessons: progress.completedLessons, totalLessons: progress.totalLessons,
        percentage: progress.percentage, isComplete: progress.isComplete },
      lessons: progress.lessons,
      finalExam: finalExam ? { id: finalExam.id, title: finalExam.title, completed: finalExam.completed, passed: finalExam.completed } : null,
      certificate,
      hasCertificate: course?.hasCertificate === true,
      canIssueCertificate: course?.hasCertificate === true && progress.isComplete && !certificate,
    })
  } catch (error) {
    return NextResponse.json({ error: publicError(error) }, { status: error instanceof AccessError ? error.status : 500 })
  }
}
