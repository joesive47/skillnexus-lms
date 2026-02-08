/**
 * Unit tests for Validation Utilities
 */
import { describe, it, expect } from '@jest/globals'

describe('Validation Utilities', () => {
  describe('Email Validation', () => {
    const validateEmail = (email: string): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    }

    it('should validate correct email format', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name@domain.co.th')).toBe(true)
      expect(validateEmail('first+last@test.io')).toBe(true)
    })

    it('should reject invalid email format', () => {
      expect(validateEmail('invalid')).toBe(false)
      expect(validateEmail('test@')).toBe(false)
      expect(validateEmail('@example.com')).toBe(false)
      expect(validateEmail('test @example.com')).toBe(false)
    })
  })

  describe('Password Strength Validation', () => {
    const validatePassword = (password: string): boolean => {
      // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
      const minLength = password.length >= 8
      const hasUpperCase = /[A-Z]/.test(password)
      const hasLowerCase = /[a-z]/.test(password)
      const hasNumber = /\d/.test(password)
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
      
      return minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar
    }

    it('should accept strong passwords', () => {
      expect(validatePassword('StrongPass123!')).toBe(true)
      expect(validatePassword('MyP@ssw0rd')).toBe(true)
      expect(validatePassword('Test1234!')).toBe(true)
    })

    it('should reject weak passwords', () => {
      expect(validatePassword('weak')).toBe(false) // Too short
      expect(validatePassword('weakpassword')).toBe(false) // No uppercase, number, special
      expect(validatePassword('WEAKPASSWORD')).toBe(false) // No lowercase, number, special
      expect(validatePassword('WeakPassword')).toBe(false) // No number, special
      expect(validatePassword('WeakPass123')).toBe(false) // No special char
    })
  })

  describe('URL Validation', () => {
    const validateURL = (url: string): boolean => {
      try {
        new URL(url)
        return true
      } catch {
        return false
      }
    }

    it('should validate correct URLs', () => {
      expect(validateURL('https://example.com')).toBe(true)
      expect(validateURL('http://localhost:3000')).toBe(true)
      expect(validateURL('https://sub.domain.co.th/path')).toBe(true)
    })

    it('should reject invalid URLs', () => {
      expect(validateURL('not a url')).toBe(false)
      expect(validateURL('example.com')).toBe(false) // Missing protocol
      expect(validateURL('://invalid')).toBe(false)
    })
  })

  describe('Phone Number Validation (Thai)', () => {
    const validateThaiPhone = (phone: string): boolean => {
      // Thai phone: 0X-XXXX-XXXX or 0XXXXXXXXX
      const phoneRegex = /^(0\d{1}-?\d{4}-?\d{4}|0\d{9})$/
      return phoneRegex.test(phone.replace(/\s/g, ''))
    }

    it('should validate Thai phone numbers', () => {
      expect(validateThaiPhone('081-234-5678')).toBe(true)
      expect(validateThaiPhone('0812345678')).toBe(true)
      expect(validateThaiPhone('02-123-4567')).toBe(true)
    })

    it('should reject invalid phone numbers', () => {
      expect(validateThaiPhone('123456')).toBe(false)
      expect(validateThaiPhone('1234567890')).toBe(false) // Not starting with 0
      expect(validateThaiPhone('081-234-567')).toBe(false) // Too short
    })
  })

  describe('File Extension Validation', () => {
    const validateFileExtension = (filename: string, allowedExtensions: string[]): boolean => {
      const extension = filename.split('.').pop()?.toLowerCase()
      return extension ? allowedExtensions.includes(extension) : false
    }

    it('should validate allowed file extensions', () => {
      const allowedImages = ['jpg', 'jpeg', 'png', 'gif']
      expect(validateFileExtension('photo.jpg', allowedImages)).toBe(true)
      expect(validateFileExtension('image.PNG', allowedImages)).toBe(true)
    })

    it('should reject disallowed file extensions', () => {
      const allowedImages = ['jpg', 'jpeg', 'png', 'gif']
      expect(validateFileExtension('file.pdf', allowedImages)).toBe(false)
      expect(validateFileExtension('script.exe', allowedImages)).toBe(false)
    })
  })

  describe('Date Validation', () => {
    const isValidDate = (dateString: string): boolean => {
      const date = new Date(dateString)
      return date instanceof Date && !isNaN(date.getTime())
    }

    it('should validate correct date formats', () => {
      expect(isValidDate('2024-01-15')).toBe(true)
      expect(isValidDate('2024/01/15')).toBe(true)
      expect(isValidDate('Jan 15, 2024')).toBe(true)
    })

    it('should reject invalid dates', () => {
      expect(isValidDate('invalid')).toBe(false)
      expect(isValidDate('2024-13-01')).toBe(false) // Invalid month
      expect(isValidDate('2024-01-32')).toBe(false) // Invalid day
    })
  })

  describe('Score Validation', () => {
    const validateScore = (score: number, min: number = 0, max: number = 100): boolean => {
      return score >= min && score <= max && !isNaN(score)
    }

    it('should validate scores within range', () => {
      expect(validateScore(0)).toBe(true)
      expect(validateScore(50)).toBe(true)
      expect(validateScore(100)).toBe(true)
    })

    it('should reject scores outside range', () => {
      expect(validateScore(-1)).toBe(false)
      expect(validateScore(101)).toBe(false)
      expect(validateScore(NaN)).toBe(false)
    })
  })

  describe('Input Sanitization', () => {
    const sanitizeInput = (input: string): string => {
      return input
        .trim()
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .replace(/javascript:/gi, '') // Remove javascript: protocol
    }

    it('should remove dangerous characters', () => {
      expect(sanitizeInput('<script>alert("XSS")</script>')).toBe('scriptalert("XSS")/script')
      expect(sanitizeInput('javascript:void(0)')).toBe('void(0)')
    })

    it('should trim whitespace', () => {
      expect(sanitizeInput('  hello  ')).toBe('hello')
      expect(sanitizeInput('\n\ttext\n\t')).toBe('text')
    })
  })
})
