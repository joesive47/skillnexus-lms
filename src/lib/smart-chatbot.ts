import { enhancedSearch, generateEnhancedRAGResponse, importKnowledgeWithEmbeddings } from './enhanced-rag-service'
import prisma from './prisma'

export class SmartChatbot {
  private fallbackResponses = {
    greeting: [
      'สวัสดีครับ! ผมเป็น AI Assistant ของ SkillNexus LMS พร้อมช่วยตอบคำถามเกี่ยวกับระบบการเรียนรู้ของเรา',
      'ยินดีต้อนรับสู่ SkillNexus LMS! มีอะไรให้ช่วยเหลือไหมครับ?'
    ],
    features: [
      'SkillNexus LMS มีฟีเจอร์หลัก: Anti-Skip Video Player, SCORM Support, Excel Quiz Importer, AI Recommendations, PWA, Real-time Analytics',
      'ระบบของเรามี: ระบบป้องกันการข้ามวิดีโอ, รองรับ SCORM, นำเข้าแบบทดสอบจาก Excel, แนะนำหลักสูตรด้วย AI'
    ],
    security: [
      'SkillNexus LMS ใช้ NextAuth.js v5, Enhanced Security Headers, Multi-layer Caching เพื่อความปลอดภัยสูงสุด',
      'ระบบความปลอดภัยของเรารวม: การยืนยันตัวตนที่ปลอดภัย, HTTP Security Headers, ระบบแคชหลายชั้น'
    ]
  }

  // ตรวจสอบประเภทคำถาม
  private detectQuestionType(query: string): string {
    const normalizedQuery = query.toLowerCase()
    
    if (this.matchesPattern(normalizedQuery, ['สวัสดี', 'หวัดดี', 'hello', 'hi'])) {
      return 'greeting'
    }
    
    if (this.matchesPattern(normalizedQuery, ['ฟีเจอร์', 'คุณสมบัติ', 'ความสามารถ', 'features', 'มีอะไรบ้าง'])) {
      return 'features'
    }
    
    if (this.matchesPattern(normalizedQuery, ['ความปลอดภัย', 'security', 'ปลอดภัย', 'มั่นคง'])) {
      return 'security'
    }
    
    return 'general'
  }

  private matchesPattern(text: string, patterns: string[]): boolean {
    return patterns.some(pattern => text.includes(pattern))
  }

  // สร้างคำตอบแบบสุ่มจาก fallback
  private getRandomFallback(type: string): string {
    const responses = this.fallbackResponses[type as keyof typeof this.fallbackResponses]
    if (!responses) return ''
    
    return responses[Math.floor(Math.random() * responses.length)]
  }

  // ปรับปรุงคำถามที่พิมพ์ผิด
  private correctTypos(query: string): string {
    const corrections: Record<string, string> = {
      // คำผิดทั่วไป
      'สกิลเน็กซัส': 'SkillNexus',
      'สกิลเนกซัส': 'SkillNexus', 
      'สกิลเน็กซุส': 'SkillNexus',
      'เอลเอ็มเอส': 'LMS',
      'แอลเอ็มเอส': 'LMS',
      'สคอร์ม': 'SCORM',
      'สคอม': 'SCORM',
      'วิดีโอ': 'วิดีโอ',
      'วีดีโอ': 'วิดีโอ',
      'วีดิโอ': 'วิดีโอ',
      // ฟีเจอร์ที่พิมพ์ผิด
      'แอนตี้สกิป': 'Anti-Skip',
      'แอนตี้สกิบ': 'Anti-Skip',
      'แอนติสกิป': 'Anti-Skip',
      'พีดับเบิลยูเอ': 'PWA',
      'พีดับยูเอ': 'PWA',
      'เอไอ': 'AI',
      'เอ.ไอ.': 'AI'
    }

    let corrected = query
    for (const [wrong, right] of Object.entries(corrections)) {
      corrected = corrected.replace(new RegExp(wrong, 'gi'), right)
    }
    
    return corrected
  }

  // ฟังก์ชันหลักสำหรับสร้างคำตอบ
  async generateResponse(userQuery: string): Promise<string> {
    try {
      // 1. แก้ไขคำพิมพ์ผิด
      const correctedQuery = this.correctTypos(userQuery.trim())
      
      // 2. ตรวจสอบประเภทคำถาม
      const questionType = this.detectQuestionType(correctedQuery)
      
      // 3. ลองใช้ RAG ก่อน
      const ragResponse = await generateEnhancedRAGResponse(correctedQuery)
      
      // 4. ถ้า RAG ให้คำตอบที่ดี ใช้เลย
      if (!ragResponse.includes('ไม่พบข้อมูลที่เกี่ยวข้อง')) {
        return ragResponse
      }
      
      // 5. ถ้า RAG ไม่ได้ผล ใช้ fallback ตามประเภทคำถาม
      if (questionType !== 'general') {
        const fallbackResponse = this.getRandomFallback(questionType)
        if (fallbackResponse) {
          return `${fallbackResponse}\n\n💡 หากต้องการข้อมูลเพิ่มเติม กรุณาถามคำถามที่เฉพาะเจาะจงมากขึ้น`
        }
      }
      
      // 6. คำตอบสุดท้ายถ้าไม่มีอะไรตรงเลย
      return this.getGeneralHelpResponse(correctedQuery)
      
    } catch (error) {
      console.error('Chatbot error:', error)
      return 'เกิดข้อผิดพลาดในการประมวลผล กรุณาลองใหม่อีกครั้ง 🔄'
    }
  }

  private getGeneralHelpResponse(query: string): string {
    return `ขออภัย ไม่พบข้อมูลที่ตรงกับ "${query}" ในระบบ

🎯 **คำถามที่แนะนำ:**
• "SkillNexus LMS มีฟีเจอร์อะไรบ้าง?"
• "ระบบ Anti-Skip Video Player คืออะไร?"
• "รองรับ SCORM ไหม?"
• "นำเข้าแบบทดสอบจาก Excel ได้ไหม?"
• "ระบบความปลอดภัยเป็นอย่างไร?"
• "PWA คืออะไร?"

💬 **เคล็ดลับ:** ลองใช้คำสำคัญที่ชัดเจน เช่น "ฟีเจอร์", "ความปลอดภัย", "SCORM" เป็นต้น`
  }

  // ฟังก์ชันสำหรับ import knowledge base
  async importKnowledge(knowledgeData: any): Promise<boolean> {
    try {
      console.log('Importing knowledge base...')
      
      // ใช้ฟังก์ชันใหม่ที่มี embedding
      const success = await importKnowledgeWithEmbeddings(knowledgeData)
      
      if (success) {
        console.log('Knowledge base imported successfully')
        return true
      } else {
        console.error('Failed to import knowledge base')
        return false
      }
      
    } catch (error) {
      console.error('Import knowledge error:', error)
      return false
    }
  }

  // ฟังก์ชันสำหรับทดสอบระบบ
  async testSystem(): Promise<{ status: string, details: any }> {
    try {
      // ทดสอบการเชื่อมต่อฐานข้อมูล
      const chunkCount = await prisma.documentChunk.count()
      
      // ทดสอบการค้นหา
      const testQuery = "SkillNexus LMS มีฟีเจอร์อะไรบ้าง"
      const searchResult = await enhancedSearch(testQuery, 2)
      
      return {
        status: 'healthy',
        details: {
          totalChunks: chunkCount,
          searchResults: searchResult.results.length,
          searchMethod: searchResult.method,
          timestamp: new Date().toISOString()
        }
      }
      
    } catch (error) {
      return {
        status: 'error',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        }
      }
    }
  }
}