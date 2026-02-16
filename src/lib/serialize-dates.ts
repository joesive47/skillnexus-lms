/**
 * Deep serialize all Date objects to ISO strings
 * Prevents Server Component serialization errors in Next.js
 */
export function serializeDates<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj
  }

  // Handle Date objects
  if (obj instanceof Date) {
    return obj.toISOString() as any
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => serializeDates(item)) as any
  }

  // Handle plain objects
  if (typeof obj === 'object' && obj.constructor === Object) {
    const serialized: any = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        serialized[key] = serializeDates(obj[key])
      }
    }
    return serialized
  }

  // Return primitives and other types as-is
  return obj
}
