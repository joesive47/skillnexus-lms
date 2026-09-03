/**
 * Unit tests for Utility Functions
 */
import { describe, it, expect } from '@jest/globals'

describe('Utility Functions', () => {
  describe('String Utilities', () => {
    const capitalize = (str: string): string => {
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
    }

    const slugify = (str: string): string => {
      return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }

    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello')
      expect(capitalize('WORLD')).toBe('World')
      expect(capitalize('tEsT')).toBe('Test')
    })

    it('should create URL-friendly slugs', () => {
      expect(slugify('Hello World')).toBe('hello-world')
      expect(slugify('Test @ Example!')).toBe('test-example')
      expect(slugify('  Multiple   Spaces  ')).toBe('multiple-spaces')
    })
  })

  describe('Array Utilities', () => {
    const unique = <T>(arr: T[]): T[] => {
      return Array.from(new Set(arr))
    }

    const chunk = <T>(arr: T[], size: number): T[][] => {
      const chunks: T[][] = []
      for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size))
      }
      return chunks
    }

    it('should remove duplicates', () => {
      expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3])
      expect(unique(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c'])
    })

    it('should chunk array into smaller arrays', () => {
      expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
      expect(chunk(['a', 'b', 'c'], 1)).toEqual([['a'], ['b'], ['c']])
    })
  })

  describe('Number Utilities', () => {
    const formatNumber = (num: number): string => {
      return num.toLocaleString('en-US')
    }

    const percentage = (value: number, total: number): number => {
      if (total === 0) return 0
      return Math.round((value / total) * 100)
    }

    const clamp = (num: number, min: number, max: number): number => {
      return Math.min(Math.max(num, min), max)
    }

    it('should format numbers with commas', () => {
      expect(formatNumber(1000)).toBe('1,000')
      expect(formatNumber(1234567)).toBe('1,234,567')
    })

    it('should calculate percentage correctly', () => {
      expect(percentage(50, 100)).toBe(50)
      expect(percentage(1, 3)).toBe(33)
      expect(percentage(0, 100)).toBe(0)
    })

    it('should handle division by zero', () => {
      expect(percentage(10, 0)).toBe(0)
    })

    it('should clamp number within range', () => {
      expect(clamp(5, 0, 10)).toBe(5)
      expect(clamp(-5, 0, 10)).toBe(0)
      expect(clamp(15, 0, 10)).toBe(10)
    })
  })

  describe('Date Utilities', () => {
    const formatDate = (date: Date): string => {
      return date.toISOString().split('T')[0]
    }

    const daysBetween = (date1: Date, date2: Date): number => {
      const diffTime = Math.abs(date2.getTime() - date1.getTime())
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }

    const isToday = (date: Date): boolean => {
      const today = new Date()
      return date.getDate() === today.getDate() &&
             date.getMonth() === today.getMonth() &&
             date.getFullYear() === today.getFullYear()
    }

    it('should format date as YYYY-MM-DD', () => {
      const date = new Date('2024-01-15')
      expect(formatDate(date)).toBe('2024-01-15')
    })

    it('should calculate days between dates', () => {
      const date1 = new Date('2024-01-01')
      const date2 = new Date('2024-01-10')
      expect(daysBetween(date1, date2)).toBe(9)
    })

    it('should check if date is today', () => {
      const today = new Date()
      const yesterday = new Date(Date.now() - 86400000)
      
      expect(isToday(today)).toBe(true)
      expect(isToday(yesterday)).toBe(false)
    })
  })

  describe('Object Utilities', () => {
    const omit = <T extends object>(obj: T, keys: (keyof T)[]): Partial<T> => {
      const result = { ...obj }
      keys.forEach(key => delete result[key])
      return result
    }

    const pick = <T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
      const result = {} as Pick<T, K>
      keys.forEach(key => {
        result[key] = obj[key]
      })
      return result
    }

    it('should omit specified keys', () => {
      const obj = { a: 1, b: 2, c: 3 }
      expect(omit(obj, ['b'])).toEqual({ a: 1, c: 3 })
    })

    it('should pick specified keys', () => {
      const obj = { a: 1, b: 2, c: 3 }
      expect(pick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 })
    })
  })

  describe('Async Utilities', () => {
    const sleep = (ms: number): Promise<void> => {
      return new Promise(resolve => setTimeout(resolve, ms))
    }

    const retry = async <T>(
      fn: () => Promise<T>,
      maxAttempts: number = 3,
      delay: number = 1000
    ): Promise<T> => {
      let lastError: Error
      
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          return await fn()
        } catch (error) {
          lastError = error as Error
          if (attempt < maxAttempts) {
            await sleep(delay)
          }
        }
      }
      
      throw lastError!
    }

    it('should wait for specified time', async () => {
      const start = Date.now()
      await sleep(100)
      const elapsed = Date.now() - start
      expect(elapsed).toBeGreaterThanOrEqual(90) // Allow small margin
    })

    it('should retry failed operations', async () => {
      let attempts = 0
      const fn = async () => {
        attempts++
        if (attempts < 3) throw new Error('Failed')
        return 'success'
      }

      const result = await retry(fn, 3, 10)
      expect(result).toBe('success')
      expect(attempts).toBe(3)
    })

    it('should throw after max attempts', async () => {
      const fn = async () => {
        throw new Error('Always fails')
      }

      await expect(retry(fn, 2, 10)).rejects.toThrow('Always fails')
    })
  })

  describe('Random Utilities', () => {
    const randomInt = (min: number, max: number): number => {
      return Math.floor(Math.random() * (max - min + 1)) + min
    }

    const randomChoice = <T>(arr: T[]): T => {
      return arr[Math.floor(Math.random() * arr.length)]
    }

    const shuffle = <T>(arr: T[]): T[] => {
      const shuffled = [...arr]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      return shuffled
    }

    it('should generate random integer in range', () => {
      const num = randomInt(1, 10)
      expect(num).toBeGreaterThanOrEqual(1)
      expect(num).toBeLessThanOrEqual(10)
    })

    it('should pick random element from array', () => {
      const arr = ['a', 'b', 'c']
      const choice = randomChoice(arr)
      expect(arr).toContain(choice)
    })

    it('should shuffle array', () => {
      const arr = [1, 2, 3, 4, 5]
      const shuffled = shuffle(arr)
      expect(shuffled).toHaveLength(5)
      expect(shuffled.sort()).toEqual([1, 2, 3, 4, 5])
    })
  })
})
