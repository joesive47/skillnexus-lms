import { NextRequest, NextResponse } from 'next/server'
import { processDocument } from '@/lib/document-processor'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const url = formData.get('url') as string | null
    const courseId = formData.get('courseId') as string | null
    const userId = formData.get('userId') as string | null

    if (!file && !url) {
      return NextResponse.json(
        { error: 'Please provide either a file or URL' },
        { status: 400 }
      )
    }

    const document = await processDocument(
      file,
      url,
      courseId || undefined,
      userId || undefined
    )

    return NextResponse.json({
      success: true,
      document: {
        id: document.id,
        filename: document.filename,
        totalChunks: document.totalChunks,
        status: document.status
      }
    })
  } catch (error: any) {
    console.error('Document upload error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process document' },
      { status: 500 }
    )
  }
}
