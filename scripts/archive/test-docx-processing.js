const { processDocument } = require('../src/lib/document-processor')
const fs = require('fs')
const path = require('path')

async function testDocxProcessing() {
  console.log('🧪 Testing DOCX file processing...')
  
  try {
    // สร้างไฟล์ทดสอบ .docx (mock)
    const testDocxPath = path.join(process.cwd(), 'public', 'test-knowledge.docx')
    
    // ตรวจสอบว่ามีไฟล์ทดสอบหรือไม่
    if (!fs.existsSync(testDocxPath)) {
      console.log('❌ ไม่พบไฟล์ทดสอบ test-knowledge.docx')
      console.log('📝 กรุณาสร้างไฟล์ .docx ทดสอบใน public/test-knowledge.docx')
      return
    }
    
    // อ่านไฟล์และสร้าง File object
    const buffer = fs.readFileSync(testDocxPath)
    const file = {
      name: 'test-knowledge.docx',
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      arrayBuffer: async () => buffer
    }
    
    console.log('📄 Processing DOCX file:', file.name)
    
    // ประมวลผลไฟล์
    const result = await processDocument(file, null)
    
    console.log('✅ DOCX processing successful!')
    console.log('📊 Document ID:', result.id)
    console.log('📝 Filename:', result.filename)
    console.log('📦 Total chunks:', result.totalChunks)
    console.log('🔄 Status:', result.status)
    
    // ทดสอบการค้นหา
    const { searchSimilarChunks } = require('../src/lib/rag-service')
    
    console.log('\n🔍 Testing search functionality...')
    const searchResults = await searchSimilarChunks('SCORM', 3)
    
    if (searchResults.length > 0) {
      console.log('✅ Search successful!')
      searchResults.forEach((result, index) => {
        console.log(`\n📋 Result ${index + 1}:`)
        console.log('📄 Source:', result.source)
        console.log('🎯 Similarity:', (result.similarity * 100).toFixed(2) + '%')
        console.log('📝 Content preview:', result.content.substring(0, 100) + '...')
      })
    } else {
      console.log('❌ No search results found')
    }
    
    // ทดสอบ RAG response
    console.log('\n🤖 Testing RAG response...')
    const { generateRAGResponse } = require('../src/lib/rag-service')
    const response = await generateRAGResponse('SCORM คืออะไร')
    
    console.log('💬 RAG Response:')
    console.log(response)
    
  } catch (error) {
    console.error('❌ Error testing DOCX processing:', error.message)
    
    if (error.message.includes('Unsupported file type')) {
      console.log('\n💡 Solutions:')
      console.log('1. ตรวจสอบว่าติดตั้ง mammoth package แล้ว: npm install mammoth')
      console.log('2. ตรวจสอบว่าไฟล์เป็น .docx จริง')
      console.log('3. ลองใช้ไฟล์ .docx อื่น')
    }
  }
}

// เรียกใช้ทดสอบ
testDocxProcessing()