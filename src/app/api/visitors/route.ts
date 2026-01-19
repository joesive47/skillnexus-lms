import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    const result = await prisma.visitorStats.upsert({
      where: { id: 1 },
      update: {
        totalVisitors: { increment: 1 },
        lastVisit: new Date(),
      },
      create: {
        id: 1,
        totalVisitors: 1,
        lastVisit: new Date(),
      },
    })

    return NextResponse.json({ count: result.totalVisitors })
  } catch (error) {
    return NextResponse.json({ count: 0 })
  }
}

export async function GET() {
  try {
    const stats = await prisma.visitorStats.findUnique({
      where: { id: 1 },
    })
    return NextResponse.json({ count: stats?.totalVisitors || 0 })
  } catch (error) {
    return NextResponse.json({ count: 0 })
  }
}
