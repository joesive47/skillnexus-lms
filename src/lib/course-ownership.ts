import type { Prisma } from '@prisma/client'
import prisma from '@/lib/prisma'
import { AccessError, requireAdminOrTeacher } from '@/lib/access-control'

export const ADMIN_OWNER_VALUE = '__current_admin__'

type CourseManager = {
  id: string
  role: string
}

export function managedCourseWhere(user: CourseManager): Prisma.CourseWhereInput {
  return user.role === 'ADMIN' ? {} : { instructorId: user.id }
}

export async function requireCourseManager(courseId: string) {
  const user = await requireAdminOrTeacher()
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { id: true, instructorId: true },
  })

  if (!course) throw new AccessError('Course not found', 404)
  if (user.role !== 'ADMIN' && course.instructorId !== user.id) {
    throw new AccessError('You can only manage courses assigned to you')
  }

  return { user, course }
}

export async function resolveCourseInstructorId(
  user: CourseManager,
  requestedValue: FormDataEntryValue | null,
  existingInstructorId: string | null = null,
) {
  if (user.role !== 'ADMIN') return user.id

  const requestedInstructorId = typeof requestedValue === 'string' ? requestedValue.trim() : ''
  if (!requestedInstructorId) return existingInstructorId || user.id
  if (requestedInstructorId === ADMIN_OWNER_VALUE) return user.id

  const instructor = await prisma.user.findFirst({
    where: { id: requestedInstructorId, role: 'TEACHER' },
    select: { id: true },
  })
  if (!instructor) throw new AccessError('Selected instructor is not available', 400)

  return instructor.id
}
