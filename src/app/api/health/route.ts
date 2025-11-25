import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { handleError } from '@/lib/error-handler'

interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded'
  timestamp: string
  services: {
    database: 'connected' | 'disconnected' | 'slow'
    memory: 'normal' | 'high' | 'critical'
    uptime: number
  }
  version: string
}

export async function GET() {
  const startTime = Date.now()
  let status: HealthStatus['status'] = 'healthy'
  
  // ตรวจสอบ Database
  let dbStatus: HealthStatus['services']['database'] = 'disconnected'
  try {
    const dbStart = Date.now()
    await prisma.$queryRaw`SELECT 1`
    const dbTime = Date.now() - dbStart
    
    if (dbTime < 100) {
      dbStatus = 'connected'
    } else if (dbTime < 1000) {
      dbStatus = 'slow'
      status = 'degraded'
    } else {
      dbStatus = 'disconnected'
      status = 'unhealthy'
    }
  } catch (error) {
    handleError(error, 'HEALTH_CHECK_DB')
    dbStatus = 'disconnected'
    status = 'unhealthy'
  }

  // ตรวจสอบ Memory
  const memUsage = process.memoryUsage()
  const memUsedMB = memUsage.heapUsed / 1024 / 1024
  let memStatus: HealthStatus['services']['memory'] = 'normal'
  
  if (memUsedMB > 500) {
    memStatus = 'critical'
    status = 'unhealthy'
  } else if (memUsedMB > 200) {
    memStatus = 'high'
    if (status === 'healthy') status = 'degraded'
  }

  const healthData: HealthStatus = {
    status,
    timestamp: new Date().toISOString(),
    services: {
      database: dbStatus,
      memory: memStatus,
      uptime: process.uptime()
    },
    version: process.env.npm_package_version || '1.0.0'
  }

  const responseTime = Date.now() - startTime
  
  return NextResponse.json(healthData, {
    status: status === 'healthy' ? 200 : status === 'degraded' ? 200 : 503,
    headers: {
      'X-Response-Time': `${responseTime}ms`,
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  })
}