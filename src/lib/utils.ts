import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { randomBytes } from 'crypto'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate a cryptographically secure verification code
 */
export function generateVerificationCode(): string {
  return randomBytes(16).toString('hex').toUpperCase()
}

/**
 * Format verification code for display (XXXX-XXXX-XXXX-XXXX)
 */
export function formatVerificationCode(code: string): string {
  return code.replace(/(\w{4})/g, '$1-').slice(0, -1)
}