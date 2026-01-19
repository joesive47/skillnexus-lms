import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const [totalUsers, totalCertificates, visitorStats] = await Promise.all([
      prisma.user.count(),
      prisma.certificate.count(),
      prisma.visitorStats.findUnique({ where: { id: 1 } })
    ])

    return NextResponse.json({
      visitors: visitorStats?.totalVisitors || 0,
      members: totalUsers,
      certificates: totalCertificates
    })
  } catch (error) {
    return NextResponse.json({
      visitors: 0,
      members: 0,
      certificates: 0
    })
  }
}

export async function POST() {
  try {
    console.log('[STATS API] POST - Tracking visitor')
    
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

    console.log('[STATS API] Updated:', stats)
    return NextResponse.json({ 
      success: true, 
      visitors: stats.totalVisitors 
    }, {
      headers: {
        'Cache-Control': 'no-store'
      }
    })
  } catch (error) {
    console.error('[STATS API] POST Error:', error)
    return NextResponse.json({ 
      success: false, 
      visitors: 0,
      error: String(error)
    })
  }
}
