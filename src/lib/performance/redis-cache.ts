import { createClient } from 'redis'

let redisClient: ReturnType<typeof createClient> | null = null

export async function getRedisClient() {
  if (!redisClient && process.env.REDIS_URL) {
    redisClient = createClient({ url: process.env.REDIS_URL })
    await redisClient.connect()
  }
  return redisClient
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const client = await getRedisClient()
  if (!client) return null
  
  const data = await client.get(key)
  return data ? JSON.parse(data) : null
}

export async function cacheSet(key: string, value: any, ttl: number = 3600) {
  const client = await getRedisClient()
  if (!client) return
  
  await client.setEx(key, ttl, JSON.stringify(value))
}

export async function cacheDel(key: string) {
  const client = await getRedisClient()
  if (!client) return
  
  await client.del(key)
}

export async function cacheInvalidatePattern(pattern: string) {
  const client = await getRedisClient()
  if (!client) return
  
  const keys = await client.keys(pattern)
  if (keys.length > 0) {
    await client.del(keys)
  }
}

export const cacheKeys = {
  user: (id: string) => `user:${id}`,
  course: (id: string) => `course:${id}`,
  courses: (page: number) => `courses:page:${page}`,
  userCourses: (userId: string) => `user:${userId}:courses`,
  userCertificates: (userId: string) => `user:${userId}:certificates`,
}
