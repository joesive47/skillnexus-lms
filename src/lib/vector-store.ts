import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface KnowledgeChunk {
  id: string
  content: string
  documentName: string
  embedding?: number[]
}

export class VectorStore {
  // สร้าง embedding จาก text (ใช้ OpenAI หรือ local model)
  async createEmbedding(text: string): Promise<number[]> {
    // ใช้ OpenAI Embeddings API
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: text,
        model: 'text-embedding-3-small'
      })
    })
    
    const data = await response.json()
    return data.data[0].embedding
  }

  // คำนวณ cosine similarity
  cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0)
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))
    return dotProduct / (magnitudeA * magnitudeB)
  }

  // ค้นหา knowledge chunks ที่เกี่ยวข้อง
  async searchSimilar(query: string, limit: number = 3): Promise<KnowledgeChunk[]> {
    const queryEmbedding = await this.createEmbedding(query)
    
    // ดึงข้อมูลจาก database (สมมติว่ามี table knowledge_chunks)
    const chunks = await prisma.knowledgeChunk.findMany({
      select: {
        id: true,
        content: true,
        documentName: true,
        embedding: true
      }
    })

    // คำนวณ similarity และเรียงลำดับ
    const results = chunks
      .filter(chunk => chunk.embedding)
      .map(chunk => {
        const embedding = chunk.embedding ? JSON.parse(chunk.embedding) : undefined
        return {
          id: chunk.id,
          content: chunk.content,
          documentName: chunk.documentName,
          embedding,
          similarity: embedding ? this.cosineSimilarity(queryEmbedding, embedding) : 0
        }
      })
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .map(({ similarity, ...chunk }) => chunk)

    return results
  }

  // บันทึก knowledge base จาก JSON
  async importKnowledgeBase(knowledgeData: any) {
    for (const item of knowledgeData.knowledge) {
      const embedding = await this.createEmbedding(item.content)
      
      await prisma.knowledgeChunk.upsert({
        where: { id: item.id },
        update: {
          content: item.content,
          documentName: item.documentName,
          embedding: JSON.stringify(embedding)
        },
        create: {
          id: item.id,
          content: item.content,
          documentName: item.documentName,
          embedding: JSON.stringify(embedding)
        }
      })
    }
  }
}