import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { findBestMatch, calculateSimilarity, normalizeText } from '@/lib/fuzzy-matching'
import { AccessError, publicError, requireUser } from '@/lib/access-control'

export async function POST(request: NextRequest) {
  try {
    await requireUser()
    const { question } = await request.json()

    if (typeof question !== 'string' || !question.trim() || question.length > 1000) {
      return NextResponse.json({ 
        error: 'Question is required' 
      }, { status: 400 })
    }

    // Search in knowledge chunks first
    const knowledgeResults = await searchKnowledgeChunks(question)
    
    if (knowledgeResults.length > 0) {
      const bestMatch = knowledgeResults[0]
      const confidence = Math.round(bestMatch.similarity * 100)
      
      return NextResponse.json({
        success: true,
        response: bestMatch.content,
        confidence,
        source: bestMatch.documentName,
        type: 'knowledge_base'
      })
    }

    // Fallback to chat knowledge base
    const chatResult = await searchChatKnowledgeBase(question)
    
    if (chatResult) {
      return NextResponse.json({
        success: true,
        response: chatResult.match.answer,
        confidence: Math.round(chatResult.score * 100),
        source: 'Chat Knowledge Base',
        type: 'chat_kb'
      })
    }

    return NextResponse.json({
      success: true,
      response: 'ขออภัยครับ ไม่พบข้อมูลที่เกี่ยวข้องกับคำถามของคุณ กรุณาลองถามในหัวข้ออื่น หรือติดต่อทีมสนับสนุนเพื่อขอความช่วยเหลือเพิ่มเติม',
      confidence: 0,
      source: 'Default Response',
      type: 'fallback'
    })

  } catch (error) {
    console.error('❌ Knowledge search error:', error)
    return NextResponse.json({ 
      error: publicError(error)
    }, { status: error instanceof AccessError ? error.status : 500 })
  }
}

async function searchKnowledgeChunks(query: string) {
  try {
    const chunks = await prisma.knowledgeChunk.findMany({
      take: 500,
      select: {
        id: true,
        content: true,
        documentName: true
      }
    })

    if (chunks.length === 0) return []

    const normalizedQuery = normalizeText(query)
    const results = []

    for (const chunk of chunks) {
      const normalizedContent = normalizeText(chunk.content)
      const similarity = calculateSimilarity(normalizedQuery, normalizedContent)
      
      if (similarity > 0.3) {
        results.push({
          ...chunk,
          similarity
        })
      }
    }

    return results.sort((a, b) => b.similarity - a.similarity).slice(0, 3)
  } catch (error) {
    console.error('❌ Knowledge chunk search error:', error)
    return []
  }
}

async function searchChatKnowledgeBase(query: string) {
  try {
    const questions = await prisma.chatKnowledgeBase.findMany({
      where: { isActive: true },
      take: 500,
      select: { question: true, answer: true }
    })

    if (questions.length === 0) return null

    return findBestMatch(query, questions)
  } catch (error) {
    console.error('❌ Chat KB search error:', error)
    return null
  }
}
