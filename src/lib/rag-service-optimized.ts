import { prisma } from './prisma'

interface RagResult {
  content: string
  filename: string
  score: number
  chunkIndex: number
}

export async function ragSearch(query: string, maxResults: number = 3): Promise<RagResult[]> {
  try {
    // ค้นหาแบบ keyword matching (เนื่องจากไม่มี vector embedding)
    const keywords = extractKeywords(query)
    
    const chunks = await prisma.documentChunk.findMany({
      where: {
        OR: [
          { content: { contains: query } },
          ...keywords.map(keyword => ({
            content: { contains: keyword }
          }))
        ]
      },
      include: {
        document: {
          select: {
            filename: true,
            status: true
          }
        }
      },
      take: maxResults * 2 // ดึงมากกว่าเพื่อให้มีตัวเลือกในการ score
    })

    // คำนวณคะแนนความเกี่ยวข้อง
    const scoredResults = chunks
      .filter(chunk => chunk.document?.status === 'completed')
      .map(chunk => ({
        content: chunk.content,
        filename: chunk.document?.filename || 'Unknown',
        chunkIndex: chunk.chunkIndex,
        score: calculateRelevanceScore(query, chunk.content, keywords)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults)

    return scoredResults

  } catch (error) {
    console.error('RAG search error:', error)
    return []
  }
}

function extractKeywords(text: string): string[] {
  // ลบ stopwords และสกัดคำสำคัญ
  const stopwords = ['และ', 'หรือ', 'แต่', 'เพราะ', 'ที่', 'ใน', 'บน', 'กับ', 'จาก', 'ไป', 'มา', 'ได้', 'เป็น', 'คือ', 'มี', 'ไม่', 'จะ', 'ก็', 'ของ', 'ให้', 'แล้ว', 'นี้', 'นั้น']
  
  return text
    .toLowerCase()
    .replace(/[^\u0E00-\u0E7Fa-zA-Z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopwords.includes(word))
    .slice(0, 5) // เอาแค่ 5 คำสำคัญ
}

function calculateRelevanceScore(query: string, content: string, keywords: string[]): number {
  let score = 0
  const lowerQuery = query.toLowerCase()
  const lowerContent = content.toLowerCase()

  // คะแนนจากการตรงกันของ query ทั้งหมด
  if (lowerContent.includes(lowerQuery)) {
    score += 10
  }

  // คะแนนจากคำสำคัญ
  keywords.forEach(keyword => {
    const matches = (lowerContent.match(new RegExp(keyword, 'g')) || []).length
    score += matches * 2
  })

  // คะแนนจากความยาวของเนื้อหา (เนื้อหาสั้นๆ ที่ตรงจุดได้คะแนนสูงกว่า)
  if (content.length < 500) {
    score += 1
  }

  return score
}

export async function getDocumentStats() {
  try {
    const stats = await prisma.document.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    })

    const totalChunks = await prisma.documentChunk.count()

    return {
      documents: stats,
      totalChunks
    }
  } catch (error) {
    console.error('Error getting document stats:', error)
    return { documents: [], totalChunks: 0 }
  }
}