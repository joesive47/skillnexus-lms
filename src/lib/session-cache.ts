import redis, { setCache, getCache, deleteCache } from './redis'

export async function cacheSession(sessionId: string, data: any, ttl = 604800) { // 7 days
  await setCache(`session:${sessionId}`, data, ttl)
}

export async function getSessionCache(sessionId: string) {
  return await getCache(`session:${sessionId}`)
}

export async function deleteSessionCache(sessionId: string) {
  await deleteCache(`session:${sessionId}`)
}

export async function cacheUserData(userId: string, data: any, ttl = 3600) { // 1 hour
  await setCache(`user:${userId}`, data, ttl)
}

export async function getUserCache(userId: string) {
  return await getCache(`user:${userId}`)
}