import { NextRequest, NextResponse } from 'next/server'
import { uploadToS3 } from '@/lib/upload'
import { AccessError, publicError, requireAdmin } from '@/lib/access-control'

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 })
    }

    // Upload using the smart upload system (Blob -> S3 -> Local)
    const imageUrl = await uploadToS3(file)

    return NextResponse.json({ 
      success: true, 
      imageUrl,
      filename: file.name 
    })

  } catch (error) {
    console.error('Upload error:', error)
    const status = error instanceof AccessError ? error.status :
      error instanceof Error && /file|image/i.test(error.message) ? 400 : 500
    return NextResponse.json({ error: error instanceof AccessError ? publicError(error) : 'Upload failed' }, { status })
  }
}
