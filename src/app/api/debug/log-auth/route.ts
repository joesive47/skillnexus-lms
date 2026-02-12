import { NextResponse } from 'next/server'
import { authLogger } from '@/lib/auth-logger'

// Public API สำหรับส่ง client-side error logs
// ใช้สำหรับ debugging จาก browser
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, step, message, level = 'error', data } = body

    if (!email || !step || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: email, step, message' },
        { status: 400 }
      )
    }

    // Log client-side error
    authLogger.log(level, `CLIENT_${step}`, message, data, email)

    return NextResponse.json({
      success: true,
      message: 'Log recorded'
    })
  } catch (error) {
    console.error('Error recording client log:', error)
    return NextResponse.json(
      { error: 'Failed to record log' },
      { status: 500 }
    )
  }
}

// GET สำหรับ health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Auth logger is running',
    timestamp: new Date().toISOString()
  })
}
