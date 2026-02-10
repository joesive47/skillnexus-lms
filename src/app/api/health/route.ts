import { NextResponse } from 'next/server'
import { checkDatabaseHealth } from '@/lib/db-health'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    // Check database health first
    const dbHealth = await checkDatabaseHealth()
    
    // If database is available, get additional stats
    let userCount = 0
    if (dbHealth.status === 'healthy' || dbHealth.status === 'degraded') {
      try {
        userCount = await prisma.user.count()
      } catch {
        // Ignore count errors
      }
    }
    
    const response = {
      status: dbHealth.status === 'healthy' ? 'ok' : dbHealth.status === 'degraded' ? 'warning' : 'error',
      app: {
        name: 'upPowerSkill LMS',
        version: '1.0.2',
        environment: process.env.NODE_ENV || 'development',
      },
      database: {
        status: dbHealth.status,
        message: dbHealth.message,
        latency: dbHealth.latency,
        userCount,
      },
      timestamp: new Date().toISOString(),
    }

    const statusCode = dbHealth.status === 'healthy' ? 200 : dbHealth.status === 'degraded' ? 200 : 503

    return NextResponse.json(response, { 
      status: statusCode,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      }
    })
  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Health check failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}