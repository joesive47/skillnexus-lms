import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()
    
    if (action === 'convert-all') {
      const completedDocs = await prisma.document.findMany({
        where: { status: 'completed' },
        include: { chunks: true }
      })

      let convertedCount = 0

      for (const doc of completedDocs) {
        for (const chunk of doc.chunks) {
          const question = `เกี่ยวกับ ${doc.filename} - ส่วนที่ ${chunk.chunkIndex + 1}`
          const answer = chunk.content
          const category = doc.fileType || 'document'

          const existing = await prisma.chatKnowledgeBase.findFirst({
            where: {
              question: { contains: question },
              answer: { contains: answer.substring(0, 50) }
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
        message: `แปลงเอกสารทั้งหมด ${completedDocs.length} ไฟล์ เป็น ${convertedCount} รายการ Knowledge Base`,
        converted: convertedCount,
        documents: completedDocs.length
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (error) {
    console.error('Bulk convert error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการแปลงข้อมูลแบบกลุ่ม' },
      { status: 500 }
    )
  }
}