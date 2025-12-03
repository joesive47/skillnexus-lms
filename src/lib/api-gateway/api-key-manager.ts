import { nanoid } from 'nanoid'
import prisma from '@/lib/prisma'

export async function generateApiKey(userId: string, name: string) {
  const key = `sk_${nanoid(32)}`
  
  await prisma.apiKey.create({
    data: {
      key,
      name,
      userId,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    }
  })
  
  return key
}

export async function validateApiKey(key: string) {
  const apiKey = await prisma.apiKey.findUnique({
    where: { key },
    include: { user: true }
  })
  
  if (!apiKey) return null
  if (apiKey.expiresAt && apiKey.expiresAt < new Date()) return null
  if (!apiKey.isActive) return null
  
  await prisma.apiKey.update({
    where: { key },
    data: { lastUsedAt: new Date() }
  })
  
  return apiKey
}

export async function revokeApiKey(key: string) {
  await prisma.apiKey.update({
    where: { key },
    data: { isActive: false }
  })
}
