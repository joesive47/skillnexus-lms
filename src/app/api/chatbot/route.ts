import { NextRequest, NextResponse } from 'next/server'
import { SmartChatbot } from '@/lib/smart-chatbot'

const chatbot = new SmartChatbot()

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'กรุณาใส่ข้อความ' },
        { status: 400 }
      )
    }

    const response = await chatbot.generateResponse(message)

    return NextResponse.json({
      response,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Chatbot API error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการประมวลผล' },
      { status: 500 }
    )
  }
}

// API สำหรับ import knowledge base
export async function PUT(request: NextRequest) {
  try {
    const knowledgeData = await request.json()
    
    await chatbot.importKnowledge(knowledgeData)
    
    return NextResponse.json({
      message: 'นำเข้า Knowledge Base สำเร็จ',
      totalChunks: knowledgeData.knowledge?.length || 0
    })

  } catch (error) {
    console.error('Import knowledge error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการนำเข้าข้อมูล' },
      { status: 500 }
    )
  }
}