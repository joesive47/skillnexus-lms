import { adminAccessDenied } from '@/lib/access-control'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const denied = await adminAccessDenied()
  if (denied) return denied

  return NextResponse.json({
    knowledgeBase: []
  })
}

export async function POST(request: NextRequest) {
  const denied = await adminAccessDenied()
  if (denied) return denied

  return NextResponse.json({
    success: true,
    message: 'เพิ่มฐานความรู้สำเร็จ'
  })
}