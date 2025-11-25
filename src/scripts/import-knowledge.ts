import fs from 'fs'
import path from 'path'
import { SkillNexusChatbot } from '@/lib/chatbot'

async function importKnowledgeBase() {
  try {
    // อ่านไฟล์ knowledge base JSON
    const knowledgePath = path.join(process.cwd(), 'knowledge-base.json')
    
    if (!fs.existsSync(knowledgePath)) {
      console.error('ไม่พบไฟล์ knowledge-base.json')
      console.log('กรุณาวางไฟล์ knowledge-base-1763982823686.json ในโฟลเดอร์ root และเปลี่ยนชื่อเป็น knowledge-base.json')
      return
    }

    const knowledgeData = JSON.parse(fs.readFileSync(knowledgePath, 'utf-8'))
    
    console.log('🚀 เริ่มนำเข้า Knowledge Base...')
    console.log(`📄 จำนวนเอกสาร: ${knowledgeData.metadata.totalDocuments}`)
    console.log(`📝 จำนวน chunks: ${knowledgeData.metadata.totalChunks}`)

    const chatbot = new SkillNexusChatbot()
    await chatbot.importKnowledge(knowledgeData)

    console.log('✅ นำเข้า Knowledge Base สำเร็จ!')
    console.log('🤖 Chatbot พร้อมใช้งาน')

  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error)
  }
}

// รันสคริปต์
importKnowledgeBase()