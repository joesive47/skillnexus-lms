import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const bucketName = process.env.S3_BUCKET || process.env.AWS_S3_BUCKET

    return NextResponse.json({
      hasRegion: Boolean(process.env.AWS_REGION),
      hasAccessKeyId: Boolean(process.env.AWS_ACCESS_KEY_ID),
      hasSecretAccessKey: Boolean(process.env.AWS_SECRET_ACCESS_KEY),
      hasBucket: Boolean(bucketName),
      bucketEnvKey: process.env.S3_BUCKET ? 'S3_BUCKET' : (process.env.AWS_S3_BUCKET ? 'AWS_S3_BUCKET' : null),
      vercelEnv: process.env.VERCEL_ENV || null,
      vercelGitCommit: process.env.VERCEL_GIT_COMMIT_SHA || null,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('[DEBUG] S3 env check error:', error)
    return NextResponse.json({ error: 'Failed to check S3 env' }, { status: 500 })
  }
}
