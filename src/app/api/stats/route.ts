import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const [totalUsers, totalCertificates] = await Promise.all([
      prisma.user.count(),
      prisma.certificate.count()
    ])

    return NextResponse.json({
      visitors: totalUsers * 10,
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
