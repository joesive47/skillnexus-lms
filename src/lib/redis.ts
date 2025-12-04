import { createClient } from 'redis'

let redis: ReturnType<typeof createClient> | null = null

// Only connect if REDIS_URL is valid (not placeholder)
const isValidRedisUrl = process.env.REDIS_URL && 
  !process.env.REDIS_URL.includes('[password]') && 
  !process.env.REDIS_URL.includes('[host]') &&
  !process.env.REDIS_URL.includes('xxxxx')

if (isValidRedisUrl) {
  redis = createClient({
    url: process.env.REDIS_URL
  })
  redis.on('error', (err) => {
    console.log('Redis Client Error', err)
    redis = null
  })
  redis.connect().catch(() => {
    console.log('Redis connection failed, running without cache')
    redis = null
  })
}

export async function getCache<T>(key: string): Promise<T | null> {
  if (!redis) return null
  try {
    const data = await redis.get(key)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export async function setCache(key: string, data: any, ttl = 3600): Promise<void> {
  if (!redis) return
  try {
    await redis.setEx(key, ttl, JSON.stringify(data))
  } catch {}
}

export async function deleteCache(key: string): Promise<void> {
  if (!redis) return
  try {
    await redis.del(key)
  } catch {}
}

export default redis