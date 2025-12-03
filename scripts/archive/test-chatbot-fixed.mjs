import { SmartChatbot } from '../src/lib/smart-response.js'

async function testChatbotFixed() {
  console.log('🤖 Testing Fixed Chatbot...')
  
  const chatbot = new SmartChatbot()
  
  const testQuestions = [
    'SCORM คืออะไร',
    'PWA คืออะไร',
    'SkillNexus รองรับ SCORM เวอร์ชันไหนบ้าง',
    'ฟีเจอร์ SCORM ที่รองรับมีอะไรบ้าง',
    'วิธีอัพโหลด SCORM ทำอย่างไร',
    'ราคาหลักสูตรเท่าไหร่',
    'มีใบประกาศนียบัตรหรือไม่',
    'SkillNexus มี PWA หรือไม่'
  ]
  
  console.log('\\n📝 Testing Questions:')
  console.log('=' .repeat(50))
  
  for (let i = 0; i < testQuestions.length; i++) {
    const question = testQuestions[i]
    console.log(`\\n❓ Question ${i + 1}: ${question}`)
    console.log('-'.repeat(30))
    
    try {
      const response = await chatbot.generateResponse(question)
      console.log(`💬 Answer: ${response}`)
      
      // ตรวจสอบว่าคำตอบมีข้อมูลที่เป็นประโยชน์หรือไม่
      if (response.includes('ขออภัย') || response.includes('ไม่เข้าใจ') || response.includes('ไม่พบข้อมูล')) {
        console.log('⚠️  Warning: Generic/fallback response detected')
      } else {
        console.log('✅ Specific answer provided')
      }
      
    } catch (error) {
      console.error(`❌ Error: ${error.message}`)
    }
    
    // หน่วงเวลาเล็กน้อย
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  
  console.log('\\n' + '='.repeat(50))
  console.log('🎉 Chatbot testing completed!')
  
  // สรุปผล
  console.log('\\n📊 Summary:')
  console.log('- If you see specific answers about SCORM, PWA, pricing, certificates: ✅ Fixed!')
  console.log('- If you see generic \"ขออภัย\" responses: ❌ Still needs fixing')
  console.log('\\n💡 Tip: Make sure to run the knowledge base import scripts first!')
}

testChatbotFixed()