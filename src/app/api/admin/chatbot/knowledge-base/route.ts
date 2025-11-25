import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    knowledgeBase: []
  })
}

export async function POST(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'เพิ่มฐานความรู้สำเร็จ'
  })
}