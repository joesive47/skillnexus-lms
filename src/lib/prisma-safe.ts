import prisma from './prisma'
import { handleError } from './error-handler'

export async function safeQuery<T>(
  operation: () => Promise<T>,
  fallback?: T | null,
  context?: string
): Promise<T | null> {
  try {
    return await operation()
  } catch (error) {
    handleError(error, `DB_QUERY: ${context}`)
    return fallback || null
  }
}

export async function safePrismaOperation<T>(
  operation: () => Promise<T>,
  fallback?: T | null
): Promise<T | null> {
  try {
    // ตรวจสอบการเชื่อมต่อก่อน
    await prisma.$queryRaw`SELECT 1`
    return await operation()
  } catch (error) {
    handleError(error, 'PRISMA_OPERATION')
    
    // พยายามเชื่อมต่อใหม่
    try {
      await prisma.$connect()
      return await operation()
    } catch (retryError) {
      handleError(retryError, 'PRISMA_RETRY')
      return fallback || null
    }
  }
}

// Helper functions สำหรับ operations ที่ใช้บ่อย
export const safeUserFind = (email: string) =>
  safePrismaOperation(() => 
    prisma.user.findUnique({ where: { email } })
  )

export const safeCourseList = () =>
  safePrismaOperation(() => 
    prisma.course.findMany({ where: { published: true } })
  , [])

export const safeEnrollmentCheck = (userId: string, courseId: string) =>
  safePrismaOperation(() =>
    prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } }
    })
  )