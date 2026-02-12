import { NextResponse } from 'next/server'
import { authLogger } from '@/lib/auth-logger'
import { auth } from '@/auth'

// API สำหรับดู Auth Logs (ต้อง login และเป็น ADMIN)
export async function GET() {
  try {
    const session = await auth()

    // ตรวจสอบว่า login และเป็น admin
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const logs = authLogger.getLogs(50) // ดึง 50 logs ล่าสุด

    return NextResponse.json({
      success: true,
      total: logs.length,
      logs: logs.reverse(), // ใหม่สุดขึ้นก่อน
    })
  } catch (error) {
    console.error('Error fetching auth logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch logs' },
      { status: 500 }
    )
  }
}

// API สำหรับล้าง logs
export async function DELETE() {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    authLogger.clear()

    return NextResponse.json({
      success: true,
      message: 'Logs cleared successfully'
    })
  } catch (error) {
    console.error('Error clearing auth logs:', error)
    return NextResponse.json(
      { error: 'Failed to clear logs' },
      { status: 500 }
    )
  }
}
