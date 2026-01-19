import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    let stats = await prisma.visitorStats.findUnique({
      where: { id: 1 }
    })
    
    if (!stats) {
      stats = await prisma.visitorStats.create({
        data: {
          id: 1,
          totalVisitors: 0,
          lastVisit: new Date()
        }
      })
    }
    
    return NextResponse.json({
      success: true,
      totalVisitors: stats.totalVisitors,
      lastVisit: stats.lastVisit
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('[VISITOR API] GET Error:', error)
    return NextResponse.json({ 
      success: false,
      totalVisitors: 0,
      error: String(error)
    })
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
      success: true,
      totalVisitors: stats.totalVisitors,
      lastVisit: stats.lastVisit
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('[VISITOR API] POST Error:', error)
    return NextResponse.json({ 
      success: false,
      totalVisitors: 0,
      error: String(error)
    })
  }
}
