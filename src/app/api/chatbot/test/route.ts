import { NextRequest, NextResponse } from 'next/server'
import { SmartChatbot } from '@/lib/smart-chatbot'

const chatbot = new SmartChatbot()

export async function GET() {
  try {
    const systemStatus = await chatbot.testSystem()
    
    return NextResponse.json({
      message: 'Chatbot system test',
      ...systemStatus,
      testQueries: [
        'SkillNexus LMS มีฟีเจอร์อะไรบ้าง',
        'ระบบ Anti-Skip คืออะไร',
        'รองรับ SCORM ไหม',
        'ความปลอดภัยเป็นอย่างไร'
      ]
    })
    
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'System test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { queries } = await request.json()
    
    if (!Array.isArray(queries)) {
      return NextResponse.json(
        { error: 'queries must be an array' },
        { status: 400 }
      )
    }

    const results = []
    
    for (const query of queries) {
      const response = await chatbot.generateResponse(query)
      results.push({
        query,
        response,
        timestamp: new Date().toISOString()
      })
    }

    return NextResponse.json({
      message: 'Batch test completed',
      results,
      totalQueries: queries.length
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Batch test failed' },
      { status: 500 }
    )
  }
}