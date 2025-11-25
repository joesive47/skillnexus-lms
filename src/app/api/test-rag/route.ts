import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing RAG system...')
    
    // Test database connection
    const documentCount = await prisma.ragDocument.count()
    const chunkCount = await prisma.ragChunk.count()
    
    // Test environment variables
    const envVars = {
      RAG_CHUNK_SIZE: process.env.RAG_CHUNK_SIZE,
      RAG_CHUNK_OVERLAP: process.env.RAG_CHUNK_OVERLAP,
      RAG_MAX_RESULTS: process.env.RAG_MAX_RESULTS,
      RAG_FAST_MODE: process.env.RAG_FAST_MODE,
      NODE_ENV: process.env.NODE_ENV
    }
    
    // Test recent documents
    const recentDocs = await prisma.ragDocument.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        filename: true,
        status: true,
        totalChunks: true,
        errorMessage: true,
        createdAt: true
      }
    })
    
    return NextResponse.json({
      success: true,
      system: {
        documentCount,
        chunkCount,
        envVars,
        recentDocs
      },
      message: 'RAG system test completed'
    })
    
  } catch (error) {
    console.error('❌ RAG test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}