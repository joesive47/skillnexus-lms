import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    const userCount = await prisma.user.count()
    const visitorCount = Math.floor(userCount * 3.5)
    
    await prisma.analytics.deleteMany({
      where: { event: 'page_view' }
    })

    const now = new Date()
    const analytics = []
    
    for (let i = 0; i < visitorCount; i++) {
      const daysAgo = Math.floor(Math.random() * 30)
      const timestamp = new Date(now)
      timestamp.setDate(timestamp.getDate() - daysAgo)
      
      analytics.push({
        event: 'page_view',
        page: '/',
        timestamp,
        createdAt: timestamp
      })
    }

    await prisma.analytics.createMany({
      data: analytics
    })

    const stats = {
      visitors: await prisma.analytics.count({ where: { event: 'page_view' } }),
      members: await prisma.user.count(),
      certificates: await prisma.certificate.count() + await prisma.courseCertificate.count()
    }

    return NextResponse.json({ 
      success: true, 
      message: `Created ${visitorCount} visitor records`,
      stats 
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: String(error) 
    }, { status: 500 })
  }
}
