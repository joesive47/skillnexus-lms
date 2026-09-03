import { pipeline } from '@xenova/transformers'
import prisma from './prisma'

// Enhanced fuzzy matching functions
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null))
  
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      )
    }
  }
  
  return matrix[str2.length][str1.length]
}

function normalizeThaiText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\u0E00-\u0E7Fa-z0-9\s]/g, '') // เก็บเฉพาะไทย อังกฤษ ตัวเลข
    .replace(/\s+/g, ' ')
    .trim()
}

function extractKeywords(text: string): string[] {
  const normalized = normalizeThaiText(text)
  const words = normalized.split(' ').filter(word => word.length > 1)
  
  const stopWords = [
    'ที่', 'เป็น', 'ใน', 'ของ', 'และ', 'หรือ', 'กับ', 'จาก', 'ไป', 'มา', 'ได้', 'แล้ว', 'ครับ', 'ค่ะ', 'คือ',
    'อะไร', 'ไหม', 'บ้าง', 'นะ', 'นี้', 'นั้น', 'นี่', 'นั่น', 'อย่างไร', 'ทำไม', 'เมื่อไหร่', 'ระบบ', 'มี', 'ไม่',
    'the', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did',
    'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'what', 'how', 'when'
  ]
  return words.filter(word => !stopWords.includes(word))
}

function calculateFuzzySimilarity(str1: string, str2: string): number {
  const maxLength = Math.max(str1.length, str2.length)
  if (maxLength === 0) return 1
  
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase())
  return (maxLength - distance) / maxLength
}

function calculateKeywordMatch(query: string, text: string): number {
  const queryWords = extractKeywords(query)
  const textWords = extractKeywords(text)
  
  if (queryWords.length === 0) return 0
  
  let matches = 0
  for (const queryWord of queryWords) {
    for (const textWord of textWords) {
      // ตรวจสอบการตรงกันแบบต่างๆ
      if (textWord.includes(queryWord) || 
          queryWord.includes(textWord) || 
          calculateFuzzySimilarity(queryWord, textWord) > 0.7) {
        matches++
        break
      }
    }
  }
  
  return matches / queryWords.length
}

// Vector embedding functions
let embedder: any = null

async function getEmbedder() {
  if (!embedder) {
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
  }
  return embedder
}

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const model = await getEmbedder()
    const output = await model(text, { pooling: 'mean', normalize: true })
    return Array.from(output.data)
  } catch (error) {
    console.error('Embedding generation error:', error)
    return []
  }
}

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length === 0 || b.length === 0) return 0
  
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0)
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))
  
  if (magnitudeA === 0 || magnitudeB === 0) return 0
  return dotProduct / (magnitudeA * magnitudeB)
}

// Enhanced search function
export async function enhancedSearch(query: string, topK: number = 5) {
  try {
    // 1. ค้นหาจาก Knowledge Base ที่มี embedding
    const chunks = await prisma.documentChunk.findMany({
      where: { embedding: { not: null } },
      include: { document: true }
    })

    if (chunks.length === 0) {
      return { results: [], method: 'no_data' }
    }

    // 2. สร้าง embedding สำหรับ query
    const queryEmbedding = await generateEmbedding(query)
    
    // 3. คำนวณคะแนนจากหลายวิธี
    const results = chunks.map(chunk => {
      let semanticSimilarity = 0
      
      if (chunk.embedding && queryEmbedding.length > 0) {
        try {
          const chunkEmbedding = JSON.parse(chunk.embedding)
          semanticSimilarity = cosineSimilarity(queryEmbedding, chunkEmbedding)
        } catch (e) {
          console.error('Embedding parse error:', e)
        }
      }
      
      // คำนวณ text similarity
      const textSimilarity = calculateFuzzySimilarity(
        normalizeThaiText(query), 
        normalizeThaiText(chunk.content)
      )
      
      // คำนวณ keyword matching
      const keywordMatch = calculateKeywordMatch(query, chunk.content)
      
      // รวมคะแนนแบบถ่วงน้ำหนัก
      const combinedScore = (semanticSimilarity * 0.4) + (textSimilarity * 0.3) + (keywordMatch * 0.3)
      
      return {
        chunk,
        semanticSimilarity,
        textSimilarity,
        keywordMatch,
        combinedScore,
        content: chunk.content,
        source: chunk.document.filename
      }
    })

    // 4. เรียงลำดับและกรองผลลัพธ์
    const sortedResults = results
      .filter(r => r.combinedScore > 0.1) // threshold ต่ำเพื่อให้ตอบได้มากขึ้น
      .sort((a, b) => b.combinedScore - a.combinedScore)
      .slice(0, topK)

    return {
      results: sortedResults.map(r => ({
        content: r.content,
        similarity: r.combinedScore,
        source: r.source,
        scores: {
          semantic: r.semanticSimilarity,
          text: r.textSimilarity,
          keyword: r.keywordMatch
        }
      })),
      method: 'enhanced_search'
    }

  } catch (error) {
    console.error('Enhanced search error:', error)
    return { results: [], method: 'error' }
  }
}

// Fallback search for exact keyword matching
export async function fallbackKeywordSearch(query: string) {
  try {
    const keywords = extractKeywords(query)
    if (keywords.length === 0) return []

    const chunks = await prisma.documentChunk.findMany({
      where: {
        OR: keywords.map(keyword => ({
          content: {
            contains: keyword,
            mode: 'insensitive'
          }
        }))
      },
      include: { document: true }
    })

    return chunks.map(chunk => ({
      content: chunk.content,
      similarity: 0.5, // กำหนดคะแนนพื้นฐาน
      source: chunk.document.filename,
      scores: {
        semantic: 0,
        text: 0.5,
        keyword: 0.5
      }
    }))

  } catch (error) {
    console.error('Fallback search error:', error)
    return []
  }
}

// Main RAG response function
export async function generateEnhancedRAGResponse(question: string): Promise<string> {
  try {
    // 1. ลองค้นหาด้วยวิธีหลัก
    const searchResult = await enhancedSearch(question, 3)
    let relevantChunks = searchResult.results

    // 2. ถ้าไม่พบผลลัพธ์ ใช้ fallback
    if (relevantChunks.length === 0) {
      relevantChunks = await fallbackKeywordSearch(question)
    }

    // 3. ถ้ายังไม่พบ ให้คำตอบทั่วไป
    if (relevantChunks.length === 0) {
      return `ขออภัย ไม่พบข้อมูลที่เกี่ยวข้องกับ "${question}" ในระบบ Knowledge Base

กรุณาลองถามเกี่ยวกับ:
• ฟีเจอร์ของ SkillNexus LMS
• ระบบความปลอดภัย
• การใช้งาน SCORM
• ระบบ Anti-Skip Video Player
• การนำเข้าแบบทดสอบจาก Excel`
    }

    // 4. สร้างคำตอบจากข้อมูลที่พบ
    const context = relevantChunks
      .map((chunk, i) => `[${i + 1}] ${chunk.content}`)
      .join('\n\n')

    const bestScore = Math.max(...relevantChunks.map(c => c.similarity))
    const confidenceLevel = bestScore > 0.7 ? 'สูง' : bestScore > 0.4 ? 'ปานกลาง' : 'ต่ำ'

    return `ตามข้อมูลที่พบ (ความเชื่อมั่น: ${confidenceLevel}):

${context}

📚 แหล่งข้อมูล: ${[...new Set(relevantChunks.map(c => c.source))].join(', ')}`

  } catch (error) {
    console.error('Enhanced RAG error:', error)
    return 'เกิดข้อผิดพลาดในการค้นหาข้อมูล กรุณาลองใหม่อีกครั้ง'
  }
}

// Import knowledge base with embeddings
export async function importKnowledgeWithEmbeddings(knowledgeData: any) {
  try {
    console.log('Starting knowledge import...')
    
    for (let index = 0; index < knowledgeData.knowledge.length; index++) {
      const item = knowledgeData.knowledge[index]
      console.log(`Processing: ${item.documentName}`)
      
      // สร้าง embedding
      const embedding = await generateEmbedding(item.content)
      
      // บันทึกลงฐานข้อมูล
      await prisma.documentChunk.upsert({
        where: { id: item.id },
        update: {
          content: item.content,
          embedding: JSON.stringify(embedding),
          metadata: JSON.stringify(item.metadata || {}),
          chunkIndex: index
        },
        create: {
          id: item.id,
          documentId: item.documentId,
          content: item.content,
          embedding: JSON.stringify(embedding),
          metadata: JSON.stringify(item.metadata || {}),
          chunkIndex: index,
          document: {
            connectOrCreate: {
              where: { id: item.documentId },
              create: {
                id: item.documentId,
                filename: item.documentName,
                fileType: 'docx',
                status: 'completed',
                totalChunks: knowledgeData.knowledge.filter((k: any) => k.documentId === item.documentId).length
              }
            }
          }
        }
      })
    }
    
    console.log('Knowledge import completed')
    return true
    
  } catch (error) {
    console.error('Import error:', error)
    return false
  }
}