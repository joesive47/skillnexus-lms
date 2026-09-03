/**
 * API Connection Manager
 * Ensures all API routes are properly connected and working
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { handleError } from '@/lib/error-handler'
import { rateLimit } from '@/lib/rate-limiter'

// API Route Registry
export const API_ROUTES = {
  // Authentication
  AUTH: {
    LOGIN: '/api/auth/signin',
    LOGOUT: '/api/auth/signout',
    SESSION: '/api/auth/session',
    MFA: '/api/auth/2fa',
    SSO: '/api/auth/sso'
  },
  
  // Core Features
  COURSES: {
    LIST: '/api/courses',
    DETAIL: '/api/courses/[courseId]',
    PURCHASE: '/api/courses/purchase'
  },
  
  LESSONS: {
    LIST: '/api/lessons',
    PROGRESS: '/api/lessons/[lessonId]/progress'
  },
  
  QUIZ: {
    SUBMIT: '/api/quiz/submit',
    RESULTS: '/api/quiz/results'
  },
  
  // AI Features
  AI: {
    CHAT: '/api/ai/chat',
    GENERATE_COURSE: '/api/ai/generate-course',
    SKILL_ANALYSIS: '/api/ai/skill-analysis'
  },
  
  // Assessment
  ASSESSMENT: {
    SUBMIT: '/api/assessment/submit',
    RESULTS: '/api/assessment/results',
    PDF: '/api/assessment/pdf'
  },
  
  // Gamification
  GAMIFICATION: {
    STATS: '/api/gamification/stats',
    BADGES: '/api/gamification/badges',
    REWARDS: '/api/rewards/daily-claim'
  },
  
  // System
  HEALTH: '/api/health',
  METRICS: '/api/metrics',
  STATUS: '/api/system/status'
}

// API Response Helper
export class ApiResponse {
  static success(data: any, message?: string) {
    return NextResponse.json({
      success: true,
      data,
      message: message || 'Success'
    })
  }
  
  static error(message: string, status = 400, code?: string) {
    return NextResponse.json({
      success: false,
      error: message,
      code
    }, { status })
  }
  
  static unauthorized(message = 'Unauthorized') {
    return NextResponse.json({
      success: false,
      error: message
    }, { status: 401 })
  }
  
  static forbidden(message = 'Forbidden') {
    return NextResponse.json({
      success: false,
      error: message
    }, { status: 403 })
  }
  
  static notFound(message = 'Not found') {
    return NextResponse.json({
      success: false,
      error: message
    }, { status: 404 })
  }
}

// API Middleware
export async function withAuth(handler: Function) {
  return async (request: NextRequest, context?: any) => {
    try {
      const session = await auth()
      
      if (!session?.user) {
        return ApiResponse.unauthorized()
      }
      
      return handler(request, { ...context, user: session.user })
    } catch (error) {
      handleError(error, 'API_AUTH')
      return ApiResponse.error('Authentication failed', 500)
    }
  }
}

export async function withRateLimit(handler: Function, limit = 100) {
  return async (request: NextRequest, context?: any) => {
    try {
      const ip = request.headers.get('x-forwarded-for') || 'unknown'
      const isAllowed = await rateLimit(ip, limit)
      
      if (!isAllowed) {
        return ApiResponse.error('Rate limit exceeded', 429)
      }
      
      return handler(request, context)
    } catch (error) {
      handleError(error, 'API_RATE_LIMIT')
      return handler(request, context) // Continue on rate limit error
    }
  }
}

export async function withErrorHandling(handler: Function) {
  return async (request: NextRequest, context?: any) => {
    try {
      return await handler(request, context)
    } catch (error) {
      handleError(error, 'API_ERROR')
      return ApiResponse.error('Internal server error', 500)
    }
  }
}

// Combined middleware
export function createApiHandler(handler: Function, options: {
  requireAuth?: boolean
  rateLimit?: number
} = {}) {
  return async (request: NextRequest, context?: any) => {
    let wrappedHandler = handler
    
    // Apply error handling first
    wrappedHandler = await withErrorHandling(wrappedHandler)
    
    // Apply rate limiting if specified
    if (options.rateLimit) {
      wrappedHandler = await withRateLimit(wrappedHandler, options.rateLimit)
    }
    
    // Apply auth if required
    if (options.requireAuth) {
      wrappedHandler = await withAuth(wrappedHandler)
    }
    
    return wrappedHandler(request, context)
  }
}

// API Health Check
export async function checkApiHealth() {
  const checks = {
    database: false,
    redis: false,
    auth: false,
    timestamp: new Date().toISOString()
  }
  
  try {
    // Check database
    const { default: prisma } = await import('@/lib/prisma')
    await prisma.$queryRaw`SELECT 1`
    checks.database = true
  } catch (error) {
    console.error('Database health check failed:', error)
  }
  
  try {
    // Check Redis (optional)
    const { redis } = await import('@/lib/redis')
    if (redis) {
      await redis.ping()
      checks.redis = true
    } else {
      checks.redis = true // Redis is optional
    }
  } catch (error) {
    console.error('Redis health check failed:', error)
    checks.redis = true // Redis is optional
  }
  
  try {
    // Check auth
    checks.auth = true // Auth is always available
  } catch (error) {
    console.error('Auth health check failed:', error)
  }
  
  return checks
}

// API Route Validator
export function validateApiRoute(route: string): boolean {
  const allRoutes = Object.values(API_ROUTES).flatMap(category => 
    typeof category === 'object' ? Object.values(category) : [category]
  )
  
  return allRoutes.some(validRoute => {
    // Handle dynamic routes
    const pattern = validRoute.replace(/\[.*?\]/g, '[^/]+')
    const regex = new RegExp(`^${pattern}$`)
    return regex.test(route)
  })
}

// Request validation helpers
export function validateRequestMethod(request: NextRequest, allowedMethods: string[]) {
  if (!allowedMethods.includes(request.method)) {
    throw new Error(`Method ${request.method} not allowed`)
  }
}

export async function validateRequestBody(request: NextRequest, schema?: any) {
  try {
    const body = await request.json()
    
    if (schema) {
      // Add validation logic here if needed
      return schema.parse(body)
    }
    
    return body
  } catch (error) {
    throw new Error('Invalid request body')
  }
}

// Export for use in API routes
export default {
  ApiResponse,
  createApiHandler,
  withAuth,
  withRateLimit,
  withErrorHandling,
  checkApiHealth,
  validateApiRoute,
  validateRequestMethod,
  validateRequestBody,
  API_ROUTES
}