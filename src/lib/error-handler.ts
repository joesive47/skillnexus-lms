/**
 * Centralized Error Handler
 * Handles and logs errors consistently across the application
 */

export interface ErrorContext {
  userId?: string
  action?: string
  metadata?: Record<string, any>
}

export class AppError extends Error {
  public readonly statusCode: number
  public readonly isOperational: boolean
  public readonly context?: ErrorContext

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    context?: ErrorContext
  ) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational
    this.context = context

    Error.captureStackTrace(this, this.constructor)
  }
}

export function handleError(
  error: unknown,
  context: string = 'UNKNOWN',
  additionalContext?: ErrorContext
): void {
  const timestamp = new Date().toISOString()
  const errorId = Math.random().toString(36).substring(7)

  let errorMessage: string
  let statusCode: number = 500
  let stack: string | undefined

  if (error instanceof AppError) {
    errorMessage = error.message
    statusCode = error.statusCode
    stack = error.stack
  } else if (error instanceof Error) {
    errorMessage = error.message
    stack = error.stack
  } else {
    errorMessage = String(error)
  }

  // Log error
  console.error(`[ERROR:${errorId}] ${context}:`, {
    timestamp,
    message: errorMessage,
    statusCode,
    context: additionalContext,
    stack: process.env.NODE_ENV === 'development' ? stack : undefined
  })

  // In production, you might want to send to external logging service
  if (process.env.NODE_ENV === 'production') {
    // Send to logging service (Sentry, LogRocket, etc.)
  }
}

export function createError(
  message: string,
  statusCode: number = 500,
  context?: ErrorContext
): AppError {
  return new AppError(message, statusCode, true, context)
}

// Common error types
export const ErrorTypes = {
  VALIDATION_ERROR: (message: string) => createError(message, 400),
  UNAUTHORIZED: (message: string = 'Unauthorized') => createError(message, 401),
  FORBIDDEN: (message: string = 'Forbidden') => createError(message, 403),
  NOT_FOUND: (message: string = 'Not found') => createError(message, 404),
  CONFLICT: (message: string) => createError(message, 409),
  RATE_LIMITED: (message: string = 'Rate limit exceeded') => createError(message, 429),
  INTERNAL_ERROR: (message: string = 'Internal server error') => createError(message, 500),
  SERVICE_UNAVAILABLE: (message: string = 'Service unavailable') => createError(message, 503),
}

export default {
  handleError,
  createError,
  AppError,
  ErrorTypes
}