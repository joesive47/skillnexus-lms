import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const [users, certs, courseCerts] = await Promise.all([
      prisma.user.count().catch(() => 0),
      prisma.certificate.count().catch(() => 0),
      prisma.courseCertificate.count().catch(() => 0)
    ])

    let analytics = 0
    try {
      analytics = await prisma.analytics.count({ where: { event: 'page_view' } })
    } catch {
      analytics = 0
    }

    const totalCerts = certs + courseCerts
    const visitors = analytics > 0 ? analytics : users * 3

    const result = {
      visitors,
      members: users,
      certificates: totalCerts
    }

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'CDN-Cache-Control': 'no-store',
        'Vercel-CDN-Cache-Control': 'no-store'
      }
    })
  } catch (error) {
    console.error('[STATS] Error:', error)
    return NextResponse.json({ visitors: 0, members: 0, certificates: 0 })
  }
}

export async function POST() {
  try {
    await prisma.analytics.create({
      data: {
        event: 'page_view',
        page: '/',
        timestamp: new Date()
      }
    })
    
    const count = await prisma.analytics.count({ where: { event: 'page_view' } })
    
    return NextResponse.json({ 
      success: true, 
      visitors: count 
    })
  } catch (error) {
    console.error('[STATS] Track error:', error)
    return NextResponse.json({ success: false, error: String(error) })
  }
}
