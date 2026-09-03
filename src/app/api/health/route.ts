import { NextResponse } from 'next/server'
import { checkDatabaseHealth } from '@/lib/db-health'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    // Check database health first
    const dbHealth = await checkDatabaseHealth()
    
    const response = {
      status: dbHealth.status === 'healthy' ? 'ok' : dbHealth.status === 'degraded' ? 'warning' : 'error',
      app: {
        name: 'upPowerSkill LMS',
        version: '1.0.2',
        environment: process.env.NODE_ENV || 'development',
      },
      database: {
        status: dbHealth.status,
        latency: dbHealth.latency,
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
      requestId: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
