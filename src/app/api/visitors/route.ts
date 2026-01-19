import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    const result = await prisma.$executeRaw`
      INSERT INTO site_stats (key, value, updated_at)
      VALUES ('visitor_count', '1', CURRENT_TIMESTAMP)
      ON CONFLICT (key) 
      DO UPDATE SET value = (CAST(site_stats.value AS INTEGER) + 1)::TEXT, updated_at = CURRENT_TIMESTAMP
    `

    const stats = await prisma.$queryRaw<any[]>`
      SELECT value FROM site_stats WHERE key = 'visitor_count'
    `

    return NextResponse.json({ count: parseInt(stats[0]?.value || '0') })
  } catch (error) {
    return NextResponse.json({ count: 0 })
  }
}

export async function GET() {
  try {
    const stats = await prisma.$queryRaw<any[]>`
      SELECT value FROM site_stats WHERE key = 'visitor_count'
    `
    return NextResponse.json({ count: parseInt(stats[0]?.value || '0') })
  } catch (error) {
    return NextResponse.json({ count: 0 })
  }
}
