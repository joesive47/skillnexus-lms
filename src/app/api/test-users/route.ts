import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: users,
      count: users.length,
      message: 'ข้อมูล users ทั้งหมด (รวม password hash)'
    })
  } catch (error) {
    console.error('Error fetching test users:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch test users' },
      { status: 500 }
    )
  }
}