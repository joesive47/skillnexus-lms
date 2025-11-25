import fetch from 'node-fetch'

const API_BASE = 'http://localhost:3000'

async function testChatbotKnowledge() {
  console.log('🤖 Testing Chatbot Knowledge Base Connection...\n')

  const testQuestions = [
    'Anti-Skip Video Player คืออะไร',
    'SCORM Support ทำงานอย่างไร',
    'PWA คืออะไร',
    'AI Recommendations ช่วยอะไรได้บ้าง',
    'ระบบความปลอดภัยมีอะไรบ้าง',
    'ราคาเท่าไหร่' // This should fallback
  ]

  for (const question of testQuestions) {
    try {
      console.log(`❓ Question: "${question}"`)
      
      const response = await fetch(`${API_BASE}/api/chatbot/knowledge-search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      })

      const data = await response.json()
      
      if (data.success) {
        console.log(`✅ Response (${data.confidence}% confidence):`)
        console.log(`   ${data.response.substring(0, 100)}...`)
        console.log(`📚 Source: ${data.source}`)
        console.log(`🔍 Type: ${data.type}\n`)
      } else {
        console.log(`❌ Error: ${data.error}\n`)
      }
      
      // Wait between requests
      await new Promise(resolve => setTimeout(resolve, 500))
      
    } catch (error) {
      console.log(`❌ Request failed: ${error.message}\n`)
    }
  }
  
  console.log('🎉 Chatbot knowledge base test completed!')
}

testChatbotKnowledge()