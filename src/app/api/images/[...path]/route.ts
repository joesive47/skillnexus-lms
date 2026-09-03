import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params
    const imagePath = path.join('/')
    const filePath = join(process.cwd(), 'public', 'uploads', imagePath)
    
    if (!existsSync(filePath)) {
      return new NextResponse('Image not found', { status: 404 })
    }
    
    const imageBuffer = await readFile(filePath)
    const ext = imagePath.split('.').pop()?.toLowerCase()
    
    let contentType = 'image/jpeg'
    if (ext === 'png') contentType = 'image/png'
    if (ext === 'webp') contentType = 'image/webp'
    if (ext === 'svg') contentType = 'image/svg+xml'
    
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000',
      },
    })
  } catch (error) {
    console.error('Error serving image:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}