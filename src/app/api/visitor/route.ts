import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const stats = await prisma.visitorStats.findUnique({
      where: { id: 1 }
    })
    
    return NextResponse.json({
      totalVisitors: stats?.totalVisitors || 0,
      lastVisit: stats?.lastVisit
    })
  } catch (error) {
    console.error('Error fetching visitor stats:', error)
    return NextResponse.json({ totalVisitors: 0 }, { status: 500 })
  }
}

export async function POST() {
  try {
    const stats = await prisma.visitorStats.upsert({
      where: { id: 1 },
      update: {
        totalVisitors: { increment: 1 },
        lastVisit: new Date()
      },
      create: {
        id: 1,
        totalVisitors: 1,
        lastVisit: new Date()
      }
    })
    
    return NextResponse.json({
      totalVisitors: stats.totalVisitors,
      lastVisit: stats.lastVisit
    })
  } catch (error) {
    console.error('Error updating visitor stats:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}
