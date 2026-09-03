import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { generateEmbeddingFast } from '@/lib/rag-ultra-fast'

export async function POST(request: NextRequest) {
  try {
    console.log('🤖 Starting embedding generation...')
    
    // หาชิ้นส่วนที่ยังไม่มี embedding
    const chunksWithoutEmbedding = await prisma.ragChunk.findMany({
      where: {
        embedding: null
      },
      take: 50 // จำกัดจำนวนเพื่อไม่ให้ระบบล่ม
    })

    if (chunksWithoutEmbedding.length === 0) {
      return NextResponse.json({ 
        message: 'ไม่มีชิ้นส่วนที่ต้องสร้าง embedding',
        processed: 0
      })
    }

    console.log(`🔄 Processing ${chunksWithoutEmbedding.length} chunks...`)
    
    let processed = 0
    let failed = 0

    for (const chunk of chunksWithoutEmbedding) {
      try {
        const embedding = await generateEmbeddingFast(chunk.content)
        
        await prisma.ragChunk.update({
          where: { id: chunk.id },
          data: { embedding: JSON.stringify(embedding) }
        })
        
        processed++
        console.log(`✅ Processed chunk ${processed}/${chunksWithoutEmbedding.length}`)
        
      } catch (error) {
        console.error(`❌ Failed to process chunk ${chunk.id}:`, error)
        failed++
      }
    }

    return NextResponse.json({ 
      success: true,
      processed,
      failed,
      total: chunksWithoutEmbedding.length,
      message: `สร้าง embedding สำเร็จ ${processed} ชิ้นส่วน${failed > 0 ? ` (ล้มเหลว ${failed} ชิ้นส่วน)` : ''}`
    })

  } catch (error) {
    console.error('❌ Embedding generation error:', error)
    return NextResponse.json({ 
      error: 'เกิดข้อผิดพลาดในการสร้าง embedding: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const stats = await prisma.ragChunk.groupBy({
      by: ['embedding'],
      _count: true
    })
    
    const withEmbedding = stats.find(s => s.embedding !== null)?._count || 0
    const withoutEmbedding = stats.find(s => s.embedding === null)?._count || 0
    
    return NextResponse.json({
      withEmbedding,
      withoutEmbedding,
      total: withEmbedding + withoutEmbedding,
      percentage: withEmbedding + withoutEmbedding > 0 ? Math.round((withEmbedding / (withEmbedding + withoutEmbedding)) * 100) : 0
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get stats' }, { status: 500 })
  }
}