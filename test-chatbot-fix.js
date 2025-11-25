/**
 * Test script to verify chatbot fix
 */

const testChatbotAPI = async () => {
  console.log('🧪 Testing Chatbot API...')
  
  try {
    const response = await fetch('http://localhost:3000/api/chatbot/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'สวัสดี SkillNexus คืออะไร',
        sessionId: 'test-session'
      })
    })

    const data = await response.json()
    
    console.log('✅ Response Status:', response.status)
    console.log('✅ Response Data:', data)
    
    // Check if sources is an array
    if (data.sources) {
      console.log('✅ Sources type:', Array.isArray(data.sources) ? 'Array' : typeof data.sources)
      console.log('✅ Sources length:', data.sources.length)
    }
    
    // Check response structure
    const requiredFields = ['response', 'sources', 'metadata']
    const missingFields = requiredFields.filter(field => !(field in data))
    
    if (missingFields.length === 0) {
      console.log('✅ All required fields present')
    } else {
      console.log('❌ Missing fields:', missingFields)
    }
    
    return data
    
  } catch (error) {
    console.error('❌ Test failed:', error)
    return null
  }
}

// Run test if this is executed directly
if (typeof window === 'undefined') {
  testChatbotAPI()
}

export { testChatbotAPI }