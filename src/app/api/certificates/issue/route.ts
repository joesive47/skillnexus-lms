import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { courseId } = await request.json()

    // Check if already has certificate
    const existing = await prisma.certificate.findFirst({
      where: {
        userId: session.user.id,
        courseId: courseId
      }
    })

    if (existing) {
      return NextResponse.json({
        certificateId: existing.id,
        message: 'Certificate already exists'
      })
    }

    // Create certificate
    const certificate = await prisma.certificate.create({
      data: {
        userId: session.user.id,
        courseId: courseId,
        certificateNumber: `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        issuedAt: new Date()
      }
    })

    return NextResponse.json({
      certificateId: certificate.id,
      certificateNumber: certificate.certificateNumber,
      message: 'Certificate issued successfully'
    })
  } catch (error) {
    console.error('[CERTIFICATE_ISSUE] Error:', error)
    return NextResponse.json(
      { error: 'Failed to issue certificate' },
      { status: 500 }
    )
  }
}
