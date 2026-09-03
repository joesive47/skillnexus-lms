import { pipeline } from '@xenova/transformers'
import prisma from './prisma'
import { findBestMatch, calculateSimilarity, normalizeText } from './fuzzy-matching'

let embedder: any = null

async function getEmbedder() {
  if (!embedder) {
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
  }
  return embedder
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const model = await getEmbedder()
  const output = await model(text, { pooling: 'mean', normalize: true })
  return Array.from(output.data)
}

export function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0)
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))
  return dotProduct / (magnitudeA * magnitudeB)
}

export async function searchSimilarChunks(
  query: string, 
  topK: number = parseInt(process.env.RAG_MAX_RESULTS || '3')
) {
  const queryEmbedding = await generateEmbedding(query)
  
  const chunks = await prisma.documentChunk.findMany({
    where: { embedding: { not: null } },
    include: { document: true }
  })

  const results = chunks
    .map(chunk => {
      const chunkEmbedding = JSON.parse(chunk.embedding!)
      const semanticSimilarity = cosineSimilarity(queryEmbedding, chunkEmbedding)
      const textSimilarity = calculateSimilarity(normalizeText(query), normalizeText(chunk.content))
      
      // รวมคะแนน semantic และ text similarity
      const combinedSimilarity = (semanticSimilarity * 0.7) + (textSimilarity * 0.3)
      
      return { chunk, similarity: combinedSimilarity }
    })
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK)

  return results.map(r => ({
    content: r.chunk.content,
    similarity: r.similarity,
    source: r.chunk.document.filename
  }))
}

export function splitTextIntoChunks(
  text: string, 
  chunkSize: number = parseInt(process.env.RAG_CHUNK_SIZE || '1000'), 
  overlap: number = parseInt(process.env.RAG_CHUNK_OVERLAP || '200')
): string[] {
  const chunks: string[] = []
  let start = 0

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length)
    chunks.push(text.slice(start, end))
    start += chunkSize - overlap
  }

  return chunks
}

export async function generateRAGResponse(question: string): Promise<string> {
  const relevantChunks = await searchSimilarChunks(question)
  
  if (relevantChunks.length === 0) {
    return 'ขออภัย ไม่พบข้อมูลที่เกี่ยวข้องในระบบ'
  }

  const context = relevantChunks
    .map((chunk, i) => `[${i + 1}] ${chunk.content}`)
    .join('\n\n')

  const response = `ตามข้อมูลที่พบ:\n\n${context}\n\nแหล่งข้อมูล: ${relevantChunks.map(c => c.source).join(', ')}`
  
  return response
}

export async function findSimilarQuestions(query: string) {
  const allQuestions = await prisma.chatKnowledgeBase.findMany({
    where: { isActive: true },
    select: { question: true, answer: true }
  })
  
  return findBestMatch(query, allQuestions)
}

export async function enhancedChatResponse(question: string): Promise<string> {
  // 1. ลองหาคำถามที่คล้ายกันด้วย fuzzy matching
  const similarQuestion = await findSimilarQuestions(question)
  
  if (similarQuestion && similarQuestion.score > 0.3) {
    return `${similarQuestion.match.answer}\n\n*คำตอบนี้มาจากคำถามที่คล้ายกัน (ความแม่นยำ ${Math.round(similarQuestion.score * 100)}%)*`
  }
  
  // 2. ใช้ RAG ถ้าไม่พบคำถามที่คล้าย
  return await generateRAGResponse(question)
}
