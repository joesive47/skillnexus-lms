/**
 * Utility functions to safely handle arrays and prevent "map is not a function" errors
 */

export function safeArray<T>(value: any): T[] {
  // Handle various types that might be passed
  if (Array.isArray(value)) {
    return value
  }
  
  // Handle null, undefined, or other falsy values
  if (!value) {
    return []
  }
  
  // Handle objects that might have array-like properties
  if (typeof value === 'object') {
    // Check if it's an array-like object
    if (value.length !== undefined && typeof value.length === 'number') {
      return Array.from(value)
    }
    
    // If it's an object, return empty array
    return []
  }
  
  // For primitive values, return empty array
  return []
}

export function safeMap<T, R>(
  array: any, 
  callback: (item: T, index: number, array: T[]) => R
): R[] {
  try {
    const safeArr = safeArray<T>(array)
    return safeArr.map(callback)
  } catch (error) {
    console.warn('safeMap error:', error)
    return []
  }
}

export function safeFilter<T>(
  array: any,
  callback: (item: T, index: number, array: T[]) => boolean
): T[] {
  try {
    const safeArr = safeArray<T>(array)
    return safeArr.filter(callback)
  } catch (error) {
    console.warn('safeFilter error:', error)
    return []
  }
}

export function safeFlatMap<T, R>(
  array: any,
  callback: (item: T, index: number, array: T[]) => R[]
): R[] {
  try {
    const safeArr = safeArray<T>(array)
    return safeArr.flatMap(callback)
  } catch (error) {
    console.warn('safeFlatMap error:', error)
    return []
  }
}

// Additional utility to check if something can be safely mapped
export function canMap(value: any): boolean {
  return Array.isArray(value) || (value && typeof value.map === 'function')
}

// Safe forEach function
export function safeForEach<T>(
  array: any,
  callback: (item: T, index: number, array: T[]) => void
): void {
  try {
    const safeArr = safeArray<T>(array)
    safeArr.forEach(callback)
  } catch (error) {
    console.warn('safeForEach error:', error)
  }
}