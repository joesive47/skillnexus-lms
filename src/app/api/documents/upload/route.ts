import { NextRequest, NextResponse } from 'next/server'
import { processDocument } from '@/lib/document-processor'
import { AccessError, publicError, requireAdmin } from '@/lib/access-control'

const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024
const allowedExtensions = new Set(['pdf', 'docx', 'xlsx', 'xls', 'txt'])

export async function POST(req: NextRequest) {
  try {
    const user = await requireAdmin()
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const url = formData.get('url') as string | null
    const courseId = formData.get('courseId') as string | null

    if ((!file && !url) || (file && url)) {
      return NextResponse.json(
        { error: 'Provide exactly one file or URL' },
        { status: 400 }
      )
    }

    if (file) {
      const extension = file.name.toLowerCase().split('.').pop() || ''
      if (file.size <= 0 || file.size > MAX_DOCUMENT_BYTES || !allowedExtensions.has(extension)) {
        return NextResponse.json({ error: 'Invalid document type or size (maximum 10 MB)' }, { status: 400 })
      }
    }

    const document = await processDocument(
      file,
      url,
      courseId || undefined,
      user.id
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
  } catch (error: unknown) {
    console.error('Document upload error:', error)
    return NextResponse.json(
      { error: error instanceof AccessError ? publicError(error) : 'Failed to process document' },
      { status: error instanceof AccessError ? error.status : 500 }
    )
  }
}
