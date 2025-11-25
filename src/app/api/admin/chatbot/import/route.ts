import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'นำเข้าข้อมูลสำเร็จ'
  })
}