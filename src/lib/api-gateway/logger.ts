import prisma from '@/lib/prisma'

export async function logApiRequest(data: {
  method: string
  path: string
  statusCode: number
  responseTime: number
  userId?: string
  apiKeyId?: string
  ip?: string
}) {
  try {
    await prisma.apiLog.create({
      data: {
        method: data.method,
        path: data.path,
        statusCode: data.statusCode,
        responseTime: data.responseTime,
        userId: data.userId,
        apiKeyId: data.apiKeyId,
        ip: data.ip,
      }
    })
  } catch (error) {
    console.error('Failed to log API request:', error)
  }
}

export function createRequestLogger() {
  const startTime = Date.now()
  
  return {
    log: async (method: string, path: string, statusCode: number, userId?: string) => {
      const responseTime = Date.now() - startTime
      await logApiRequest({ method, path, statusCode, responseTime, userId })
    }
  }
}
