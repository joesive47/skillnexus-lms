import { NextRequest, NextResponse } from 'next/server'
import { SmartChatbot } from '@/lib/smart-chatbot'
import { AccessError, publicError, requireAdmin, requireUser } from '@/lib/access-control'

const chatbot = new SmartChatbot()

export async function POST(request: NextRequest) {
  try {
    await requireUser()
    const { message } = await request.json()

    if (typeof message !== 'string' || !message.trim() || message.length > 4000) {
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
      { error: publicError(error) },
      { status: error instanceof AccessError ? error.status : 500 }
    )
  }
}

// API สำหรับ import knowledge base
export async function PUT(request: NextRequest) {
  try {
    await requireAdmin()
    const knowledgeData = await request.json()
    
    await chatbot.importKnowledge(knowledgeData)
    
    return NextResponse.json({
      message: 'นำเข้า Knowledge Base สำเร็จ',
      totalChunks: knowledgeData.knowledge?.length || 0
    })

  } catch (error) {
    console.error('Import knowledge error:', error)
    return NextResponse.json(
      { error: publicError(error) },
      { status: error instanceof AccessError ? error.status : 500 }
    )
  }
}
