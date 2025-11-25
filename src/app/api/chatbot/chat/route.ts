import { NextRequest, NextResponse } from 'next/server'
import { searchExcelQA } from '@/lib/excel-qa-utils'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    console.log('🤖 Chatbot request:', { message, sessionId })

    // Prepare search terms
    const searchTerms = message.toLowerCase().split(' ').filter((term: string) => term.length > 2)

    // 1. Search in ChatKnowledgeBase with better matching
    const knowledgeResults = await prisma.chatKnowledgeBase.findMany({
      where: {
        isActive: true,
        OR: [
          { question: { contains: message, mode: 'insensitive' } },
          { answer: { contains: message, mode: 'insensitive' } },
          ...searchTerms.map((term: string) => ({ question: { contains: term, mode: 'insensitive' } })),
          ...searchTerms.map((term: string) => ({ answer: { contains: term, mode: 'insensitive' } }))
        ]
      },
      take: 5
    })

    if (knowledgeResults.length > 0) {
      const bestMatch = knowledgeResults[0]
      return NextResponse.json({
        response: bestMatch.answer,
        sources: knowledgeResults.map(kb => ({
          source: 'Knowledge Base',
          content: kb.question,
          category: kb.category,
          similarity: 90
        })),
        method: 'knowledge_base'
      })
    }

    // 2. Search in KnowledgeChunk (from JSON import)
    const knowledgeChunks = await prisma.knowledgeChunk.findMany({
      where: {
        OR: [
          { content: { contains: message, mode: 'insensitive' } },
          ...searchTerms.map((term: string) => ({ content: { contains: term, mode: 'insensitive' } }))
        ]
      },
      take: 3
    })

    if (knowledgeChunks.length > 0) {
      const bestChunk = knowledgeChunks[0]
      return NextResponse.json({
        response: bestChunk.content,
        sources: knowledgeChunks.map(chunk => ({
          source: chunk.documentName,
          content: chunk.content.substring(0, 200) + '...',
          similarity: 88
        })),
        method: 'knowledge_chunk'
      })
    }

    // 3. Search in RAG Documents
    const ragChunks = await prisma.ragChunk.findMany({
      where: {
        OR: [
          { content: { contains: message, mode: 'insensitive' } },
          ...searchTerms.map((term: string) => ({ content: { contains: term, mode: 'insensitive' } }))
        ]
      },
      include: {
        document: true
      },
      take: 3
    })

    if (ragChunks.length > 0) {
      const combinedContent = ragChunks.map(chunk => chunk.content).join('\n\n')
      return NextResponse.json({
        response: `ตามข้อมูลที่พบ:\n\n${combinedContent}`,
        sources: ragChunks.map(chunk => ({
          source: chunk.document.filename,
          content: chunk.content.substring(0, 200) + '...',
          similarity: 85
        })),
        method: 'rag_search'
      })
    }

    // 4. Try Excel Q&A
    const excelAnswer = searchExcelQA(message)
    if (excelAnswer) {
      return NextResponse.json({
        response: excelAnswer,
        sources: [{
          source: 'Excel Q&A Database',
          content: 'คำตอบจากไฟล์ Excel ที่นำเข้า',
          similarity: 80
        }],
        method: 'excel_qa'
      })
    }

    // 5. Fallback with built-in knowledge
    const builtInAnswer = getBuiltInAnswer(message.toLowerCase())
    if (builtInAnswer) {
      return NextResponse.json({
        response: builtInAnswer,
        sources: [{
          source: 'SkillNexus Built-in Knowledge',
          content: 'ข้อมูลจากระบบ SkillNexus LMS',
          similarity: 75
        }],
        method: 'built_in'
      })
    }

    // Default response for unmatched queries
    const defaultResponse = `ขอโทษครับ ไม่พบข้อมูลที่เกี่ยวข้องกับ "${message}" ในระบบ

🔍 คำแนะนำ:
• ลองใช้คำค้นหาที่แตกต่างกัน
• ถามเกี่ยวกับ SkillNexus LMS, หลักสูตร, หรือฟีเจอร์ต่างๆ
• ติดต่อผู้ดูแลระบบหากต้องการความช่วยเหลือเพิ่มเติม

💡 ตัวอย่างคำถาม:
• "SkillNexus LMS คืออะไร?"
• "ฟีเจอร์ Anti-Skip Video Player ทำงานอย่างไร?"
• "การรองรับ SCORM คืออะไร?"
• "ระบบ AI Recommendations ทำงานอย่างไร?"`

    return NextResponse.json({
      response: defaultResponse,
      sources: [],
      method: 'default'
    })

  } catch (error) {
    console.error('❌ Chatbot error:', error)
    
    return NextResponse.json({
      response: 'เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง หรือติดต่อผู้ดูแลระบบ',
      sources: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

function getBuiltInAnswer(query: string): string | null {
  const answers: Record<string, string> = {
    'skillnexus': 'SkillNexus LMS เป็นระบบจัดการการเรียนรู้ที่ทันสมัย มีฟีเจอร์ Anti-Skip Video Player, SCORM Support, AI Recommendations และ PWA ที่ช่วยให้การเรียนรู้มีประสิทธิภาพมากขึ้น',
    'anti-skip': 'Anti-Skip Video Player เป็นฟีเจอร์ที่ป้องกันผู้เรียนข้ามเนื้อหาวิดีโอ เพื่อให้มั่นใจว่าผู้เรียนรับชมเนื้อหาครบถ้วนตามหลักสูตร ระบบจะล็อกปุ่มข้ามและสไลเดอร์จนกว่าจะดูจบ',
    'scorm': 'ระบบรองรับมาตรฐาน SCORM (SCORM 1.2 และ SCORM 2004) ทำให้สามารถนำเข้าคอนเทนต์ eLearning จากเครื่องมือภายนอกได้ เช่น Articulate Storyline, iSpring และติดตามความคืบหน้าได้อย่างแม่นยำ',
    'pwa': 'PWA (Progressive Web App) ทำให้ SkillNexus ทำงานเหมือนแอปมือถือ สามารถติดตั้งบนหน้าจอหลัก ใช้งานออฟไลน์ได้บางส่วน และอัปเดตอัตโนมัติ',
    'ai': 'ระบบ AI ใน SkillNexus ช่วยแนะนำหลักสูตรที่เหมาะสม วิเคราะห์ความคืบหน้าการเรียน และสร้างเส้นทางการเรียนรู้ที่เหมาะกับแต่ละบุคคล โดยใช้ Machine Learning วิเคราะห์พฤติกรรมการเรียนรู้',
    'nextauth': 'NextAuth.js v5 เป็นระบบจัดการการยืนยันตัวตนที่ปลอดภัย รองรับการลงชื่อเข้าใช้ด้วย Social Providers, SAML/OAuth และมีการจัดการเซสชันที่ปลอดภัย',
    'cache': 'ระบบแคชหลายชั้น ประกอบด้วย Redis (Server-side) สำหรับแคชข้อมูลบนเซิร์ฟเวอร์ และ Service Worker (Client-side) สำหรับแคชไฟล์คงที่ในเบราว์เซอร์ เพื่อเพิ่มความเร็วในการโหลด'
  }

  for (const [key, answer] of Object.entries(answers)) {
    if (query.includes(key)) {
      return answer
    }
  }

  return null
}

export async function GET() {
  return NextResponse.json({
    status: 'SkillNexus Chatbot API is running',
    timestamp: new Date().toISOString(),
    version: '2.1',
    features: [
      'Enhanced keyword-based responses',
      'Knowledge Base search',
      'Knowledge Chunk search',
      'RAG document search',
      'Built-in SkillNexus knowledge',
      'Real-time chat support',
      'Fallback responses'
    ],
    endpoints: {
      chat: 'POST /api/chatbot/chat',
      knowledgeBase: 'GET/POST /api/chatbot/knowledge-base'
    }
  })
}