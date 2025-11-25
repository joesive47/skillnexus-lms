import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import { join } from 'path'
import mime from 'mime-types'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params
    const filePath = path.join('/')
    
    // Security check - prevent directory traversal
    if (filePath.includes('..') || filePath.includes('\\')) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
    }

    // Construct full file path
    const fullPath = join(process.cwd(), 'public', 'scorm-packages', filePath)
    
    try {
      // Check if file exists
      await fs.access(fullPath)
      
      // Read file
      const fileBuffer = await fs.readFile(fullPath)
      
      // Get MIME type
      const mimeType = mime.lookup(fullPath) || 'application/octet-stream'
      
      // Return file with appropriate headers
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': mimeType,
          'Cache-Control': 'public, max-age=3600',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      })
    } catch (fileError) {
      console.error('File not found:', fullPath, fileError)
      return NextResponse.json(
        { error: 'File not found', path: filePath },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('SCORM file serving error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
}