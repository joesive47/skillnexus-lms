import { NextRequest, NextResponse } from 'next/server'
import { 
  enhancedChatResponseFast, 
  getSystemStatsFast, 
  clearCacheFast,
  generateRAGResponseFast 
} from '@/lib/rag-ultra-fast'
import { auth } from '@/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { question, courseId, mode = 'enhanced' } = await request.json()

    if (!question?.trim()) {
      return NextResponse.json({ 
        error: 'Question is required' 
      }, { status: 400 })
    }

    console.log(`⚡ Ultra-fast RAG request: "${question.substring(0, 50)}..."`)
    const startTime = Date.now()

    let response: string
    
    if (mode === 'rag-only') {
      response = await generateRAGResponseFast(question, courseId)
    } else {
      response = await enhancedChatResponseFast(question, courseId)
    }

    const processingTime = Date.now() - startTime
    console.log(`⚡ Ultra-fast response generated in ${processingTime}ms`)

    return NextResponse.json({
      success: true,
      response,
      metadata: {
        processingTime,
        mode: 'ultra-fast',
        courseId: courseId || null,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('❌ Ultra-fast RAG API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const stats = getSystemStatsFast()
    
    return NextResponse.json({
      success: true,
      stats,
      performance: {
        status: 'ultra-fast',
        recommendations: getPerformanceRecommendations(stats)
      }
    })
  } catch (error) {
    console.error('❌ Stats error:', error)
    return NextResponse.json({ 
      error: 'Failed to get stats' 
    }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    clearCacheFast()
    
    return NextResponse.json({
      success: true,
      message: 'Ultra-fast cache cleared successfully'
    })
  } catch (error) {
    console.error('❌ Cache clear error:', error)
    return NextResponse.json({ 
      error: 'Failed to clear cache' 
    }, { status: 500 })
  }
}

function getPerformanceRecommendations(stats: any): string[] {
  const recommendations: string[] = []
  
  if (!stats.isEmbedderLoaded) {
    recommendations.push('⚡ Model ยังไม่โหลด - การตอบครั้งแรกจะใช้เวลานานกว่าปกติ')
  }
  
  if (stats.embeddingCacheSize > stats.maxCacheSize * 0.8) {
    recommendations.push('🧹 Cache ใกล้เต็ม - ควรล้าง cache เพื่อประสิทธิภาพสูงสุด')
  }
  
  if (stats.memoryUsage.heapUsed > 300 * 1024 * 1024) {
    recommendations.push('💾 การใช้หน่วยความจำสูง - ควรรีสตาร์ทเซิร์ฟเวอร์')
  }
  
  if (stats.fastMode) {
    recommendations.push('⚡ Ultra-fast mode เปิดใช้งาน - ประสิทธิภาพสูงสุด')
  }
  
  if (recommendations.length === 0) {
    recommendations.push('✅ ระบบทำงานในสภาพสูงสุด - ประสิทธิภาพดีเยี่ยม')
  }
  
  return recommendations
}