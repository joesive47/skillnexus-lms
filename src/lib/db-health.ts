import { prisma } from './prisma'

export interface DatabaseHealth {
  status: 'healthy' | 'unhealthy' | 'degraded'
  message: string
  latency?: number
  details?: Record<string, any>
}

/**
 * Check database health and connection status
 */
export async function checkDatabaseHealth(): Promise<DatabaseHealth> {
  const startTime = Date.now()
  
  try {
    // Simple query to check connection
    await prisma.$queryRaw`SELECT 1`
    
    const latency = Date.now() - startTime
    
    return {
      status: latency < 100 ? 'healthy' : 'degraded',
      message: latency < 100 ? 'Database is healthy' : 'Database is slow',
      latency,
      details: {
        timestamp: new Date().toISOString(),
        latencyMs: latency,
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    return {
      status: 'unhealthy',
      message: `Database connection failed: ${errorMessage}`,
      latency: Date.now() - startTime,
      details: {
        error: errorMessage,
        timestamp: new Date().toISOString(),
      }
    }
  }
}

/**
 * Wrapper for database queries with error handling
 */
export async function safeQuery<T>(
  queryFn: () => Promise<T>,
  fallback?: T
): Promise<T | null> {
  try {
    return await queryFn()
  } catch (error) {
    console.error('Database query failed:', error)
    
    // If fallback is provided, return it
    if (fallback !== undefined) {
      return fallback
    }
    
    // Otherwise return null
    return null
  }
}

/**
 * Check if database is available
 */
export async function isDatabaseAvailable(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch {
    return false
  }
}
