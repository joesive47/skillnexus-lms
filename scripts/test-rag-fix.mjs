import { processDocument } from '../src/lib/document-processor'
import { generateRAGResponse, searchSimilarChunks } from '../src/lib/rag-service'
import fs from 'fs'
import path from 'path'

async function testRAGFix() {
  console.log('🔧 Testing RAG system with SCORM knowledge...')
  
  try {
    // ทดสอบกับไฟล์ .txt ก่อน
    const testFilePath = path.join(process.cwd(), 'public', 'test-scorm-knowledge.txt')
    
    if (!fs.existsSync(testFilePath)) {
      console.log('❌ ไม่พบไฟล์ทดสอบ')
      return
    }
    
    // อ่านไฟล์และสร้าง File object
    const buffer = fs.readFileSync(testFilePath)
    const file = {
      name: 'test-scorm-knowledge.txt',
      type: 'text/plain',
      arrayBuffer: async () => buffer
    }
    
    console.log('📄 Processing knowledge file:', file.name)
    
    // ประมวลผลไฟล์
    const result = await processDocument(file, null)
    
    console.log('✅ File processing successful!')
    console.log('📊 Document ID:', result.id)
    console.log('📦 Total chunks:', result.totalChunks)
    
    // รอให้ระบบประมวลผลเสร็จ
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // ทดสอบการค้นหา
    console.log('\n🔍 Testing search with "SCORM"...')
    const searchResults = await searchSimilarChunks('SCORM คืออะไร', 3)
    
    if (searchResults.length > 0) {
      console.log('✅ Search successful!')
      searchResults.forEach((result, index) => {
        console.log(`\n📋 Result ${index + 1}:`)
        console.log('📄 Source:', result.source)
        console.log('🎯 Similarity:', (result.similarity * 100).toFixed(2) + '%')
        console.log('📝 Content preview:', result.content.substring(0, 150) + '...')
      })
    } else {
      console.log('❌ No search results found')
    }
    
    // ทดสอบ RAG response
    console.log('\n🤖 Testing RAG response...')
    const questions = [
      'SCORM คืออะไร',
      'SkillNexus รองรับ SCORM เวอร์ชันไหนบ้าง',
      'วิธีอัพโหลด SCORM ทำอย่างไร',
      'ข้อกำหนดไฟล์ SCORM มีอะไรบ้าง'
    ]
    
    for (const question of questions) {
      console.log(`\n❓ Question: ${question}`)
      const response = await generateRAGResponse(question)
      console.log(`💬 Answer: ${response.substring(0, 200)}...`)
    }
    
    console.log('\n✅ RAG system test completed!')
    
  } catch (error) {
    console.error('❌ Error testing RAG system:', error.message)
    console.error('Stack:', error.stack)
  }
}

// เรียกใช้ทดสอบ
testRAGFix()