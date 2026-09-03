import { NextRequest, NextResponse } from 'next/server'
import { uploadToS3 } from '@/lib/upload'
import { AccessError, publicError, requireAdmin } from '@/lib/access-control'

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.size === 0) {
      return NextResponse.json({ error: 'Empty file provided' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 })
    }

    // Upload using the smart upload system (Blob -> S3 -> Local)
    const url = await uploadToS3(file)
    
    return NextResponse.json({ url })
  } catch (error) {
    console.error('Upload error:', error)
    const status = error instanceof AccessError ? error.status :
      error instanceof Error && /file|image/i.test(error.message) ? 400 : 500
    return NextResponse.json({ error: error instanceof AccessError ? publicError(error) : 'Failed to upload image' }, { status })
  }
}
