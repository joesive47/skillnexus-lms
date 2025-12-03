'use server'

import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export async function generateCertificate(courseId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  try {
    // ตรวจสอบว่าผู้ใช้ลงทะเบียนคอร์สแล้วหรือไม่
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: courseId
        }
      }
    })

    if (!enrollment) {
      throw new Error('ไม่พบการลงทะเบียนคอร์ส')
    }

    // ตรวจสอบว่าจบคอร์สแล้วหรือไม่
    const courseProgress = await getCourseProgress(session.user.id, courseId)
    if (courseProgress.completionPercentage < 100) {
      throw new Error('ต้องเรียนจบคอร์สก่อนจึงจะได้รับใบประกาศนียบัตร')
    }

    // ตรวจสอบว่ามีใบประกาศนียบัตรแล้วหรือไม่
    const existingCertificate = await prisma.certificate.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: courseId
        }
      }
    })

    if (existingCertificate) {
      return { success: true, certificateId: existingCertificate.verificationToken }
    }

    // สร้างใบประกาศนียบัตรใหม่
    const certificate = await prisma.certificate.create({
      data: {
        certificateNumber: `CERT-${Date.now()}`,
        userId: session.user.id,
        courseId: courseId,
        verificationToken: require('crypto').randomBytes(16).toString('hex'),
        digitalSignature: 'legacy-cert',
        bardData: '{}'
      }
    })

    return { success: true, certificateId: certificate.verificationToken }
  } catch (error) {
    console.error('Error generating certificate:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการออกใบประกาศนียบัตร' 
    }
  }
}

export async function getCourseProgress(userId: string, courseId: string) {
  const lessons = await prisma.lesson.findMany({
    where: { courseId },
    include: {
      watchHistory: {
        where: { userId }
      }
    }
  })

  const totalLessons = lessons.length
  const completedLessons = lessons.filter(lesson => 
    lesson.watchHistory.some(history => history.completed)
  ).length

  return {
    totalLessons,
    completedLessons,
    completionPercentage: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
  }
}

export async function getUserCertificates() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  const certificates = await prisma.certificate.findMany({
    where: { userId: session.user.id },
    include: {
      course: {
        select: {
          title: true,
          description: true,
          imageUrl: true
        }
      }
    },
    orderBy: { issuedAt: 'desc' }
  })

  return certificates
}

export async function verifyCertificate(certificateId: string) {
  const certificate = await prisma.certificate.findUnique({
    where: { verificationToken: certificateId },
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      },
      course: {
        select: {
          title: true,
          description: true
        }
      }
    }
  })

  return certificate
}