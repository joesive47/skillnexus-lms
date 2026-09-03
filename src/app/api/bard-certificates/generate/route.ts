import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { CertificateGenerator } from '@/lib/certificate-generator'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId, courseId } = await req.json()

    if (session.user.role !== 'ADMIN' && session.user.id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const generator = new CertificateGenerator()
    const certificate = await generator.generateCertificate(userId, courseId)

    return NextResponse.json({ success: true, certificate })
  } catch (error) {
    console.error('Certificate generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate certificate' },
      { status: 500 }
    )
  }
}
