// Smart response system ที่รวม fuzzy matching, context awareness และ fallback
import { findBestMatch, extractKeywords, normalizeText, calculateSimilarity } from './fuzzy-matching'
import { enhancedChatResponse } from './rag-service'
import prisma from './prisma'

interface ResponseContext {
  previousMessages?: string[]
  userProfile?: any
  sessionData?: any
}

export class SmartChatbot {
  private fallbackResponses = [
    'ขออภัยครับ ผมไม่เข้าใจคำถามนี้ดี กรุณาลองถามใหม่ด้วยคำที่ง่ายกว่านี้',
    'คำถามนี้ยากสำหรับผมครับ ลองถามเกี่ยวกับหลักสูตร ราคา หรือใบประกาศนียบัตรดูไหมครับ',
    'ผมยังไม่เข้าใจคำถามนี้ครับ ช่วยอธิบายเพิ่มเติมหรือใช้คำอื่นได้ไหมครับ'
  ]

  private commonTopics = {
    'ราคา': ['ราคา', 'ค่าใช้จ่าย', 'เงิน', 'ฟรี', 'แพง', 'ถูก', 'cost', 'price'],
    'หลักสูตร': ['หลักสูตร', 'คอร์ส', 'เรียน', 'course', 'class'],
    'ใบประกาศนียบัตร': ['ใบประกาศนียบัตร', 'เซอร์', 'certificate', 'cert'],
    'เวลา': ['เวลา', 'นาน', 'ระยะเวลา', 'duration', 'time'],
    'ออนไลน์': ['ออนไลน์', 'online', 'เน็ต', 'internet'],
    'SCORM': ['scorm', 'สกอร์ม', 'มาตรฐาน', 'เนื้อหา'],
    'PWA': ['pwa', 'progressive', 'web', 'app', 'แอป', 'ออฟไลน์', 'offline']
  }

  async generateResponse(message: string, context?: ResponseContext): Promise<string> {
    try {
      // 1. ทำความสะอาดข้อความ
      const cleanMessage = normalizeText(message)
      
      // 2. ตรวจสอบ context จากข้อความก่อนหน้า
      const contextualMessage = this.addContext(cleanMessage, context)
      
      // 3. ลองหาคำตอบจาก Knowledge Base ก่อน (ความแม่นยำสูง)
      const directMatch = await this.findDirectMatch(cleanMessage)
      if (directMatch) {
        return directMatch
      }
      
      // 4. ลองหาคำตอบด้วย enhanced response (RAG)
      const response = await enhancedChatResponse(contextualMessage)
      
      // 5. ถ้าไม่พบคำตอบ ลองใช้ topic matching
      if (response.includes('ไม่พบข้อมูลที่เกี่ยวข้อง')) {
        const topicResponse = await this.findTopicBasedResponse(cleanMessage)
        if (topicResponse) return topicResponse
      }
      
      // 6. ถ้ายังไม่พบ ใช้ fallback
      if (response.includes('ไม่พบข้อมูลที่เกี่ยวข้อง')) {
        return this.getFallbackResponse(cleanMessage)
      }
      
      return response
      
    } catch (error) {
      console.error('Smart chatbot error:', error)
      return 'เกิดข้อผิดพลาดครับ กรุณาลองใหม่อีกครั้ง'
    }
  }

  private addContext(message: string, context?: ResponseContext): string {
    if (!context?.previousMessages?.length) return message
    
    // เพิ่ม context จากข้อความก่อนหน้า
    const recentContext = context.previousMessages.slice(-2).join(' ')
    const keywords = extractKeywords(recentContext)
    
    if (keywords.length > 0) {
      return `${message} (บริบท: ${keywords.join(' ')})`
    }
    
    return message
  }

  private async findTopicBasedResponse(message: string): Promise<string | null> {
    const keywords = extractKeywords(message)
    
    for (const [topic, topicKeywords] of Object.entries(this.commonTopics)) {
      const hasTopicKeyword = keywords.some(keyword => 
        topicKeywords.some(topicWord => 
          keyword.includes(topicWord) || topicWord.includes(keyword)
        )
      )
      
      if (hasTopicKeyword) {
        const topicQuestions = await prisma.chatKnowledgeBase.findMany({
          where: {
            OR: topicKeywords.map(word => ({
              question: { contains: word }
            })),
            isActive: true
          }
        })
        
        if (topicQuestions.length > 0) {
          const bestMatch = findBestMatch(message, topicQuestions)
          if (bestMatch && bestMatch.score > 0.2) {
            return `${bestMatch.match.answer}\n\n*คำตอบนี้มาจากหัวข้อ "${topic}" ที่เกี่ยวข้อง*`
          }
        }
      }
    }
    
    return null
  }

  private async findDirectMatch(message: string): Promise<string | null> {
    try {
      // ค้นหาคำตอบที่ตรงกันโดยตรงจาก Knowledge Base
      const knowledgeEntries = await prisma.chatKnowledgeBase.findMany({
        where: { isActive: true }
      })
      
      // ใช้ fuzzy matching หาคำถามที่คล้ายกัน
      const bestMatch = findBestMatch(message, knowledgeEntries)
      
      if (bestMatch && bestMatch.score > 0.5) {
        return `${bestMatch.match.answer}\n\n*ความแม่นยำ: ${Math.round(bestMatch.score * 100)}%*`
      }
      
      // ลองค้นหาด้วย keywords แบบเข้มงวดขึ้น
      const keywords = extractKeywords(message.toLowerCase())
      
      for (const keyword of keywords) {
        // ค้นหาแบบตรงกันมากขึ้น
        const keywordMatch = knowledgeEntries.find(entry => {
          const questionKeywords = extractKeywords(entry.question.toLowerCase())
          const answerKeywords = extractKeywords(entry.answer.toLowerCase())
          
          return questionKeywords.some(qk => 
            qk.includes(keyword) || keyword.includes(qk) || calculateSimilarity(qk, keyword) > 0.8
          ) || answerKeywords.some(ak => 
            ak.includes(keyword) || keyword.includes(ak) || calculateSimilarity(ak, keyword) > 0.8
          )
        })
        
        if (keywordMatch) {
          return `${keywordMatch.answer}\n\n*พบจากคำค้นหา: "${keyword}"*`
        }
      }
      
      return null
    } catch (error) {
      console.error('Error finding direct match:', error)
      return null
    }
  }

  private getFallbackResponse(message: string): string {
    const keywords = extractKeywords(message)
    
    // ถ้ามี keyword ที่รู้จัก แนะนำหัวข้อที่เกี่ยวข้อง
    for (const [topic, topicKeywords] of Object.entries(this.commonTopics)) {
      const hasKeyword = keywords.some(keyword => 
        topicKeywords.some(topicWord => keyword.includes(topicWord))
      )
      
      if (hasKeyword) {
        return `ผมเข้าใจว่าคุณถามเกี่ยวกับ "${topic}" ครับ ลองถามคำถามเฉพาะเจาะจงมากกว่านี้ เช่น "ราคาหลักสูตรเท่าไหร่" หรือ "มีใบประกาศนียบัตรไหม" ครับ`
      }
    }
    
    // Random fallback
    const randomIndex = Math.floor(Math.random() * this.fallbackResponses.length)
    return this.fallbackResponses[randomIndex]
  }

  async saveConversation(sessionId: string, userMessage: string, botResponse: string) {
    try {
      const session = await prisma.chatSession.findUnique({
        where: { sessionId }
      })
      
      if (session) {
        await prisma.chatMessage.createMany({
          data: [
            {
              sessionId: session.id,
              message: userMessage,
              isBot: false
            },
            {
              sessionId: session.id,
              message: botResponse,
              isBot: true
            }
          ]
        })
      }
    } catch (error) {
      console.error('Error saving conversation:', error)
    }
  }
}