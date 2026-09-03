import prisma from '@/lib/prisma'
import { decryptProviderKey } from '@/lib/ai-provider-crypto'

type ProviderName = 'OPENAI' | 'GEMINI'

type GenerateOptions = {
  message: string
  context?: string
  userId?: string
}

type ProviderResult = {
  text: string
  provider: ProviderName
  model: string
  inputTokens: number
  outputTokens: number
}

export class AIProviderUnavailableError extends Error {}

const monthStart = () => {
  const now = new Date()
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
}

async function providerConfig() {
  return prisma.aIProviderConfig.findFirst({
    where: { enabled: true },
    orderBy: [{ isDefault: 'desc' }, { updatedAt: 'desc' }],
  })
}

async function enforceQuota(provider: string, monthlyLimit: number, rpm: number) {
  const [monthly, recent] = await Promise.all([
    prisma.aIUsageLog.aggregate({
      where: { provider, createdAt: { gte: monthStart() }, status: 'SUCCESS' },
      _sum: { inputTokens: true, outputTokens: true },
    }),
    prisma.aIUsageLog.count({
      where: { provider, createdAt: { gte: new Date(Date.now() - 60_000) } },
    }),
  ])
  const used = (monthly._sum.inputTokens ?? 0) + (monthly._sum.outputTokens ?? 0)
  if (used >= monthlyLimit) throw new AIProviderUnavailableError('Monthly AI token budget reached')
  if (recent >= rpm) throw new AIProviderUnavailableError('AI request rate limit reached')
}

async function callOpenAI(apiKey: string, model: string, prompt: string): Promise<ProviderResult> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      max_tokens: 700,
      messages: [
        { role: 'system', content: 'You are the upPowerSkill LMS assistant. Answer in the same language as the learner. Use supplied LMS context when present, do not invent policies or completion records.' },
        { role: 'user', content: prompt },
      ],
    }),
    signal: AbortSignal.timeout(20_000),
  })
  if (!response.ok) throw new Error(`OPENAI_${response.status}`)
  const data = await response.json() as {
    choices?: Array<{ message?: { content?: string } }>
    usage?: { prompt_tokens?: number; completion_tokens?: number }
  }
  const text = data.choices?.[0]?.message?.content?.trim()
  if (!text) throw new Error('OPENAI_EMPTY_RESPONSE')
  return { text, provider: 'OPENAI', model, inputTokens: data.usage?.prompt_tokens ?? 0, outputTokens: data.usage?.completion_tokens ?? 0 }
}

async function callGemini(apiKey: string, model: string, prompt: string): Promise<ProviderResult> {
  const safeModel = /^[a-zA-Z0-9._-]{1,100}$/.test(model) ? model : 'gemini-2.0-flash'
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${safeModel}:generateContent`, {
    method: 'POST',
    headers: { 'x-goog-api-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: 'You are the upPowerSkill LMS assistant. Answer in the same language as the learner. Use supplied LMS context and do not invent learner records.' }] },
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 700 },
    }),
    signal: AbortSignal.timeout(20_000),
  })
  if (!response.ok) throw new Error(`GEMINI_${response.status}`)
  const data = await response.json() as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
    usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number }
  }
  const text = data.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('').trim()
  if (!text) throw new Error('GEMINI_EMPTY_RESPONSE')
  return { text, provider: 'GEMINI', model: safeModel, inputTokens: data.usageMetadata?.promptTokenCount ?? 0, outputTokens: data.usageMetadata?.candidatesTokenCount ?? 0 }
}

export async function generateProviderResponse({ message, context, userId }: GenerateOptions) {
  const config = await providerConfig()
  if (!config) throw new AIProviderUnavailableError('No AI provider is enabled')
  await enforceQuota(config.provider, config.monthlyTokenLimit, config.requestsPerMinute)
  const startedAt = Date.now()
  const prompt = context?.trim() ? `LMS context:\n${context.slice(0, 12_000)}\n\nLearner question:\n${message}` : message
  try {
    const key = decryptProviderKey(config.encryptedApiKey, config.encryptionIv, config.encryptionTag)
    const result = config.provider === 'OPENAI'
      ? await callOpenAI(key, config.model, prompt)
      : config.provider === 'GEMINI'
        ? await callGemini(key, config.model, prompt)
        : (() => { throw new AIProviderUnavailableError('Unsupported AI provider') })()
    await prisma.aIUsageLog.create({ data: { userId, provider: result.provider, model: result.model, inputTokens: result.inputTokens, outputTokens: result.outputTokens, latencyMs: Date.now() - startedAt, status: 'SUCCESS' } })
    return result
  } catch (error) {
    const code = error instanceof Error ? error.message.slice(0, 80) : 'UNKNOWN'
    await prisma.aIUsageLog.create({ data: { userId, provider: config.provider, model: config.model, latencyMs: Date.now() - startedAt, status: 'ERROR', errorCode: code } })
    throw new AIProviderUnavailableError('The configured AI provider is temporarily unavailable')
  }
}

export async function testAIProvider(provider: ProviderName) {
  const config = await prisma.aIProviderConfig.findUnique({ where: { provider } })
  if (!config) throw new AIProviderUnavailableError('Provider is not configured')
  const startedAt = Date.now()
  try {
    const key = decryptProviderKey(config.encryptedApiKey, config.encryptionIv, config.encryptionTag)
    const result = provider === 'OPENAI'
      ? await callOpenAI(key, config.model, 'Reply with exactly: OK')
      : await callGemini(key, config.model, 'Reply with exactly: OK')
    await prisma.aIProviderConfig.update({ where: { provider }, data: { lastTestedAt: new Date(), lastTestStatus: 'SUCCESS' } })
    await prisma.aIUsageLog.create({ data: { provider, model: result.model, inputTokens: result.inputTokens, outputTokens: result.outputTokens, latencyMs: Date.now() - startedAt, status: 'TEST_SUCCESS' } })
    return { success: true, latencyMs: Date.now() - startedAt }
  } catch {
    await prisma.aIProviderConfig.update({ where: { provider }, data: { lastTestedAt: new Date(), lastTestStatus: 'ERROR' } })
    throw new AIProviderUnavailableError('Provider connection test failed')
  }
}
