import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { documentIds } = await request.json()
    
    if (!documentIds || !Array.isArray(documentIds)) {
      return NextResponse.json({ error: 'Document IDs required' }, { status: 400 })
    }

    let convertedCount = 0

    for (const docId of documentIds) {
      const chunks = await prisma.documentChunk.findMany({
        where: { documentId: docId },
        include: { document: true }
      })

      if (chunks.length === 0) continue

      for (const chunk of chunks) {
        const question = `เกี่ยวกับ ${chunk.document.filename}`
        const answer = chunk.content
        const category = chunk.document.fileType || 'document'

        const existing = await prisma.chatKnowledgeBase.findFirst({
          where: {
            question: { contains: question },
            answer: { contains: answer.substring(0, 100) }
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
    }

    return NextResponse.json({
      success: true,
      message: `แปลง ${convertedCount} รายการเป็น Knowledge Base สำเร็จ`,
      converted: convertedCount
    })

  } catch (error) {
    console.error('RAG conversion error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการแปลงข้อมูล' },
      { status: 500 }
    )
  }
}