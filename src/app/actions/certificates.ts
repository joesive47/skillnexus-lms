'use server'

import { issueVerifiedCertificate } from '@/lib/issue-certificate'
import { requireSelf, requireEnrollment } from '@/lib/access-control'
import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export async function generateCertificate(courseId: string) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')
  try {
    const certificate = await issueVerifiedCertificate(session.user.id, courseId)
    return { success: true, certificateId: certificate.verificationToken }
  } catch { return { success: false, error: 'Complete all course requirements before requesting a certificate' } }
}

export async function getCourseProgress(userId: string, courseId: string) {
  await requireSelf(userId)
  await requireEnrollment(userId, courseId)
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