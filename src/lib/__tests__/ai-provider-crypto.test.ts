import { decryptProviderKey, encryptProviderKey } from '@/lib/ai-provider-crypto'

describe('AI provider key encryption', () => {
  const originalSecret = process.env.AI_KEY_ENCRYPTION_SECRET

  beforeEach(() => {
    process.env.AI_KEY_ENCRYPTION_SECRET = 'test-only-encryption-secret-with-32-characters'
  })

  afterAll(() => {
    if (originalSecret === undefined) delete process.env.AI_KEY_ENCRYPTION_SECRET
    else process.env.AI_KEY_ENCRYPTION_SECRET = originalSecret
  })

  it('round-trips a provider key without storing plaintext', () => {
    const apiKey = 'sk-test-1234567890abcdef'
    const encrypted = encryptProviderKey(apiKey)

    expect(encrypted.ciphertext).not.toContain(apiKey)
    expect(encrypted.lastFour).toBe('cdef')
    expect(decryptProviderKey(encrypted.ciphertext, encrypted.iv, encrypted.tag)).toBe(apiKey)
  })

  it('rejects tampered authentication tags', () => {
    const encrypted = encryptProviderKey('sk-test-1234567890abcdef')
    const alteredTag = `${encrypted.tag.slice(0, -2)}AA`

    expect(() => decryptProviderKey(encrypted.ciphertext, encrypted.iv, alteredTag)).toThrow()
  })

  it('requires a strong server-side encryption secret', () => {
    process.env.AI_KEY_ENCRYPTION_SECRET = 'too-short'

    expect(() => encryptProviderKey('sk-test-1234567890abcdef')).toThrow(
      'AI provider encryption secret is not configured'
    )
  })
})
