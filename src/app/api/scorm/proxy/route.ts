import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')
    
    if (!url) {
      return NextResponse.json({ error: 'URL required' }, { status: 400 })
    }

    return NextResponse.json({ 
      packageUrl: url,
      indexUrl: url.replace('.zip', '/index.html'),
      message: 'Use GitHub Pages or external hosting for SCORM content'
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process SCORM package' }, { status: 500 })
  }
}
