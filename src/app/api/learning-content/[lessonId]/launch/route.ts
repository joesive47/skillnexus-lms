import { NextResponse } from 'next/server'
import { AccessError, publicError } from '@/lib/access-control'
import { getLaunchPath, getRuntimePackage } from '@/lib/scorm-package-runtime'

export const runtime = 'nodejs'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params
    const scormPackage = await getRuntimePackage(lessonId)
    return NextResponse.json({ launchPath: getLaunchPath(scormPackage.manifest) }, {
      headers: { 'Cache-Control': 'private, no-store' },
    })
  } catch (error) {
    return NextResponse.json(
      { error: publicError(error) },
      { status: error instanceof AccessError ? error.status : 500 }
    )
  }
}
