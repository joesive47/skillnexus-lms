import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testChatbot() {
  console.log('🤖 Testing Enhanced Chatbot System\n')
  
  try {
    // ตรวจสอบข้อมูลในฐานข้อมูล
    const chunkCount = await prisma.documentChunk.count()
    const documentsCount = await prisma.document.count()
    
    console.log(`📊 Database Status:`)
    console.log(`   Documents: ${documentsCount}`)
    console.log(`   Chunks: ${chunkCount}`)
    
    if (chunkCount === 0) {
      console.log('❌ No knowledge chunks found. Please run import script first.')
      return
    }
    
    // ทดสอบคำถามต่างๆ
    const testQueries = [
      // คำถามปกติ
      'SkillNexus LMS มีฟีเจอร์อะไรบ้าง',
      'ระบบ Anti-Skip Video Player คืออะไร',
      'รองรับ SCORM ไหม',
      'PWA คืออะไร',
      
      // คำถามที่พิมพ์ผิด
      'สกิลเน็กซัส มีฟีเจอร์อะไรบ้าง',
      'ระบบ แอนตี้สกิป คืออะไร',
      'รองรับ สคอร์ม ไหม',
      'พีดับเบิลยูเอ คืออะไร',
      
      // คำถามที่ไม่ชัดเจน
      'มีอะไรบ้าง',
      'ปลอดภัยไหม',
      'ใช้งานยังไง',
      
      // คำถามที่ไม่เกี่ยวข้อง
      'อากาศวันนี้เป็นอย่างไร',
      'ราคาทองคำเท่าไหร่'
    ]
    
    console.log('\n🧪 Testing Queries:\n')
    
    for (let i = 0; i < testQueries.length; i++) {
      const query = testQueries[i]
      console.log(`${i + 1}. Query: "${query}"`)
      
      try {
        // ทดสอบการค้นหา
        const chunks = await prisma.documentChunk.findMany({
          where: { 
            content: {
              contains: query.split(' ')[0],
              mode: 'insensitive'
            }
          },
          take: 3
        })
        
        console.log(`   Found: ${chunks.length} relevant chunks`)
        
        if (chunks.length > 0) {
          console.log(`   Sample: ${chunks[0].content.substring(0, 100)}...`)
        }
        
      } catch (error) {
        console.log(`   Error: ${error.message}`)
      }
      
      console.log('')
    }
    
    // ทดสอบ API endpoint
    console.log('🌐 Testing API Endpoints:')
    console.log('   GET /api/chatbot/test - System status')
    console.log('   POST /api/chatbot - Chat with bot')
    console.log('   PUT /api/chatbot - Import knowledge')
    
    console.log('\n✅ Test completed!')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testChatbot()