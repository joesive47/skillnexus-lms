import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    console.log('[STATS] Fetching...')
    
    const [users, certs, visits] = await Promise.all([
      prisma.user.count(),
      prisma.certificate.count(),
      prisma.analytics.count({ where: { event: 'page_view' } })
    ])

    const result = {
      visitors: visits,
      members: users,
      certificates: certs
    }
    
    console.log('[STATS] Result:', result)

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
    console.log('[STATS] Tracking visit...')
    
    await prisma.analytics.create({
      data: {
        event: 'page_view',
        page: '/',
        timestamp: new Date()
      }
    })
    
    const count = await prisma.analytics.count({ where: { event: 'page_view' } })
    
    console.log('[STATS] Tracked! Total:', count)
    
    return NextResponse.json({ 
      success: true, 
      visitors: count 
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    })
  } catch (error) {
    console.error('[STATS] Track error:', error)
    return NextResponse.json({ success: false, error: String(error) })
  }
}
