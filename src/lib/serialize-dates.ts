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

  // Handle objects (including Prisma objects)
  if (typeof obj === 'object') {
    const serialized: any = {}
    for (const key in obj) {
      // Skip prototype properties and internal properties
      if (key.startsWith('_') || key.startsWith('$')) {
        continue
      }
      try {
        const value = (obj as any)[key]
        serialized[key] = serializeDates(value)
      } catch (error) {
        // Skip properties that can't be serialized
        console.warn(`Failed to serialize property: ${key}`, error)
      }
    }
    return serialized
  }

  // Return primitives and other types as-is
  return obj
}
