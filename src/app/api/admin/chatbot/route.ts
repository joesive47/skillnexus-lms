import { adminAccessDenied } from '@/lib/access-control'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const denied = await adminAccessDenied()
  if (denied) return denied

  return NextResponse.json({
    messages: [
      { id: 1, question: 'หลักสูตรมีอะไรบ้าง?', answer: 'เรามีหลักสูตรด้านเทคโนโลยี การตลาด และการจัดการ', active: true },
      { id: 2, question: 'วิธีการสมัครเรียน?', answer: 'สามารถสมัครผ่านเว็บไซต์หรือติดต่อทีมงาน', active: true }
    ]
  })
}

export async function POST(request: NextRequest) {
  const denied = await adminAccessDenied()
  if (denied) return denied

  const body = await request.json()
  
  return NextResponse.json({
    success: true,
    message: 'เพิ่มคำถาม-คำตอบสำเร็จ',
    data: body
  })
}