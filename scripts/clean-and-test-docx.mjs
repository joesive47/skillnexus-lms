import { processDocument } from '../src/lib/document-processor.js'
import { generateRAGResponse } from '../src/lib/rag-service.js'
import prisma from '../src/lib/prisma.js'
import fs from 'fs'
import path from 'path'

async function cleanAndTestDocx() {
  console.log('🧹 Cleaning old documents and testing DOCX processing...')
  
  try {
    // ลบข้อมูลเก่า
    console.log('🗑️ Cleaning old documents...')
    await prisma.documentChunk.deleteMany({})
    await prisma.document.deleteMany({})
    console.log('✅ Old documents cleaned')
    
    // สร้างไฟล์ .docx ตัวอย่างด้วยข้อมูล SCORM
    const docxContent = `# ข้อมูลเกี่ยวกับ SCORM Support ใน SkillNexus LMS

## SCORM คืออะไร?
SCORM (Sharable Content Object Reference Model) เป็นมาตรฐานสำหรับการสร้างและแบ่งปันเนื้อหาการเรียนรู้ออนไลน์ ที่ช่วยให้เนื้อหาสามารถทำงานร่วมกับระบบ LMS ต่างๆ ได้

## การรองรับ SCORM ใน SkillNexus
SkillNexus LMS รองรับ SCORM เวอร์ชัน:
- SCORM 1.2 - รองรับเต็มรูปแบบ
- SCORM 2004 - รองรับเต็มรูปแบบ

## ฟีเจอร์ SCORM ที่รองรับ
1. การอัพโหลดไฟล์ SCORM (.zip)
2. การแตกไฟล์และตรวจสอบ manifest
3. การเล่นเนื้อหา SCORM ในเบราว์เซอร์
4. การติดตามความคืบหน้าการเรียน
5. การบันทึกคะแนนและผลการเรียน
6. การรายงานผลการเรียนรู้`

    // บันทึกเป็นไฟล์ .txt ก่อน (เพื่อทดสอบ)
    const testFilePath = path.join(process.cwd(), 'public', 'Knowledge Base.txt')
    fs.writeFileSync(testFilePath, docxContent, 'utf-8')
    
    console.log('📄 Created test file: Knowledge Base.txt')
    
    // ทดสอบการประมวลผลไฟล์ .txt
    const buffer = fs.readFileSync(testFilePath)
    const file = {
      name: 'Knowledge Base.txt',
      type: 'text/plain',
      arrayBuffer: async () => buffer
    }
    
    console.log('📄 Processing file:', file.name)
    const result = await processDocument(file, null)
    
    console.log('✅ File processing successful!')
    console.log('📊 Document ID:', result.id)
    console.log('📦 Total chunks:', result.totalChunks)
    
    // รอให้ระบบประมวลผลเสร็จ
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // ทดสอบ RAG response
    console.log('\n🤖 Testing RAG responses...')
    const questions = [
      'SCORM คืออะไร',
      'SkillNexus รองรับ SCORM เวอร์ชันไหนบ้าง',
      'ฟีเจอร์ SCORM ที่รองรับมีอะไรบ้าง'
    ]
    
    for (const question of questions) {
      console.log(`\n❓ Question: ${question}`)
      const response = await generateRAGResponse(question)
      
      if (response.includes('ไม่พบข้อมูลที่เกี่ยวข้อง')) {
        console.log('❌ No relevant data found')
      } else {
        console.log('✅ Response found!')
        console.log(`💬 Answer: ${response.substring(0, 150)}...`)
      }
    }
    
    console.log('\n✅ Test completed successfully!')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error('Stack:', error.stack)
  }
}

// เรียกใช้ทดสอบ
cleanAndTestDocx()