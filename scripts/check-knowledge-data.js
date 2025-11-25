const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function checkKnowledgeData() {
  try {
    console.log('🔍 ตรวจสอบข้อมูล Knowledge Base...')
    
    // ตรวจสอบ ChatKnowledgeBase
    const chatKnowledge = await prisma.chatKnowledgeBase.findMany()
    console.log(`📊 ChatKnowledgeBase: ${chatKnowledge.length} รายการ`)
    
    // ตรวจสอบ KnowledgeChunk
    const knowledgeChunks = await prisma.knowledgeChunk.findMany()
    console.log(`📊 KnowledgeChunk: ${knowledgeChunks.length} รายการ`)
    
    // ตรวจสอบ RagChunk
    const ragChunks = await prisma.ragChunk.findMany()
    console.log(`📊 RagChunk: ${ragChunks.length} รายการ`)
    
    // ตรวจสอบ DocumentChunk
    const documentChunks = await prisma.documentChunk.findMany()
    console.log(`📊 DocumentChunk: ${documentChunks.length} รายการ`)
    
    if (chatKnowledge.length === 0 && knowledgeChunks.length === 0 && ragChunks.length === 0) {
      console.log('⚠️  ไม่พบข้อมูล Knowledge Base ในฐานข้อมูล')
      console.log('🔧 กำลังนำเข้าข้อมูลจากไฟล์ JSON...')
      
      await importFromJSON()
    } else {
      console.log('✅ พบข้อมูล Knowledge Base ในฐานข้อมูล')
      
      // แสดงตัวอย่างข้อมูล
      if (chatKnowledge.length > 0) {
        console.log('\n📝 ตัวอย่าง ChatKnowledgeBase:')
        chatKnowledge.slice(0, 3).forEach((item, index) => {
          console.log(`${index + 1}. ${item.question}`)
        })
      }
      
      if (knowledgeChunks.length > 0) {
        console.log('\n📝 ตัวอย่าง KnowledgeChunk:')
        knowledgeChunks.slice(0, 3).forEach((item, index) => {
          console.log(`${index + 1}. ${item.documentName}: ${item.content.substring(0, 100)}...`)
        })
      }
    }
    
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error)
  } finally {
    await prisma.$disconnect()
  }
}

async function importFromJSON() {
  try {
    const jsonPath = path.join(process.cwd(), 'public', 'knowledge-base-1763982823686.json')
    
    if (!fs.existsSync(jsonPath)) {
      console.log('❌ ไม่พบไฟล์ knowledge-base-1763982823686.json')
      return
    }
    
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
    
    if (!jsonData.knowledge || !Array.isArray(jsonData.knowledge)) {
      console.log('❌ รูปแบบไฟล์ JSON ไม่ถูกต้อง')
      return
    }
    
    console.log(`📥 กำลังนำเข้า ${jsonData.knowledge.length} รายการ...`)
    
    // นำเข้าข้อมูลไปยัง KnowledgeChunk
    for (const item of jsonData.knowledge) {
      await prisma.knowledgeChunk.upsert({
        where: { id: item.id },
        update: {
          content: item.content,
          documentName: item.documentName || 'Knowledge Base.docx'
        },
        create: {
          id: item.id,
          content: item.content,
          documentName: item.documentName || 'Knowledge Base.docx'
        }
      })
    }
    
    // สร้าง ChatKnowledgeBase จากข้อมูล
    const skillnexusItems = [
      {
        question: 'SkillNexus LMS คืออะไร?',
        answer: 'SkillNexus LMS เป็นระบบจัดการการเรียนรู้ที่ทันสมัย มีฟีเจอร์ Anti-Skip Video Player, SCORM Support, AI Recommendations และ PWA ที่ช่วยให้การเรียนรู้มีประสิทธิภาพมากขึ้น',
        category: 'skillnexus'
      },
      {
        question: 'Anti-Skip Video Player ทำงานอย่างไร?',
        answer: 'Anti-Skip Video Player เป็นฟีเจอร์ที่ป้องกันผู้เรียนข้ามเนื้อหาวิดีโอ เพื่อให้มั่นใจว่าผู้เรียนรับชมเนื้อหาครบถ้วนตามหลักสูตร ระบบจะล็อกปุ่มข้ามและสไลเดอร์จนกว่าจะดูจบ',
        category: 'technical'
      },
      {
        question: 'การรองรับ SCORM คืออะไร?',
        answer: 'ระบบรองรับมาตรฐาน SCORM (SCORM 1.2 และ SCORM 2004) ทำให้สามารถนำเข้าคอนเทนต์ eLearning จากเครื่องมือภายนอกได้ เช่น Articulate Storyline, iSpring และติดตามความคืบหน้าได้อย่างแม่นยำ',
        category: 'technical'
      },
      {
        question: 'PWA คืออะไร?',
        answer: 'PWA (Progressive Web App) ทำให้ SkillNexus ทำงานเหมือนแอปมือถือ สามารถติดตั้งบนหน้าจอหลัก ใช้งานออฟไลน์ได้บางส่วน และอัปเดตอัตโนมัติ',
        category: 'technical'
      },
      {
        question: 'ระบบ AI Recommendations ทำงานอย่างไร?',
        answer: 'ระบบ AI ใน SkillNexus ช่วยแนะนำหลักสูตรที่เหมาะสม วิเคราะห์ความคืบหน้าการเรียน และสร้างเส้นทางการเรียนรู้ที่เหมาะกับแต่ละบุคคล โดยใช้ Machine Learning วิเคราะห์พฤติกรรมการเรียนรู้',
        category: 'technical'
      },
      {
        question: 'NextAuth.js v5 คืออะไร?',
        answer: 'NextAuth.js v5 เป็นระบบจัดการการยืนยันตัวตนที่ปลอดภัย รองรับการลงชื่อเข้าใช้ด้วย Social Providers, SAML/OAuth และมีการจัดการเซสชันที่ปลอดภัย',
        category: 'security'
      },
      {
        question: 'Multi-layer Caching คืออะไร?',
        answer: 'ระบบแคชหลายชั้น ประกอบด้วย Redis (Server-side) สำหรับแคชข้อมูลบนเซิร์ฟเวอร์ และ Service Worker (Client-side) สำหรับแคชไฟล์คงที่ในเบราว์เซอร์ เพื่อเพิ่มความเร็วในการโหลด',
        category: 'performance'
      }
    ]
    
    for (const item of skillnexusItems) {
      await prisma.chatKnowledgeBase.upsert({
        where: {
          question: item.question
        },
        update: {
          answer: item.answer,
          category: item.category,
          isActive: true
        },
        create: {
          question: item.question,
          answer: item.answer,
          category: item.category,
          isActive: true
        }
      })
    }
    
    console.log('✅ นำเข้าข้อมูลสำเร็จ!')
    
    // ตรวจสอบข้อมูลหลังนำเข้า
    const finalCount = await prisma.knowledgeChunk.count()
    const chatCount = await prisma.chatKnowledgeBase.count()
    console.log(`📊 ข้อมูลหลังนำเข้า: KnowledgeChunk ${finalCount} รายการ, ChatKnowledgeBase ${chatCount} รายการ`)
    
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการนำเข้าข้อมูล:', error)
  }
}

checkKnowledgeData()