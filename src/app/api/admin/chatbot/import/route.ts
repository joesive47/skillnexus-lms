import { adminAccessDenied } from '@/lib/access-control'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const denied = await adminAccessDenied()
  if (denied) return denied

  return NextResponse.json({
    success: true,
    message: 'นำเข้าข้อมูลสำเร็จ'
  })
}