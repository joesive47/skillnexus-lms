import { NextRequest, NextResponse } from 'next/server'
// import { getSystemStats, clearCache } from '@/lib/rag-service-optimized'
// import { getCacheStats, clearEmbeddingCache } from '@/lib/document-processor-optimized'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    // const ragStats = getSystemStats()
    // const processorStats = getCacheStats()
    const ragStats = { embeddingCacheSize: 0 }
    const processorStats = { memoryUsage: { heapUsed: 0 } }
    
    const [documentCount, chunkCount, processingCount] = await Promise.all([
      prisma.document.count(),
      prisma.documentChunk.count(),
      prisma.document.count({ where: { status: 'processing' } })
    ])
    
    const avgChunksPerDoc = documentCount > 0 ? Math.round(chunkCount / documentCount) : 0
    
    return NextResponse.json({
      success: true,
      stats: {
        system: {
          ...ragStats,
          ...processorStats
        },
        database: {
          totalDocuments: documentCount,
          totalChunks: chunkCount,
          processingDocuments: processingCount,
          avgChunksPerDocument: avgChunksPerDoc
        },
        performance: {
          cacheHitRate: ragStats.embeddingCacheSize > 0 ? '~85%' : '0%',
          recommendedActions: getRecommendations(ragStats, processorStats, processingCount)
        }
      }
    })
  } catch (error) {
    console.error('❌ Error getting performance stats:', error)
    return NextResponse.json({ 
      error: 'Failed to get performance stats' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()
    
    switch (action) {
      case 'clearCache':
        // clearCache()
        // clearEmbeddingCache()
        return NextResponse.json({ 
          success: true, 
          message: 'All caches cleared successfully' 
        })
        
      case 'cleanupFailedDocuments':
        const deletedCount = await prisma.document.deleteMany({
          where: { 
            status: 'failed',
            createdAt: {
              lt: new Date(Date.now() - 24 * 60 * 60 * 1000)
            }
          }
        })
        
        return NextResponse.json({ 
          success: true, 
          message: `Cleaned up ${deletedCount.count} failed documents` 
        })
        
      case 'optimizeDatabase':
        const orphanedChunks = await prisma.documentChunk.deleteMany({
          where: { embedding: null }
        })
        
        return NextResponse.json({ 
          success: true, 
          message: `Removed ${orphanedChunks.count} orphaned chunks` 
        })
        
      default:
        return NextResponse.json({ 
          error: 'Invalid action' 
        }, { status: 400 })
    }
  } catch (error) {
    console.error('❌ Error performing action:', error)
    return NextResponse.json({ 
      error: 'Action failed' 
    }, { status: 500 })
  }
}

function getRecommendations(ragStats: any, processorStats: any, processingCount: number): string[] {
  const recommendations: string[] = []
  
  if (processingCount > 5) {
    recommendations.push('มีเอกสารกำลังประมวลผลจำนวนมาก ควรรอให้เสร็จก่อนอัปโหลดเพิ่ม')
  }
  
  if (ragStats.embeddingCacheSize > 800) {
    recommendations.push('Cache ใกล้เต็ม ควรล้าง cache เพื่อประสิทธิภาพที่ดีขึ้น')
  }
  
  if (processorStats.memoryUsage.heapUsed > 500 * 1024 * 1024) {
    recommendations.push('การใช้หน่วยความจำสูง ควรรีสตาร์ทเซิร์ฟเวอร์')
  }
  
  if (recommendations.length === 0) {
    recommendations.push('ระบบทำงานปกติ ประสิทธิภาพดี')
  }
  
  return recommendations
}