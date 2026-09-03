import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export class AccessError extends Error {
  constructor(message: string, public status = 403) { super(message) }
}

export async function requireUser() {
  const session = await auth()
  if (!session?.user?.id) throw new AccessError('Authentication required', 401)
  // Roles can change after a JWT has been issued.
  const user = await prisma.user.findUnique({
    where: { id: session.user.id }, select: { id: true, role: true, email: true }
  })
  if (!user) throw new AccessError('Authentication required', 401)
  return user
}

export async function requireAdmin() {
  const user = await requireUser()
  if (user.role !== 'ADMIN') throw new AccessError('Admin access required')
  return user
}

export async function requireSelf(userId: string) {
  const user = await requireUser()
  if (user.id !== userId) throw new AccessError('Cannot change another learner\'s progress')
  return user
}

/** Allow a learner to access their own resource while preserving admin reporting access. */
export async function requireSelfOrAdmin(userId: string) {
  const user = await requireUser()
  if (user.id !== userId && user.role !== 'ADMIN') {
    throw new AccessError('Access denied')
  }
  return user
}

export async function requireEnrollment(userId: string, courseId: string) {
  const enrollment = await prisma.enrollment.findUnique({ where: { userId_courseId: { userId, courseId } } })
  if (!enrollment) throw new AccessError('Course enrollment required')
}

export async function requireLessonAccess(userId: string, lessonId: string, courseId?: string) {
  await requireSelf(userId)
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } })
  if (!lesson || (courseId && lesson.courseId !== courseId)) throw new AccessError('Lesson not found', 404)
  await requireEnrollment(userId, lesson.courseId)
  return lesson
}

export function publicError(error: unknown) {
  return error instanceof AccessError ? error.message : 'Unable to complete request'
}

export async function adminAccessDenied() {
  try { await requireAdmin(); return null }
  catch (error) {
    return NextResponse.json({ error: publicError(error) }, { status: error instanceof AccessError ? error.status : 503 })
  }
}
