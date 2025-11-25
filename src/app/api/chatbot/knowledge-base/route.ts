import { NextRequest, NextResponse } from 'next/server'

// In-memory knowledge base for demo
let knowledgeBase = [
  {
    id: '1',
    question: 'SkillNexus LMS คืออะไร?',
    answer: 'SkillNexus LMS เป็นระบบจัดการการเรียนรู้ที่ทันสมัย มีฟีเจอร์ Anti-Skip Video Player, SCORM Support, AI Recommendations และ PWA ที่ช่วยให้การเรียนรู้มีประสิทธิภาพมากขึ้น',
    category: 'skillnexus',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    question: 'Anti-Skip Video Player ทำงานอย่างไร?',
    answer: 'Anti-Skip Video Player เป็นฟีเจอร์ที่ป้องกันผู้เรียนข้ามเนื้อหาวิดีโอ เพื่อให้มั่นใจว่าผู้เรียนรับชมเนื้อหาครบถ้วนตามหลักสูตร ระบบจะล็อกปุ่มข้ามและสไลเดอร์จนกว่าจะดูจบ',
    category: 'technical',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    question: 'การรองรับ SCORM คืออะไร?',
    answer: 'ระบบรองรับมาตรฐาน SCORM (SCORM 1.2 และ SCORM 2004) ทำให้สามารถนำเข้าคอนเทนต์ eLearning จากเครื่องมือภายนอกได้ เช่น Articulate Storyline, iSpring และติดตามความคืบหน้าได้อย่างแม่นยำ',
    category: 'technical',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    question: 'PWA คืออะไร?',
    answer: 'PWA (Progressive Web App) ทำให้ SkillNexus ทำงานเหมือนแอปมือถือ สามารถติดตั้งบนหน้าจอหลัก ใช้งานออฟไลน์ได้บางส่วน และอัปเดตอัตโนมัติ',
    category: 'technical',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    question: 'ระบบ AI Recommendations ทำงานอย่างไร?',
    answer: 'ระบบ AI ใน SkillNexus ช่วยแนะนำหลักสูตรที่เหมาะสม วิเคราะห์ความคืบหน้าการเรียน และสร้างเส้นทางการเรียนรู้ที่เหมาะกับแต่ละบุคคล',
    category: 'technical',
    isActive: true,
    createdAt: new Date().toISOString()
  }
]

export async function GET() {
  try {
    return NextResponse.json(knowledgeBase)
  } catch (error) {
    console.error('Error fetching knowledge base:', error)
    return NextResponse.json(
      { error: 'Failed to fetch knowledge base' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { question, answer, category = 'general' } = await request.json()

    if (!question || !answer) {
      return NextResponse.json(
        { error: 'Question and answer are required' },
        { status: 400 }
      )
    }

    const newItem = {
      id: Date.now().toString(),
      question: question.trim(),
      answer: answer.trim(),
      category,
      isActive: true,
      createdAt: new Date().toISOString()
    }

    knowledgeBase.push(newItem)

    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    console.error('Error adding knowledge base item:', error)
    return NextResponse.json(
      { error: 'Failed to add knowledge base item' },
      { status: 500 }
    )
  }
}