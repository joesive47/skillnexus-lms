import { VectorStore } from './vector-store'

export class SkillNexusChatbot {
  private vectorStore: VectorStore

  constructor() {
    this.vectorStore = new VectorStore()
  }

  async generateResponse(userQuery: string): Promise<string> {
    try {
      // 1. ค้นหา relevant knowledge chunks
      const relevantChunks = await this.vectorStore.searchSimilar(userQuery, 3)
      
      if (relevantChunks.length === 0) {
        return "ขออภัย ฉันไม่พบข้อมูลที่เกี่ยวข้องกับคำถามของคุณ กรุณาลองถามคำถามอื่น"
      }

      // 2. สร้าง context จาก relevant chunks
      const context = relevantChunks
        .map(chunk => `เอกสาร: ${chunk.documentName}\nเนื้อหา: ${chunk.content}`)
        .join('\n\n---\n\n')

      // 3. สร้าง prompt สำหรับ LLM
      const prompt = `
คุณเป็น AI Assistant สำหรับ SkillNexus LMS ตอบคำถามโดยใช้ข้อมูลจาก Knowledge Base เท่านั้น

ข้อมูลที่เกี่ยวข้อง:
${context}

คำถามของผู้ใช้: ${userQuery}

กรุณาตอบคำถามโดย:
- ใช้ข้อมูลจาก Knowledge Base เท่านั้น
- ตอบเป็นภาษาไทยที่เข้าใจง่าย
- หากไม่มีข้อมูลที่เกี่ยวข้อง ให้บอกว่าไม่พบข้อมูล
- ให้คำตอบที่ชัดเจนและเป็นประโยชน์

คำตอบ:`

      // 4. เรียก LLM API (OpenAI GPT)
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'คุณเป็น AI Assistant สำหรับ SkillNexus LMS ตอบคำถามจาก Knowledge Base เท่านั้น'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.3
        })
      })

      const data = await response.json()
      return data.choices[0].message.content

    } catch (error) {
      console.error('Chatbot error:', error)
      return "เกิดข้อผิดพลาดในการประมวลผล กรุณาลองใหม่อีกครั้ง"
    }
  }

  // ฟังก์ชันสำหรับ import knowledge base
  async importKnowledge(knowledgeData: any) {
    await this.vectorStore.importKnowledgeBase(knowledgeData)
  }
}