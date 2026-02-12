import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// API สำหรับทดสอบ Database Connection
export async function GET() {
  const startTime = Date.now()
  
  try {
    console.log('[DB TEST] Testing database connection...')
    
    // Test 1: Simple query
    console.log('[DB TEST] Running SELECT 1...')
    const test1Start = Date.now()
    await prisma.$queryRaw`SELECT 1 as result`
    const test1Time = Date.now() - test1Start
    console.log(`[DB TEST] SELECT 1 completed in ${test1Time}ms`)
    
    // Test 2: Count users
    console.log('[DB TEST] Counting users...')
    const test2Start = Date.now()
    const userCount = await prisma.user.count()
    const test2Time = Date.now() - test2Start
    console.log(`[DB TEST] User count completed in ${test2Time}ms - Found ${userCount} users`)
    
    // Test 3: Find first user
    console.log('[DB TEST] Finding first user...')
    const test3Start = Date.now()
    const firstUser = await prisma.user.findFirst({
      select: { id: true, email: true, role: true }
    })
    const test3Time = Date.now() - test3Start
    console.log(`[DB TEST] Find first user completed in ${test3Time}ms`)
    
    const totalTime = Date.now() - startTime
    console.log(`[DB TEST] All tests completed in ${totalTime}ms`)
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      tests: {
        selectOne: { time: test1Time, status: 'ok' },
        countUsers: { time: test2Time, status: 'ok', count: userCount },
        findFirstUser: { time: test3Time, status: 'ok', found: !!firstUser },
      },
      totalTime,
      firstUser: firstUser ? {
        id: firstUser.id.slice(0, 8) + '...',
        email: firstUser.email,
        role: firstUser.role,
      } : null,
    })
  } catch (error) {
    const totalTime = Date.now() - startTime
    console.error(`[DB TEST] Database test failed after ${totalTime}ms:`, error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Database connection failed',
        message: error instanceof Error ? error.message : String(error),
        code: (error as any)?.code,
        totalTime,
      },
      { status: 500 }
    )
  }
}
