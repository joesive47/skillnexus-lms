import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { AccessError, publicError, requireUser } from '@/lib/access-control'
import { getCourseProgress, requireCertificateEligibility } from '@/lib/learning-evidence'
import { issueVerifiedCertificate } from '@/lib/issue-certificate'

type Context = { params: Promise<{ courseId: string }> }

export async function POST(_request: NextRequest, { params }: Context) {
  try {
    const user = await requireUser()
    const { courseId } = await params
    const progress = await requireCertificateEligibility(user.id, courseId)
    const certificate = await issueVerifiedCertificate(user.id, courseId)
    return NextResponse.json({ success: true, courseComplete: true, progress, certificate,
      message: '🎉 ยินดีด้วย! คุณจบคอร์สนี้แล้ว' })
  } catch (error) {
    return NextResponse.json({ error: publicError(error) }, { status: error instanceof AccessError ? error.status : 500 })
  }
}

export async function GET(_request: NextRequest, { params }: Context) {
  try {
    const user = await requireUser()
    const { courseId } = await params
    const progress = await getCourseProgress(user.id, courseId)
    const certificate = await prisma.certificate.findUnique({ where: { userId_courseId: { userId: user.id, courseId } } })
    return NextResponse.json({ progress, certificate, canIssueCertificate: progress.isComplete && !certificate })
  } catch (error) {
    return NextResponse.json({ error: publicError(error) }, { status: error instanceof AccessError ? error.status : 500 })
  }
}
