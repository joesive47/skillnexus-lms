import { NextResponse } from 'next/server'
import { checkApiHealth } from '@/lib/api-manager'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    const health = await checkApiHealth()
    
    const isHealthy = health.database && health.auth
    
    return NextResponse.json({
      status: isHealthy ? 'healthy' : 'degraded',
      timestamp: health.timestamp,
      services: {
        database: health.database ? 'connected' : 'disconnected',
        redis: health.redis ? 'connected' : 'optional',
        auth: health.auth ? 'active' : 'inactive',
        api: 'running'
      },
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
      }
    }, { 
      status: isHealthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
