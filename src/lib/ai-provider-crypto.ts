import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto'

export type EncryptedSecret = {
  ciphertext: string
  iv: string
  tag: string
  lastFour: string
}

function encryptionKey() {
  const secret = process.env.AI_KEY_ENCRYPTION_SECRET || process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET
  if (!secret || secret.length < 32) throw new Error('AI provider encryption secret is not configured')
  return createHash('sha256').update(secret).digest()
}

export function encryptProviderKey(apiKey: string): EncryptedSecret {
  const value = apiKey.trim()
  if (value.length < 12 || value.length > 500) throw new Error('Invalid provider API key')
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', encryptionKey(), iv)
  const ciphertext = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()])
  return {
    ciphertext: ciphertext.toString('base64'),
    iv: iv.toString('base64'),
    tag: cipher.getAuthTag().toString('base64'),
    lastFour: value.slice(-4),
  }
}

export function decryptProviderKey(ciphertext: string, iv: string, tag: string) {
  const decipher = createDecipheriv('aes-256-gcm', encryptionKey(), Buffer.from(iv, 'base64'))
  decipher.setAuthTag(Buffer.from(tag, 'base64'))
  return Buffer.concat([decipher.update(Buffer.from(ciphertext, 'base64')), decipher.final()]).toString('utf8')
}
