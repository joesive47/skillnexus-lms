import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const missingDatabaseUrlMessage = 'DATABASE_URL environment variable is required'
const fallbackDatabaseUrl = 'postgresql://user:password@localhost:5432/skillnexus_build'

// Enhanced Prisma Client with connection error handling
const createPrismaClient = () => {
  try {
    const databaseUrl = process.env.DATABASE_URL || fallbackDatabaseUrl

    const client = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      errorFormat: 'minimal',
      // เพิ่ม connection pooling สำหรับ production
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    })

    if (!process.env.DATABASE_URL) {
      return client.$extends({
        query: {
          $allModels: {
            $allOperations() {
              throw new Error(missingDatabaseUrlMessage)
            },
          },
        },
      }) as PrismaClient
    }

    return client
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
