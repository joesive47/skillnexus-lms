/**
 * Phase 9: Data Encryption Service
 * AES-256 encryption for sensitive data
 */

import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;

export class EncryptionService {
  private static instance: EncryptionService;
  private key: Buffer;

  private constructor() {
    this.key = Buffer.from(KEY.slice(0, 64), 'hex');
  }

  static getInstance(): EncryptionService {
    if (!EncryptionService.instance) {
      EncryptionService.instance = new EncryptionService();
    }
    return EncryptionService.instance;
  }

  encrypt(text: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, this.key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    return `${iv.toString('hex')}:${encrypted}:${tag.toString('hex')}`;
  }

  decrypt(encryptedData: string): string {
    const parts = encryptedData.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const tag = Buffer.from(parts[2], 'hex');
    
    const decipher = crypto.createDecipheriv(ALGORITHM, this.key, iv);
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  hash(text: string): string {
    return crypto.createHash('sha256').update(text).digest('hex');
  }

  hashWithSalt(text: string): string {
    const salt = crypto.randomBytes(SALT_LENGTH).toString('hex');
    const hash = crypto.pbkdf2Sync(text, salt, 10000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
  }

  verifyHash(text: string, hashedText: string): boolean {
    const [salt, hash] = hashedText.split(':');
    const verifyHash = crypto.pbkdf2Sync(text, salt, 10000, 64, 'sha512').toString('hex');
    return hash === verifyHash;
  }
}

export const encryptionService = EncryptionService.getInstance();
