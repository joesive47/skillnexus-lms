import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    messages: [
      { id: 1, question: 'หลักสูตรมีอะไรบ้าง?', answer: 'เรามีหลักสูตรด้านเทคโนโลยี การตลาด และการจัดการ', active: true },
      { id: 2, question: 'วิธีการสมัครเรียน?', answer: 'สามารถสมัครผ่านเว็บไซต์หรือติดต่อทีมงาน', active: true }
    ]
  })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  
  return NextResponse.json({
    success: true,
    message: 'เพิ่มคำถาม-คำตอบสำเร็จ',
    data: body
  })
}