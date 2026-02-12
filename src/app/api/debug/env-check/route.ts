import { NextResponse } from 'next/server'

// API สำหรับตรวจสอบ Environment Variables (Admin only)
export async function GET() {
  try {
    // ตรวจสอบว่ามี DATABASE_URL หรือไม่
    const hasDatabaseUrl = !!process.env.DATABASE_URL
    const hasNextAuthUrl = !!process.env.NEXTAUTH_URL
    const hasAuthUrl = !!process.env.AUTH_URL
    const hasNextAuthSecret = !!process.env.NEXTAUTH_SECRET
    const hasAuthSecret = !!process.env.AUTH_SECRET
    
    // Mask DATABASE_URL เพื่อความปลอดภัย (แสดงแค่ต้นและท้าย)
    let maskedDbUrl = 'NOT_SET'
    if (process.env.DATABASE_URL) {
      const url = process.env.DATABASE_URL
      if (url.length > 50) {
        maskedDbUrl = url.slice(0, 20) + '...' + url.slice(-20)
      } else {
        maskedDbUrl = url.slice(0, 10) + '...' + url.slice(-10)
      }
    }

    const info = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      checks: {
        DATABASE_URL: hasDatabaseUrl,
        NEXTAUTH_URL: hasNextAuthUrl,
        AUTH_URL: hasAuthUrl,
        NEXTAUTH_SECRET: hasNextAuthSecret,
        AUTH_SECRET: hasAuthSecret,
      },
      values: {
        DATABASE_URL: maskedDbUrl,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NOT_SET',
        AUTH_URL: process.env.AUTH_URL || 'NOT_SET',
        NODE_ENV: process.env.NODE_ENV || 'NOT_SET',
        NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL || 'NOT_SET',
        VERCEL_ENV: process.env.VERCEL_ENV || 'NOT_SET',
        VERCEL_URL: process.env.VERCEL_URL || 'NOT_SET',
      },
      warnings: [] as string[],
    }

    // ตรวจสอบและเพิ่ม warnings
    if (!hasDatabaseUrl) info.warnings.push('DATABASE_URL is not set!')
    if (!hasNextAuthUrl) info.warnings.push('NEXTAUTH_URL is not set!')
    if (!hasAuthUrl) info.warnings.push('AUTH_URL is not set!')
    if (!hasNextAuthSecret) info.warnings.push('NEXTAUTH_SECRET is not set!')
    if (!hasAuthSecret) info.warnings.push('AUTH_SECRET is not set!')
    
    // ตรวจสอบว่า DATABASE_URL เป็น localhost หรือไม่
    if (process.env.DATABASE_URL?.includes('localhost') || 
        process.env.DATABASE_URL?.includes('postgres:5432')) {
      info.warnings.push('DATABASE_URL appears to be localhost/docker - should be production URL!')
    }

    // ตรวจสอบว่า NEXTAUTH_URL เป็น localhost หรือไม่
    if (process.env.NEXTAUTH_URL?.includes('localhost')) {
      info.warnings.push('NEXTAUTH_URL is localhost - should be production domain!')
    }

    return NextResponse.json(info)
  } catch (error) {
    console.error('Error checking environment:', error)
    return NextResponse.json(
      { 
        error: 'Failed to check environment',
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
