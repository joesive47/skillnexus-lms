import { NextRequest, NextResponse } from 'next/server'
import { processDocument } from '@/lib/document-processor-optimized'

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Testing document processing...')
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    console.log(`📄 Processing file: ${file.name} (${file.size} bytes)`)
    
    // Test document processing
    const buffer = await file.arrayBuffer()
    const content = await processDocument(buffer, file.name)
    
    if (!content) {
      return NextResponse.json({ error: 'Failed to extract content' }, { status: 400 })
    }

    console.log(`✅ Extracted ${content.length} characters`)
    
    return NextResponse.json({ 
      success: true,
      filename: file.name,
      fileSize: file.size,
      contentLength: content.length,
      preview: content.substring(0, 200) + (content.length > 200 ? '...' : ''),
      message: 'Document processing test successful'
    })

  } catch (error) {
    console.error('❌ Test upload error:', error)
    return NextResponse.json({ 
      error: 'Processing failed: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Test upload endpoint is working',
    supportedTypes: ['txt', 'docx', 'doc', 'pdf'],
    timestamp: new Date().toISOString()
  })
}