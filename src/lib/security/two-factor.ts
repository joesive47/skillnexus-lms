// Two-Factor Authentication (TOTP)
import crypto from 'crypto'

export class TwoFactor {
  private static base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

  static generateSecret(): string {
    const buffer = crypto.randomBytes(20)
    let secret = ''
    for (let i = 0; i < buffer.length; i++) {
      secret += this.base32Chars[buffer[i] % 32]
    }
    return secret
  }

  static generateTOTP(secret: string, window = 0): string {
    const epoch = Math.floor(Date.now() / 1000 / 30) + window
    const buffer = Buffer.alloc(8)
    buffer.writeBigInt64BE(BigInt(epoch))
    
    const hmac = crypto.createHmac('sha1', this.base32Decode(secret))
    hmac.update(buffer)
    const hash = hmac.digest()
    
    const offset = hash[hash.length - 1] & 0xf
    const code = (
      ((hash[offset] & 0x7f) << 24) |
      ((hash[offset + 1] & 0xff) << 16) |
      ((hash[offset + 2] & 0xff) << 8) |
      (hash[offset + 3] & 0xff)
    ) % 1000000
    
    return code.toString().padStart(6, '0')
  }

  static verifyTOTP(secret: string, token: string): boolean {
    for (let window = -1; window <= 1; window++) {
      if (this.generateTOTP(secret, window) === token) {
        return true
      }
    }
    return false
  }

  static generateBackupCodes(count = 10): string[] {
    const codes: string[] = []
    for (let i = 0; i < count; i++) {
      const code = crypto.randomBytes(4).toString('hex').toUpperCase()
      codes.push(`${code.slice(0, 4)}-${code.slice(4)}`)
    }
    return codes
  }

  static getQRCodeURL(secret: string, email: string, issuer = 'SkillNexus'): string {
    const otpauth = `otpauth://totp/${issuer}:${email}?secret=${secret}&issuer=${issuer}`
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauth)}`
  }

  private static base32Decode(encoded: string): Buffer {
    const cleanedInput = encoded.toUpperCase().replace(/=+$/, '')
    const buffer = Buffer.alloc(Math.ceil(cleanedInput.length * 5 / 8))
    
    let bits = 0
    let value = 0
    let index = 0
    
    for (let i = 0; i < cleanedInput.length; i++) {
      const char = cleanedInput[i]
      const charValue = this.base32Chars.indexOf(char)
      
      if (charValue === -1) continue
      
      value = (value << 5) | charValue
      bits += 5
      
      if (bits >= 8) {
        buffer[index++] = (value >>> (bits - 8)) & 0xff
        bits -= 8
      }
    }
    
    return buffer.slice(0, index)
  }
}
