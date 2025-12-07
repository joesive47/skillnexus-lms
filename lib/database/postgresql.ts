/**
 * PostgreSQL Database Configuration and Optimization
 * Optimized for SkillNexus LMS performance
 */

import { PrismaClient } from '@prisma/client'

// Global Prisma instance for connection reuse
declare global {
  var __prisma: PrismaClient | undefined
}

// PostgreSQL connection configuration
const createPrismaClient = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'pretty',
  })
}

// Singleton pattern for Prisma client
export const prisma = globalThis.__prisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma
}

// Database health check
export async function checkDatabaseHealth(): Promise<{
  status: 'healthy' | 'unhealthy'
  latency: number
  error?: string
}> {
  const start = Date.now()
  
  try {
    await prisma.$queryRaw`SELECT 1`
    const latency = Date.now() - start
    
    return {
      status: 'healthy',
      latency,
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      latency: Date.now() - start,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Database statistics
export async function getDatabaseStats() {
  try {
    const [userCount, courseCount, enrollmentCount] = await Promise.all([
      prisma.user.count(),
      prisma.course.count(),
      prisma.enrollment.count(),
    ])

    return {
      users: userCount,
      courses: courseCount,
      enrollments: enrollmentCount,
    }
  } catch (error) {
    console.error('Failed to get database stats:', error)
    return null
  }
}

export default prisma