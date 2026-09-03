import { NextRequest, NextResponse } from 'next/server'
import { AccessError, publicError, requireUser } from '@/lib/access-control'
import { issueVerifiedCertificate } from '@/lib/issue-certificate'
export async function POST(request: NextRequest) {
  try {
    const user = await requireUser()
    const { courseId } = await request.json()
    if (typeof courseId !== 'string' || !courseId) throw new AccessError('Course ID required', 400)
    const certificate = await issueVerifiedCertificate(user.id, courseId)
    return NextResponse.json({ certificateId: certificate.id, certificateNumber: certificate.certificateNumber })
  } catch (error) { return NextResponse.json({ error: publicError(error) }, { status: error instanceof AccessError ? error.status : 500 }) }
}
