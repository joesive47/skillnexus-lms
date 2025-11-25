/**
 * Data Validator - ป้องกันปัญหา map error และ data type issues
 */

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  data: any
}

export class DataValidator {
  static validateArray(data: any, fieldName: string = 'data'): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      data: []
    }

    // Handle null/undefined
    if (data == null) {
      result.warnings.push(`${fieldName} is null/undefined, returning empty array`)
      result.data = []
      return result
    }

    // Handle arrays
    if (Array.isArray(data)) {
      result.data = data
      return result
    }

    // Handle array-like objects
    if (typeof data === 'object' && 'length' in data && typeof data.length === 'number') {
      try {
        result.data = Array.from(data)
        result.warnings.push(`${fieldName} converted from array-like object to array`)
        return result
      } catch (error) {
        result.errors.push(`Failed to convert ${fieldName} from array-like object: ${error}`)
        result.isValid = false
        result.data = []
        return result
      }
    }

    // Handle objects (convert to array of values or entries)
    if (typeof data === 'object') {
      result.warnings.push(`${fieldName} is object, converted to empty array`)
      result.data = []
      return result
    }

    // Handle primitives
    result.warnings.push(`${fieldName} is primitive (${typeof data}), wrapped in array`)
    result.data = [data]
    return result
  }

  static safeArrayOperation<T, R>(
    data: any,
    operation: 'map' | 'filter' | 'forEach' | 'find' | 'some' | 'every',
    callback: (item: T, index: number, array: T[]) => any,
    fieldName: string = 'data'
  ): R[] | T[] | R | boolean | void {
    const validation = this.validateArray(data, fieldName)
    
    // Log warnings if any
    if (validation.warnings.length > 0) {
      console.warn(`DataValidator warnings for ${fieldName}:`, validation.warnings)
    }

    // Handle errors
    if (!validation.isValid) {
      console.error(`DataValidator errors for ${fieldName}:`, validation.errors)
      
      switch (operation) {
        case 'map':
          return [] as R[]
        case 'filter':
          return [] as T[]
        case 'find':
          return undefined as R
        case 'some':
          return false
        case 'every':
          return true
        case 'forEach':
          return undefined
        default:
          return [] as R[]
      }
    }

    const safeArray = validation.data as T[]

    try {
      switch (operation) {
        case 'map':
          return safeArray.map(callback as (item: T, index: number, array: T[]) => R) as R[]
        case 'filter':
          return safeArray.filter(callback as (item: T, index: number, array: T[]) => boolean) as T[]
        case 'forEach':
          return safeArray.forEach(callback as (item: T, index: number, array: T[]) => void)
        case 'find':
          return safeArray.find(callback as (item: T, index: number, array: T[]) => boolean) as R
        case 'some':
          return safeArray.some(callback as (item: T, index: number, array: T[]) => boolean)
        case 'every':
          return safeArray.every(callback as (item: T, index: number, array: T[]) => boolean)
        default:
          throw new Error(`Unsupported operation: ${operation}`)
      }
    } catch (error) {
      console.error(`DataValidator operation ${operation} failed for ${fieldName}:`, error)
      
      switch (operation) {
        case 'map':
          return [] as R[]
        case 'filter':
          return [] as T[]
        case 'find':
          return undefined as R
        case 'some':
          return false
        case 'every':
          return true
        case 'forEach':
          return undefined
        default:
          return [] as R[]
      }
    }
  }

  // Convenience methods
  static safeMap<T, R>(data: any, callback: (item: T, index: number, array: T[]) => R, fieldName?: string): R[] {
    return this.safeArrayOperation<T, R>(data, 'map', callback, fieldName) as R[]
  }

  static safeFilter<T>(data: any, callback: (item: T, index: number, array: T[]) => boolean, fieldName?: string): T[] {
    return this.safeArrayOperation<T, never>(data, 'filter', callback, fieldName) as T[]
  }

  static safeForEach<T>(data: any, callback: (item: T, index: number, array: T[]) => void, fieldName?: string): void {
    this.safeArrayOperation<T, void>(data, 'forEach', callback, fieldName)
  }

  static safeFind<T>(data: any, callback: (item: T, index: number, array: T[]) => boolean, fieldName?: string): T | undefined {
    return this.safeArrayOperation<T, T>(data, 'find', callback, fieldName) as T | undefined
  }

  static safeSome<T>(data: any, callback: (item: T, index: number, array: T[]) => boolean, fieldName?: string): boolean {
    return this.safeArrayOperation<T, boolean>(data, 'some', callback, fieldName) as boolean
  }

  static safeEvery<T>(data: any, callback: (item: T, index: number, array: T[]) => boolean, fieldName?: string): boolean {
    return this.safeArrayOperation<T, boolean>(data, 'every', callback, fieldName) as boolean
  }

  // Validate API response data
  static validateApiResponse(response: any): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      data: response
    }

    if (!response) {
      result.errors.push('API response is null/undefined')
      result.isValid = false
      return result
    }

    // Check for common API response patterns
    if (response.data !== undefined) {
      const arrayValidation = this.validateArray(response.data, 'response.data')
      result.warnings.push(...arrayValidation.warnings)
      result.errors.push(...arrayValidation.errors)
      if (!arrayValidation.isValid) {
        result.isValid = false
      }
    }

    if (response.items !== undefined) {
      const arrayValidation = this.validateArray(response.items, 'response.items')
      result.warnings.push(...arrayValidation.warnings)
      result.errors.push(...arrayValidation.errors)
      if (!arrayValidation.isValid) {
        result.isValid = false
      }
    }

    return result
  }
}

// Export convenience functions for backward compatibility
export const safeMap = DataValidator.safeMap
export const safeFilter = DataValidator.safeFilter
export const safeForEach = DataValidator.safeForEach
export const safeFind = DataValidator.safeFind
export const safeSome = DataValidator.safeSome
export const safeEvery = DataValidator.safeEvery
export const validateArray = DataValidator.validateArray
export const validateApiResponse = DataValidator.validateApiResponse