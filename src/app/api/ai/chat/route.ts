import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'

class AIAssistantService {
  private knowledgeBase = {
    courses: 'SkillNexus มีหลักสูตรที่หลากหลาย รวมถึง Programming, Design, Business และอื่นๆ',
    features: 'ระบบมีฟีเจอร์ Anti-Skip Video, SCORM Support, AI Recommendations, และ Gamification',
    certificates: 'เมื่อเรียนจบจะได้รับใบรับรองทักษะที่ได้รับการยืนยัน',
    progress: 'คุณสามารถติดตามความคืบหน้าการเรียนได้ในหน้า Dashboard',
    support: 'หากมีปัญหาสามารถติดต่อทีมสนับสนุนได้ตลอด 24/7'
  }

  async generateResponse(message: string, userId?: string): Promise<string> {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes('หลักสูตร') || lowerMessage.includes('course')) {
      return this.knowledgeBase.courses
    }
    
    if (lowerMessage.includes('ฟีเจอร์') || lowerMessage.includes('feature')) {
      return this.knowledgeBase.features
    }
    
    if (lowerMessage.includes('ใบรับรอง') || lowerMessage.includes('certificate')) {
      return this.knowledgeBase.certificates
    }
    
    if (lowerMessage.includes('ความคืบหน้า') || lowerMessage.includes('progress')) {
      return this.knowledgeBase.progress
    }
    
    if (lowerMessage.includes('ช่วย') || lowerMessage.includes('help')) {
      return this.knowledgeBase.support
    }

    const defaultResponses = [
      'ขอบคุณสำหรับคำถาม! คุณสามารถถามเกี่ยวกับหลักสูตร ฟีเจอร์ หรือการใช้งานระบบได้เลยครับ',
      'ผมพร้อมช่วยเหลือคุณ! มีอะไรเกี่ยวกับการเรียนรู้ที่อยากทราบไหมครับ?'
    ]

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const aiService = new AIAssistantService()
    const response = await aiService.generateResponse(message, session?.user?.id)

    return NextResponse.json({ 
      response,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('AI Chat error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}