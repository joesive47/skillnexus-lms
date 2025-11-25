import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const [totalCourses, totalUsers, totalEnrollments] = await Promise.all([
      prisma.course.count({ where: { published: true } }),
      prisma.user.count(),
      prisma.enrollment.count()
    ])

    return NextResponse.json({
      totalCourses,
      totalUsers,
      totalEnrollments
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
