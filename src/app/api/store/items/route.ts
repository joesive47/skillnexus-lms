import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const items = await prisma.creditStore.findMany({
      where: { isActive: true },
      orderBy: { cost: 'asc' }
    })

    return NextResponse.json({ items })
  } catch (error) {
    console.error('Get store items error:', error)
    return NextResponse.json({ error: 'Failed to get store items' }, { status: 500 })
  }
}