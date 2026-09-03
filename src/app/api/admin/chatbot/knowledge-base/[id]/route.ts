import { adminAccessDenied } from '@/lib/access-control'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await adminAccessDenied()
  if (denied) return denied

  const { id } = await params
  return NextResponse.json({
    id,
    question: 'ตัวอย่างคำถาม',
    answer: 'ตัวอย่างคำตอบ'
  })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await adminAccessDenied()
  if (denied) return denied

  await params
  return NextResponse.json({
    success: true,
    message: 'อัพเดทสำเร็จ'
  })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await adminAccessDenied()
  if (denied) return denied

  await params
  return NextResponse.json({
    success: true,
    message: 'ลบสำเร็จ'
  })
}