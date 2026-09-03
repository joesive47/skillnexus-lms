import { dbCircuitBreaker, redisCircuitBreaker } from './circuit-breaker'

export class FallbackService {
  static async withFallback<T>(
    primary: () => Promise<T>,
    fallback: () => Promise<T> | T,
    circuitBreaker?: any
  ): Promise<T> {
    try {
      if (circuitBreaker) {
        return await circuitBreaker.execute(primary)
      }
      return await primary()
    } catch (error) {
      console.warn('Primary service failed, using fallback:', error instanceof Error ? error.message : String(error))
      return await fallback()
    }
  }

  static async getFromCacheWithFallback<T>(
    key: string,
    dbQuery: () => Promise<T>
  ): Promise<T> {
    return this.withFallback(
      async () => {
        const cached = await redisCircuitBreaker.execute(async () => {
          // Redis call here
          return null
        })
        if (cached) return JSON.parse(cached)
        throw new Error('Cache miss')
      },
      () => dbCircuitBreaker.execute(dbQuery),
      redisCircuitBreaker
    )
  }
}

export const safeExecute = FallbackService.withFallback