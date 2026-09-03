import { NextResponse } from 'next/server'
import { auth } from '@/auth'

const careerKnowledge = {
  'เรียนอะไร': 'ขึ้นอยู่กับเป้าหมายของคุณครับ ถ้าอยากเป็น Developer แนะนำให้เริ่มจาก JavaScript, React และ Node.js ถ้าอยากเป็น Data Scientist แนะนำ Python, Statistics และ Machine Learning',
  'อาชีพ': 'อาชีพที่น่าสนใจในปัจจุบันมี Software Developer, Data Scientist, AI Engineer, Product Manager, และ Digital Marketing Manager ครับ',
  'ทักษะ': 'ทักษะสำคัญที่ควรมีคือ Technical Skills (เช่น Programming), Soft Skills (เช่น Communication, Leadership), และ Business Skills (เช่น Project Management)',
  'เวลา': 'โดยเฉลี่ยใช้เวลา 6-24 เดือนในการเปลี่ยนอาชีพ ขึ้นอยู่กับระดับเป้าหมายและทักษะปัจจุบันของคุณครับ',
  'เงินเดือน': 'เงินเดือนเริ่มต้นสำหรับ Junior Developer อยู่ที่ 25,000-35,000 บาท, Senior Developer 60,000-100,000 บาท, และ Tech Lead 100,000-150,000 บาทครับ'
}

function generateResponse(message: string): string {
  const lowerMessage = message.toLowerCase()
  
  for (const [key, response] of Object.entries(careerKnowledge)) {
    if (lowerMessage.includes(key)) {
      return response
    }
  }
  
  return 'ขอบคุณสำหรับคำถามครับ ผมแนะนำให้คุณลองใช้ฟีเจอร์ Skill Assessment เพื่อประเมินทักษะปัจจุบัน และ Career Path Planner เพื่อวางแผนเส้นทางอาชีพที่เหมาะสมครับ'
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { message } = body

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Missing message' },
        { status: 400 }
      )
    }

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const response = generateResponse(message)

    return NextResponse.json({
      success: true,
      data: { response }
    })
  } catch (error) {
    console.error('Error in chat:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process chat' },
      { status: 500 }
    )
  }
}