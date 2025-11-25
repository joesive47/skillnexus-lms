import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { documentId, chunkIds, conversionType = 'auto' } = await request.json()
    
    let convertedCount = 0
    let chunks: any[] = []

    if (documentId) {
      chunks = await prisma.documentChunk.findMany({
        where: { documentId },
        include: { document: true }
      })
    } else if (chunkIds) {
      chunks = await prisma.documentChunk.findMany({
        where: { id: { in: chunkIds } },
        include: { document: true }
      })
    }

    for (const chunk of chunks) {
      let question = ''
      let answer = chunk.content
      let category = chunk.document.fileType || 'document'

      if (conversionType === 'smart') {
        question = generateSmartQuestion(chunk.content, chunk.document.filename)
      } else {
        question = `เกี่ยวกับ ${chunk.document.filename} - ส่วนที่ ${chunk.chunkIndex + 1}`
      }

      const existing = await prisma.chatKnowledgeBase.findFirst({
        where: {
          OR: [
            { question: { contains: question.substring(0, 50) } },
            { answer: { contains: answer.substring(0, 100) } }
          ]
        }
      })

      if (!existing) {
        await prisma.chatKnowledgeBase.create({
          data: {
            question,
            answer,
            category,
            isActive: true
          }
        })
        convertedCount++
      }
    }

    return NextResponse.json({
      success: true,
      message: `แปลง ${convertedCount} รายการเป็น Knowledge Base สำเร็จ`,
      converted: convertedCount,
      total: chunks.length
    })

  } catch (error) {
    console.error('Smart convert error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการแปลงข้อมูลอัจฉริยะ' },
      { status: 500 }
    )
  }
}

function generateSmartQuestion(content: string, filename: string): string {
  const contentLower = content.toLowerCase()
  
  if (contentLower.includes('วิธีการ') || contentLower.includes('how to')) {
    return `วิธีการ${extractKeyPhrase(content)} คืออะไร?`
  }
  
  if (contentLower.includes('คือ') || contentLower.includes('หมายถึง')) {
    return `${extractKeyPhrase(content)} คืออะไร?`
  }
  
  if (contentLower.includes('ประโยชน์') || contentLower.includes('benefit')) {
    return `ประโยชน์ของ${extractKeyPhrase(content)} คืออะไร?`
  }
  
  if (contentLower.includes('ขั้นตอน') || contentLower.includes('step')) {
    return `ขั้นตอนการ${extractKeyPhrase(content)} เป็นอย่างไร?`
  }
  
  return `เกี่ยวกับ ${filename} - ${extractKeyPhrase(content)}`
}

function extractKeyPhrase(content: string): string {
  const words = content.split(' ').slice(0, 5)
  return words.join(' ').replace(/[^\w\sก-๙]/g, '')
}

function calculateConfidence(content: string): number {
  let score = 0.5
  
  if (content.length > 100) score += 0.2
  if (content.includes('คือ') || content.includes('หมายถึง')) score += 0.1
  if (content.includes('วิธี') || content.includes('ขั้นตอน')) score += 0.1
  if (content.match(/\d+/)) score += 0.1
  
  return Math.min(score, 1.0)
}