/**
 * Array polyfill to prevent "map is not a function" errors
 */

export function initArrayPolyfill() {
  if (typeof window === 'undefined') return

  // Add a global safety check for map operations
  const originalMap = Array.prototype.map
  
  // Override Array.prototype.map to add safety checks
  Array.prototype.map = function<T, U>(
    this: T[],
    callbackfn: (value: T, index: number, array: T[]) => U,
    thisArg?: any
  ): U[] {
    try {
      // Ensure this is actually an array
      if (!Array.isArray(this)) {
        console.warn('map called on non-array:', this)
        return []
      }
      
      return originalMap.call(this, callbackfn, thisArg) as U[]
    } catch (error) {
      console.error('Map operation failed:', error)
      return []
    }
  }

  // Add safety to other array methods that might fail
  const originalFilter = Array.prototype.filter
  Array.prototype.filter = function<T>(
    this: T[],
    predicate: (value: T, index: number, array: T[]) => unknown,
    thisArg?: any
  ): T[] {
    try {
      if (!Array.isArray(this)) {
        console.warn('filter called on non-array:', this)
        return []
      }
      return originalFilter.call(this, predicate, thisArg)
    } catch (error) {
      console.error('Filter operation failed:', error)
      return []
    }
  }

  const originalForEach = Array.prototype.forEach
  Array.prototype.forEach = function<T>(
    this: T[],
    callbackfn: (value: T, index: number, array: T[]) => void,
    thisArg?: any
  ): void {
    try {
      if (!Array.isArray(this)) {
        console.warn('forEach called on non-array:', this)
        return
      }
      return originalForEach.call(this, callbackfn, thisArg)
    } catch (error) {
      console.error('ForEach operation failed:', error)
    }
  }

  console.log('🛡️ Array polyfill initialized for safety')
}