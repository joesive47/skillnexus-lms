import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    // Initialize if not exists
    const existing = await prisma.visitorStats.findUnique({ where: { id: 1 } })
    
    if (!existing) {
      const result = await prisma.visitorStats.create({
        data: { id: 1, totalVisitors: 1, lastVisit: new Date() }
      })
      return NextResponse.json({ count: result.totalVisitors })
    }
    
    // Increment visitor count
    const result = await prisma.visitorStats.update({
      where: { id: 1 },
      data: {
        totalVisitors: { increment: 1 },
        lastVisit: new Date(),
      },
    })

    return NextResponse.json({ count: result.totalVisitors })
  } catch (error) {
    console.error('Visitor POST error:', error)
    return NextResponse.json({ count: 0 })
  }
}

export async function GET() {
  try {
    const stats = await prisma.visitorStats.findUnique({ where: { id: 1 } })
    return NextResponse.json({ count: stats?.totalVisitors || 0 })
  } catch (error) {
    console.error('Visitor GET error:', error)
    return NextResponse.json({ count: 0 })
  }
}
