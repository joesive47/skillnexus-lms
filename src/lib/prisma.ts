import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Enhanced Prisma Client with connection error handling
const createPrismaClient = () => {
  try {
    // Check if DATABASE_URL exists
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL is not defined in environment variables')
      throw new Error('DATABASE_URL environment variable is required')
    }

    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      errorFormat: 'minimal',
      // เพิ่ม connection pooling สำหรับ production
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    })
  } catch (error) {
    console.error('❌ Failed to create Prisma Client:', error)
    throw error
  }
}

const prisma = globalForPrisma.prisma ?? createPrismaClient()

// Database connection happens automatically on first query
// Removed eager connection to prevent build-time hangs

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Graceful shutdown
if (typeof window === 'undefined') {
  const shutdown = async () => {
    await prisma.$disconnect()
  }
  
  process.on('beforeExit', shutdown)
  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
}

export default prisma
export { prisma }