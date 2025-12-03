#!/usr/bin/env node

/**
 * ตรวจสอบ API Endpoints ของ Chatbot Dashboard
 * Test Chatbot API Endpoints
 */

import fetch from 'node-fetch'

class ChatbotAPITester {
  constructor() {
    this.baseUrl = 'http://localhost:3000'
    this.results = []
  }

  async testAPI(endpoint, method = 'GET', body = null, description = '') {
    const url = `${this.baseUrl}${endpoint}`
    console.log(`🔍 Testing: ${method} ${endpoint} - ${description}`)
    
    try {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json'
        }
      }
      
      if (body) {
        options.body = JSON.stringify(body)
      }
      
      const response = await fetch(url, options)
      const data = await response.json()
      
      const result = {
        endpoint,
        method,
        status: response.status,
        success: response.ok,
        description,
        data: response.ok ? 'OK' : data.error || 'Unknown error'
      }
      
      this.results.push(result)
      
      if (response.ok) {
        console.log(`✅ ${response.status} - ${description}`)
      } else {
        console.log(`❌ ${response.status} - ${description}: ${data.error || 'Unknown error'}`)
      }
      
      return result
      
    } catch (error) {
      const result = {
        endpoint,
        method,
        status: 0,
        success: false,
        description,
        data: error.message
      }
      
      this.results.push(result)
      console.log(`❌ Connection Error - ${description}: ${error.message}`)
      return result
    }
  }

  async runAllTests() {
    console.log('🚀 เริ่มทดสอบ Chatbot API Endpoints...\n')
    
    // Test Knowledge Base APIs
    console.log('📚 Testing Knowledge Base APIs...')
    await this.testAPI('/api/chatbot/knowledge-base', 'GET', null, 'ดึงข้อมูล Knowledge Base')
    
    await this.testAPI('/api/chatbot/knowledge-base', 'POST', {
      question: 'ทดสอบคำถาม',
      answer: 'ทดสอบคำตอบ',
      category: 'general'
    }, 'เพิ่ม Knowledge Base ใหม่')
    
    // Test Documents APIs
    console.log('\n📄 Testing Documents APIs...')
    await this.testAPI('/api/chatbot/documents', 'GET', null, 'ดึงรายการเอกสาร RAG')
    
    // Test Chat APIs
    console.log('\n💬 Testing Chat APIs...')
    await this.testAPI('/api/chatbot/chat', 'POST', {
      message: 'สวัสดี',
      sessionId: 'test-session'
    }, 'ส่งข้อความแชท')
    
    await this.testAPI('/api/chatbot/chat?sessionId=test-session', 'GET', null, 'ดึงประวัติแชท')
    
    // Test Processing APIs
    console.log('\n🔄 Testing Processing APIs...')
    await this.testAPI('/api/chatbot/generate-embeddings', 'POST', null, 'สร้าง AI Embeddings')
    
    await this.testAPI('/api/chatbot/convert-rag', 'POST', {
      documentIds: []
    }, 'แปลง RAG เป็น Knowledge Base')
    
    await this.testAPI('/api/chatbot/bulk-convert', 'POST', {
      action: 'convert-all'
    }, 'แปลงทั้งหมด')
    
    await this.testAPI('/api/chatbot/smart-convert', 'POST', {
      documentId: 'test-id',
      conversionType: 'smart'
    }, 'แปลงอัจฉริยะ')
    
    // Test Admin APIs
    console.log('\n👑 Testing Admin APIs...')
    await this.testAPI('/api/admin/chatbot/knowledge-base', 'GET', null, 'Admin - ดึงข้อมูล KB')
    await this.testAPI('/api/admin/chatbot/analytics', 'GET', null, 'Admin - Analytics')
    
    this.generateReport()
  }

  generateReport() {
    console.log('\n📊 สรุปผลการทดสอบ API')
    console.log('=' .repeat(60))
    
    const totalTests = this.results.length
    const successTests = this.results.filter(r => r.success).length
    const failedTests = totalTests - successTests
    
    console.log(`📈 ทดสอบทั้งหมด: ${totalTests}`)
    console.log(`✅ สำเร็จ: ${successTests}`)
    console.log(`❌ ล้มเหลว: ${failedTests}`)
    console.log(`📊 อัตราสำเร็จ: ${((successTests / totalTests) * 100).toFixed(1)}%`)
    
    console.log('\n📋 รายละเอียดผลการทดสอบ:')
    console.log('-' .repeat(60))
    
    this.results.forEach((result, index) => {
      const status = result.success ? '✅' : '❌'
      console.log(`${index + 1}. ${status} ${result.method} ${result.endpoint}`)
      console.log(`   📝 ${result.description}`)
      console.log(`   📊 Status: ${result.status}`)
      if (!result.success) {
        console.log(`   ⚠️  Error: ${result.data}`)
      }
      console.log('')
    })
    
    // สร้างรายงาน JSON
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: totalTests,
        success: successTests,
        failed: failedTests,
        successRate: ((successTests / totalTests) * 100).toFixed(1) + '%'
      },
      results: this.results
    }
    
    // บันทึกรายงาน
    const fs = await import('fs')
    const path = await import('path')
    
    const reportPath = path.join(process.cwd(), 'chatbot-api-test-report.json')
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
    
    console.log(`📄 รายงานถูกบันทึกที่: ${reportPath}`)
    
    // คำแนะนำ
    console.log('\n💡 คำแนะนำ:')
    if (failedTests > 0) {
      console.log('🔧 มี API ที่ล้มเหลว กรุณาตรวจสอบ:')
      console.log('   1. เซิร์ฟเวอร์ทำงานอยู่หรือไม่ (npm run dev)')
      console.log('   2. ฐานข้อมูลเชื่อมต่อได้หรือไม่')
      console.log('   3. ไฟล์ API routes มีอยู่หรือไม่')
      console.log('   4. ตรวจสอบ console logs สำหรับข้อผิดพลาด')
    } else {
      console.log('🎉 API ทั้งหมดทำงานปกติ!')
      console.log('✨ ระบบ Chatbot พร้อมใช้งาน')
    }
  }

  async testSpecificEndpoint(endpoint, method = 'GET', body = null) {
    console.log(`🎯 ทดสอบ API เฉพาะ: ${method} ${endpoint}`)
    const result = await this.testAPI(endpoint, method, body, 'ทดสอบเฉพาะ')
    
    console.log('\n📊 ผลการทดสอบ:')
    console.log(`Status: ${result.status}`)
    console.log(`Success: ${result.success}`)
    console.log(`Data: ${result.data}`)
    
    return result
  }
}

// ฟังก์ชันสำหรับทดสอบการเชื่อมต่อพื้นฐาน
async function testConnection() {
  console.log('🔌 ทดสอบการเชื่อมต่อเซิร์ฟเวอร์...')
  
  try {
    const response = await fetch('http://localhost:3000/api/health')
    if (response.ok) {
      console.log('✅ เซิร์ฟเวอร์ทำงานปกติ')
      return true
    } else {
      console.log('⚠️ เซิร์ฟเวอร์ตอบสนองแต่มีปัญหา')
      return false
    }
  } catch (error) {
    console.log('❌ ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้')
    console.log('💡 กรุณาตรวจสอบ:')
    console.log('   1. เซิร์ฟเวอร์ทำงานอยู่หรือไม่: npm run dev')
    console.log('   2. Port 3000 ว่างหรือไม่')
    console.log('   3. ไฟร์วอลล์บล็อกการเชื่อมต่อหรือไม่')
    return false
  }
}

// Main function
async function main() {
  const args = process.argv.slice(2)
  const tester = new ChatbotAPITester()
  
  // ทดสอบการเชื่อมต่อก่อน
  const connected = await testConnection()
  if (!connected) {
    console.log('\n🛑 หยุดการทดสอบเนื่องจากไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้')
    return
  }
  
  if (args.length === 0) {
    // ทดสอบทั้งหมด
    await tester.runAllTests()
  } else if (args[0] === 'endpoint') {
    // ทดสอบ endpoint เฉพาะ
    const endpoint = args[1] || '/api/chatbot/knowledge-base'
    const method = args[2] || 'GET'
    await tester.testSpecificEndpoint(endpoint, method)
  } else {
    console.log('📖 วิธีใช้:')
    console.log('  node scripts/test-chatbot-api.js              # ทดสอบทั้งหมด')
    console.log('  node scripts/test-chatbot-api.js endpoint /api/chatbot/chat POST  # ทดสอบเฉพาะ')
  }
}

// เรียกใช้ถ้าไฟล์นี้ถูกเรียกโดยตรง
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}

export default ChatbotAPITester