import fetch from 'node-fetch'

async function testChatbotAPI() {
  try {
    console.log('🧪 ทดสอบ Chatbot API...')
    
    const testQuestions = [
      'SkillNexus LMS คืออะไร?',
      'Anti-Skip Video Player ทำงานอย่างไร?',
      'SCORM คืออะไร?',
      'PWA คืออะไร?',
      'AI Recommendations ทำงานอย่างไร?'
    ]
    
    for (const question of testQuestions) {
      console.log(`\n❓ คำถาม: ${question}`)
      
      try {
        const response = await fetch('http://localhost:3000/api/chatbot/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: question,
            sessionId: 'test-session'
          })
        })
        
        if (response.ok) {
          const data = await response.json()
          console.log(`✅ คำตอบ: ${data.response}`)
          console.log(`📊 วิธีการ: ${data.method}`)
          if (data.sources && data.sources.length > 0) {
            console.log(`📚 แหล่งข้อมูล: ${data.sources.length} รายการ`)
          }
        } else {
          console.log(`❌ HTTP Error: ${response.status}`)
          const errorText = await response.text()
          console.log(`Error: ${errorText}`)
        }
      } catch (error) {
        console.log(`❌ Network Error: ${error.message}`)
      }
    }
    
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error)
  }
}

testChatbotAPI()