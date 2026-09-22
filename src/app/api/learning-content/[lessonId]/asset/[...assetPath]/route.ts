import { NextResponse } from 'next/server'
import { AccessError, publicError } from '@/lib/access-control'
import { getRuntimeAsset, getRuntimePackage } from '@/lib/scorm-package-runtime'

export const runtime = 'nodejs'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ lessonId: string; assetPath: string[] }> }
) {
  try {
    const { lessonId, assetPath } = await params
    const scormPackage = await getRuntimePackage(lessonId)
    const asset = await getRuntimeAsset(scormPackage, assetPath.join('/'))
    return new NextResponse(asset.body, {
      headers: {
        'Content-Type': asset.contentType,
        'Cache-Control': 'private, no-store',
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: publicError(error) },
      { status: error instanceof AccessError ? error.status : 500 }
    )
  }
}
