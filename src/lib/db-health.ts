import { prisma } from './prisma'

export interface DatabaseHealth {
  status: 'healthy' | 'unhealthy' | 'degraded'
  message: string
  latency?: number
  details?: Record<string, unknown>
}

const DEFAULT_HEALTHY_QUERY_LATENCY_MS = 250
const DEFAULT_DEGRADED_QUERY_LATENCY_MS = 1_000
const DEFAULT_HEALTH_CHECK_TIMEOUT_MS = 5_000

function positiveEnvironmentNumber(name: string, fallback: number): number {
  const value = Number(process.env[name])
  return Number.isFinite(value) && value > 0 ? value : fallback
}

function withTimeout<T>(operation: Promise<T>, timeoutMs: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined

  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Database health check timed out after ${timeoutMs}ms`)), timeoutMs)
  })

  return Promise.race([operation, timeout]).finally(() => {
    if (timer) clearTimeout(timer)
  })
}

/**
 * Check database health and connection status
 */
export async function checkDatabaseHealth(): Promise<DatabaseHealth> {
  const healthyQueryLatencyMs = positiveEnvironmentNumber('DATABASE_HEALTHY_QUERY_LATENCY_MS', DEFAULT_HEALTHY_QUERY_LATENCY_MS)
  const degradedQueryLatencyMs = Math.max(
    healthyQueryLatencyMs,
    positiveEnvironmentNumber('DATABASE_DEGRADED_QUERY_LATENCY_MS', DEFAULT_DEGRADED_QUERY_LATENCY_MS),
  )
  const timeoutMs = positiveEnvironmentNumber('DATABASE_HEALTH_CHECK_TIMEOUT_MS', DEFAULT_HEALTH_CHECK_TIMEOUT_MS)
  const startedAt = Date.now()
  
  try {
    // Measure initial connection separately. A cold serverless instance can spend
    // hundreds of milliseconds opening its first connection even when normal
    // database queries are fast. Prisma can defer part of that initialization
    // until the first query, so warm it up before measuring the steady-state
    // query used for the health classification.
    await withTimeout(prisma.$connect(), timeoutMs)
    const connectedAt = Date.now()
    await withTimeout(prisma.$queryRaw`SELECT 1`, timeoutMs)
    const warmedAt = Date.now()
    await withTimeout(prisma.$queryRaw`SELECT 1`, timeoutMs)
    const completedAt = Date.now()

    const connectionLatency = connectedAt - startedAt
    const initialQueryLatency = warmedAt - connectedAt
    const latency = completedAt - warmedAt
    const totalLatency = completedAt - startedAt
    const status = latency <= healthyQueryLatencyMs
      ? 'healthy'
      : latency <= degradedQueryLatencyMs
        ? 'degraded'
        : 'unhealthy'
    
    return {
      status,
      message: status === 'healthy'
        ? 'Database query is healthy'
        : status === 'degraded'
          ? 'Database query is slower than expected'
          : 'Database query is too slow',
      latency,
      details: {
        timestamp: new Date().toISOString(),
        queryLatencyMs: latency,
        connectionLatencyMs: connectionLatency,
        initialQueryLatencyMs: initialQueryLatency,
        totalLatencyMs: totalLatency,
        thresholds: {
          healthyQueryLatencyMs,
          degradedQueryLatencyMs,
          timeoutMs,
        },
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    return {
      status: 'unhealthy',
      message: `Database connection failed: ${errorMessage}`,
      latency: Date.now() - startedAt,
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
    return (await checkDatabaseHealth()).status !== 'unhealthy'
  } catch {
    return false
  }
}
