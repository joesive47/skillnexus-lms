import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    console.log('[VISITOR API] GET request received')
    const stats = await prisma.visitorStats.findUnique({
      where: { id: 1 }
    })
    console.log('[VISITOR API] Current stats:', stats)
    
    return NextResponse.json({
      totalVisitors: stats?.totalVisitors || 0,
      lastVisit: stats?.lastVisit
    })
  } catch (error) {
    console.error('[VISITOR API] Error fetching:', error)
    return NextResponse.json({ totalVisitors: 0 }, { status: 200 })
  }
}

export async function POST() {
  try {
    console.log('[VISITOR API] POST request - incrementing visitor')
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
    
    console.log('[VISITOR API] Updated stats:', stats)
    return NextResponse.json({
      totalVisitors: stats.totalVisitors,
      lastVisit: stats.lastVisit
    })
  } catch (error) {
    console.error('[VISITOR API] Error updating:', error)
    return NextResponse.json({ totalVisitors: 0, error: String(error) }, { status: 200 })
  }
}
