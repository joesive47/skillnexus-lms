import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    console.log('[DEBUG] Checking system status...')
    
    // ตรวจสอบการเชื่อมต่อฐานข้อมูล
    let database = false
    let users = 0
    let courses = 0
    let lessons = 0
    let error = ''

    try {
      await prisma.$queryRaw`SELECT 1`
      database = true
      
      // นับจำนวนข้อมูล
      users = await prisma.user.count()
      courses = await prisma.course.count()
      lessons = await prisma.lesson.count()
      
      console.log('[DEBUG] Database stats:', { users, courses, lessons })
    } catch (dbError) {
      console.error('[DEBUG] Database error:', dbError)
      error = 'ไม่สามารถเชื่อมต่อฐานข้อมูลได้'
    }

    // ตรวจสอบ Auth (ตรวจสอบว่ามี environment variables ครบหรือไม่)
    const auth = !!(process.env.AUTH_SECRET && process.env.NEXTAUTH_URL)

    const status = {
      database,
      auth,
      users,
      courses,
      lessons,
      error: error || undefined,
      timestamp: new Date().toISOString()
    }

    console.log('[DEBUG] System status:', status)
    
    return NextResponse.json(status)
  } catch (error) {
    console.error('[DEBUG] System check error:', error)
    return NextResponse.json({
      database: false,
      auth: false,
      users: 0,
      courses: 0,
      lessons: 0,
      error: 'เกิดข้อผิดพลาดในการตรวจสอบระบบ'
    }, { status: 500 })
  }
}