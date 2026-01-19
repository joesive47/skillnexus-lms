import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const [users, certs, visits] = await Promise.all([
      prisma.user.count(),
      prisma.certificate.count(),
      prisma.analytics.count({ where: { event: 'page_view' } })
    ])

    return NextResponse.json({
      visitors: visits,
      members: users,
      certificates: certs
    })
  } catch (error) {
    console.error('Stats error:', error)
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
    return NextResponse.json({ success: true, visitors: count })
  } catch (error) {
    console.error('Track error:', error)
    return NextResponse.json({ success: false })
  }
}
