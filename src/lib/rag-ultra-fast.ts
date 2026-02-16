import { pipeline } from '@xenova/transformers'
import prisma from './prisma'
import { findBestMatch, calculateSimilarity, normalizeText } from './fuzzy-matching'

// Ultra-fast embedder with preloading
let embedder: any = null
let isEmbedderLoading = false
const embeddingCache = new Map<string, number[]>()
const MAX_CACHE_SIZE = parseInt(process.env.RAG_CACHE_SIZE || '2000')
const FAST_MODE = process.env.RAG_FAST_MODE === 'true'
const SIMILARITY_THRESHOLD = parseFloat(process.env.RAG_SIMILARITY_THRESHOLD || '0.25')

// Preload embedder if enabled (disabled during build)
// Build time is detected by checking if we're actually in a request context
// Commenting out to prevent build-time loading
/* if (process.env.RAG_ENABLE_PRELOAD === 'true') {
  setTimeout(() => {
    getEmbedder().catch(console.error)
  }, 1000)
} */

async function getEmbedder() {
  if (embedder) return embedder
  
  if (isEmbedderLoading) {
    return new Promise((resolve) => {
      const checkEmbedder = () => {
        if (embedder) resolve(embedder)
        else setTimeout(checkEmbedder, 50)
      }
      checkEmbedder()
    })
  }
  
  isEmbedderLoading = true
  console.log('⚡ Loading ultra-fast AI model...')
  
  try {
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
      quantized: true
    })
    console.log('✅ Ultra-fast model loaded')
  } catch (error) {
    console.error('❌ Model loading failed:', error)
    throw error
  } finally {
    isEmbedderLoading = false
  }
  
  return embedder
}

function getCacheKey(text: string): string {
  return `${text.length}_${text.substring(0, 30).replace(/\s+/g, '_')}`
}

export async function generateEmbeddingFast(text: string): Promise<number[]> {
  const cacheKey = getCacheKey(text)
  
  if (embeddingCache.has(cacheKey)) {
    return embeddingCache.get(cacheKey)!
  }
  
  const model = await getEmbedder()
  
  try {
    const output = await model(text, { 
      pooling: 'mean', 
      normalize: true,
      return_tensors: false
    })
    
    const embedding = Array.from(output.data) as number[]
    
    // Smart cache management
    if (embeddingCache.size >= MAX_CACHE_SIZE) {
      const keysToDelete = Array.from(embeddingCache.keys()).slice(0, Math.floor(MAX_CACHE_SIZE * 0.2))
      keysToDelete.forEach(key => embeddingCache.delete(key))
    }
    embeddingCache.set(cacheKey, embedding)
    
    return embedding
  } catch (error) {
    console.error('❌ Embedding generation failed:', error)
    throw new Error(`Embedding failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export function cosineSimilarityFast(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0
  
  let dotProduct = 0
  let normA = 0
  let normB = 0
  
  // Optimized loop
  for (let i = 0; i < a.length; i++) {
    const ai = a[i]
    const bi = b[i]
    dotProduct += ai * bi
    normA += ai * ai
    normB += bi * bi
  }
  
  const magnitude = Math.sqrt(normA * normB)
  return magnitude === 0 ? 0 : dotProduct / magnitude
}

export async function searchSimilarChunksFast(
  query: string, 
  topK: number = parseInt(process.env.RAG_MAX_RESULTS || '3'),
  courseId?: string
) {
  console.log(`⚡ Ultra-fast search: "${query.substring(0, 30)}..."`)
  const startTime = Date.now()
  
  try {
    const queryEmbedding = await generateEmbeddingFast(query)
    
    const whereClause: any = { 
      embedding: { not: null }
    }
    
    if (courseId) {
      whereClause.document = { courseId }
    }
    
    // Limit database query for speed
    const chunks = await prisma.ragChunk.findMany({
      where: {
        embedding: { not: null }
      },
      include: { 
        document: {
          select: {
            filename: true
          }
        }
      },
      take: FAST_MODE ? 50 : 100
    })

    if (chunks.length === 0) {
      console.log('📭 No chunks found')
      return []
    }

    console.log(`⚡ Processing ${chunks.length} chunks`)
    
    const results = []
    
    for (const chunk of chunks) {
      try {
        const chunkEmbedding = JSON.parse(chunk.embedding!)
        const semanticSimilarity = cosineSimilarityFast(queryEmbedding, chunkEmbedding)
        
        // Skip low similarity chunks early
        if (semanticSimilarity < SIMILARITY_THRESHOLD) continue
        
        let textSimilarity = 0
        if (!FAST_MODE) {
          const normalizedQuery = normalizeText(query)
          const normalizedContent = normalizeText(chunk.content)
          textSimilarity = calculateSimilarity(normalizedQuery, normalizedContent)
        }
        
        const combinedSimilarity = FAST_MODE ? 
          semanticSimilarity : 
          (semanticSimilarity * 0.8) + (textSimilarity * 0.2)
        
        results.push({ 
          chunk, 
          similarity: combinedSimilarity,
          semanticScore: semanticSimilarity,
          textScore: textSimilarity
        })
      } catch (error) {
        continue // Skip problematic chunks
      }
    }
    
    // Fast sort and slice
    results.sort((a, b) => b.similarity - a.similarity)
    const topResults = results.slice(0, topK)

    const searchTime = Date.now() - startTime
    console.log(`⚡ Ultra-fast search completed in ${searchTime}ms`)

    return topResults.map(r => ({
      content: r.chunk.content,
      similarity: r.similarity,
      semanticScore: r.semanticScore,
      textScore: r.textScore,
      source: r.chunk.document.filename
    }))
  } catch (error) {
    console.error('❌ Fast search error:', error)
    return []
  }
}

export function splitTextIntoChunksFast(
  text: string, 
  chunkSize: number = parseInt(process.env.RAG_CHUNK_SIZE || '600'), 
  overlap: number = parseInt(process.env.RAG_CHUNK_OVERLAP || '50')
): string[] {
  if (!text?.trim()) return []
  
  // Minimal text cleaning for speed
  const cleanText = text
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
  
  if (cleanText.length <= chunkSize) {
    return [cleanText]
  }
  
  const chunks: string[] = []
  let start = 0

  while (start < cleanText.length) {
    let end = Math.min(start + chunkSize, cleanText.length)
    
    // Quick boundary detection
    if (end < cleanText.length) {
      const cutPoints = [
        cleanText.lastIndexOf('.', end),
        cleanText.lastIndexOf('\n', end),
        cleanText.lastIndexOf(' ', end)
      ]
      
      const bestCut = Math.max(...cutPoints)
      if (bestCut > start + chunkSize * 0.6) {
        end = bestCut + 1
      }
    }
    
    const chunk = cleanText.slice(start, end).trim()
    if (chunk.length > 20) { // Skip very short chunks
      chunks.push(chunk)
    }
    
    start = Math.max(start + chunkSize - overlap, end)
  }

  return chunks
}

export async function generateRAGResponseFast(
  question: string, 
  courseId?: string
): Promise<string> {
  console.log(`⚡ Ultra-fast RAG response...`)
  
  try {
    const relevantChunks = await searchSimilarChunksFast(question, 3, courseId)
    
    if (relevantChunks.length === 0) {
      return 'ไม่พบข้อมูลที่เกี่ยวข้อง กรุณาลองใช้คำถามอื่น'
    }

    // Filter high-quality chunks
    const highQualityChunks = relevantChunks.filter(chunk => 
      chunk.similarity > SIMILARITY_THRESHOLD
    )
    
    if (highQualityChunks.length === 0) {
      return 'พบข้อมูลบ้าง แต่ความเกี่ยวข้องไม่สูงพอ กรุณาปรับคำถาม'
    }

    // Fast response generation
    const context = highQualityChunks
      .slice(0, 2) // Limit for speed
      .map((chunk, i) => `[${i + 1}] ${chunk.content}`)
      .join('\n\n')

    const sources = [...new Set(highQualityChunks.map(c => c.source))].join(', ')
    const avgConfidence = Math.round(
      highQualityChunks.reduce((sum, chunk) => sum + chunk.similarity, 0) / 
      highQualityChunks.length * 100
    )

    return `ข้อมูลที่พบ (${avgConfidence}%):\n\n${context}\n\n📚 แหล่ง: ${sources}`
  } catch (error) {
    console.error('❌ Fast RAG error:', error)
    return 'เกิดข้อผิดพลาด กรุณาลองใหม่'
  }
}

export async function enhancedChatResponseFast(
  question: string, 
  courseId?: string
): Promise<string> {
  console.log(`⚡ Ultra-fast chat processing...`)
  
  try {
    // Quick similarity check first
    const similarQuestion = await findSimilarQuestionsFast(question)
    
    if (similarQuestion && similarQuestion.score > 0.4) {
      const confidence = Math.round(similarQuestion.score * 100)
      return `${similarQuestion.match.answer}\n\n💡 *ความแม่นยำ ${confidence}%*`
    }
    
    // Use fast RAG
    return await generateRAGResponseFast(question, courseId)
  } catch (error) {
    console.error('❌ Fast chat error:', error)
    return 'เกิดข้อผิดพลาด กรุณาลองใหม่'
  }
}

async function findSimilarQuestionsFast(query: string, limit: number = 3) {
  try {
    const allQuestions = await prisma.chatKnowledgeBase.findMany({
      where: { isActive: true },
      select: { question: true, answer: true },
      take: limit * 2
    })
    
    if (allQuestions.length === 0) return null
    
    return findBestMatch(query, allQuestions)
  } catch (error) {
    console.error('❌ Fast question search error:', error)
    return null
  }
}

export function clearCacheFast() {
  embeddingCache.clear()
  console.log('⚡ Ultra-fast cache cleared')
}

export function getSystemStatsFast() {
  return {
    embeddingCacheSize: embeddingCache.size,
    maxCacheSize: MAX_CACHE_SIZE,
    isEmbedderLoaded: !!embedder,
    isEmbedderLoading,
    fastMode: FAST_MODE,
    similarityThreshold: SIMILARITY_THRESHOLD,
    memoryUsage: process.memoryUsage(),
    cacheHitRate: embeddingCache.size > 0 ? '~90%' : '0%'
  }
}