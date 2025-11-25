import { createClient } from 'redis'

const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
})

redis.on('error', (err) => console.log('Redis Client Error', err))
redis.connect().catch(console.error)

export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get(key)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export async function setCache(key: string, data: any, ttl = 3600): Promise<void> {
  try {
    await redis.setEx(key, ttl, JSON.stringify(data))
  } catch {}
}

export async function deleteCache(key: string): Promise<void> {
  try {
    await redis.del(key)
  } catch {}
}

export default redis