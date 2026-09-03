import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { AccessError, publicError, requireAdmin } from '@/lib/access-control'
import { encryptProviderKey } from '@/lib/ai-provider-crypto'
import { testAIProvider } from '@/lib/ai-provider-gateway'

const providerSchema = z.enum(['OPENAI', 'GEMINI'])
const configSchema = z.object({
  provider: providerSchema,
  model: z.string().trim().min(1).max(100).regex(/^[a-zA-Z0-9._-]+$/),
  apiKey: z.string().trim().max(500).optional(),
  enabled: z.boolean().default(false),
  isDefault: z.boolean().default(false),
  monthlyTokenLimit: z.number().int().min(1_000).max(100_000_000),
  requestsPerMinute: z.number().int().min(1).max(300),
})

const monthStart = () => {
  const now = new Date()
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
}

export async function GET() {
  try {
    await requireAdmin()
    const [configs, usage] = await Promise.all([
      prisma.aIProviderConfig.findMany({ orderBy: { provider: 'asc' } }),
      prisma.aIUsageLog.groupBy({
        by: ['provider'],
        where: { createdAt: { gte: monthStart() }, status: { in: ['SUCCESS', 'TEST_SUCCESS'] } },
        _sum: { inputTokens: true, outputTokens: true },
        _count: { id: true },
      }),
    ])
    return NextResponse.json({
      providers: configs.map(config => ({
        provider: config.provider,
        model: config.model,
        enabled: config.enabled,
        isDefault: config.isDefault,
        monthlyTokenLimit: config.monthlyTokenLimit,
        requestsPerMinute: config.requestsPerMinute,
        keyConfigured: !!config.encryptedApiKey,
        maskedKey: `••••••••${config.keyLastFour}`,
        lastTestedAt: config.lastTestedAt,
        lastTestStatus: config.lastTestStatus,
        usage: usage.find(item => item.provider === config.provider) ?? null,
      })),
    })
  } catch (error) {
    return NextResponse.json({ error: publicError(error) }, { status: error instanceof AccessError ? error.status : 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin()
    const payload = configSchema.parse(await request.json())
    const existing = await prisma.aIProviderConfig.findUnique({ where: { provider: payload.provider } })
    if (!existing && !payload.apiKey) return NextResponse.json({ error: 'API key is required for a new provider' }, { status: 400 })
    const secret = payload.apiKey ? encryptProviderKey(payload.apiKey) : null
    await prisma.$transaction(async tx => {
      if (payload.isDefault) await tx.aIProviderConfig.updateMany({ data: { isDefault: false } })
      await tx.aIProviderConfig.upsert({
        where: { provider: payload.provider },
        create: {
          provider: payload.provider,
          model: payload.model,
          encryptedApiKey: secret?.ciphertext || existing?.encryptedApiKey || '',
          encryptionIv: secret?.iv || existing?.encryptionIv || '',
          encryptionTag: secret?.tag || existing?.encryptionTag || '',
          keyLastFour: secret?.lastFour || existing?.keyLastFour || '',
          enabled: payload.enabled,
          isDefault: payload.isDefault,
          monthlyTokenLimit: payload.monthlyTokenLimit,
          requestsPerMinute: payload.requestsPerMinute,
          createdBy: admin.id,
        },
        update: {
          model: payload.model,
          enabled: payload.enabled,
          isDefault: payload.isDefault,
          monthlyTokenLimit: payload.monthlyTokenLimit,
          requestsPerMinute: payload.requestsPerMinute,
          ...(secret ? { encryptedApiKey: secret.ciphertext, encryptionIv: secret.iv, encryptionTag: secret.tag, keyLastFour: secret.lastFour } : {}),
        },
      })
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Invalid provider configuration' }, { status: 400 })
    return NextResponse.json({ error: publicError(error) }, { status: error instanceof AccessError ? error.status : 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin()
    const provider = providerSchema.parse((await request.json()).provider)
    return NextResponse.json(await testAIProvider(provider))
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Invalid provider' }, { status: 400 })
    return NextResponse.json({ error: error instanceof Error ? error.message : publicError(error) }, { status: error instanceof AccessError ? error.status : 503 })
  }
}
