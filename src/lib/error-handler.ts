export class SystemError extends Error {
  constructor(message: string, public code: string, public statusCode: number = 500) {
    super(message)
    this.name = 'SystemError'
  }
}

export function handleError(error: unknown, context?: string): void {
  const timestamp = new Date().toISOString()
  const errorMessage = error instanceof Error ? error.message : 'Unknown error'
  
  console.error(`[${timestamp}] ${context || 'SYSTEM'} ERROR:`, {
    message: errorMessage,
    stack: error instanceof Error ? error.stack : undefined,
    context
  })
  
  // ส่งไป monitoring service ในอนาคต
  if (process.env.NODE_ENV === 'production') {
    // TODO: Send to Sentry or other monitoring service
  }
}

export function safeAsync<T>(
  operation: () => Promise<T>,
  fallback: T,
  context?: string
): Promise<T> {
  return operation().catch((error) => {
    handleError(error, context)
    return fallback
  })
}

export function safeSync<T>(
  operation: () => T,
  fallback: T,
  context?: string
): T {
  try {
    return operation()
  } catch (error) {
    handleError(error, context)
    return fallback
  }
}