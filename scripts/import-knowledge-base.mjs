import { PrismaClient } from '@prisma/client'
import { generateEmbedding, splitTextIntoChunks } from '../src/lib/rag-service.js'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function importKnowledgeBase() {
  console.log('📚 Importing Knowledge Base into RAG system...')
  
  try {
    const knowledgeBasePath = path.join(process.cwd(), 'public', 'Knowledge Base.txt')
    
    if (!fs.existsSync(knowledgeBasePath)) {
      console.log('❌ Knowledge Base.txt not found!')
      return
    }
    
    // อ่านไฟล์
    const content = fs.readFileSync(knowledgeBasePath, 'utf-8')
    console.log('📄 File loaded, content length:', content.length)
    
    // ตรวจสอบว่ามีเอกสารนี้อยู่แล้วหรือไม่
    let document = await prisma.document.findFirst({
      where: { filename: 'Knowledge Base.txt' }
    })
    
    if (document) {
      console.log('🔄 Document exists, updating...')
      // ลบ chunks เก่า
      await prisma.documentChunk.deleteMany({
        where: { documentId: document.id }
      })
    } else {
      console.log('📝 Creating new document...')
      document = await prisma.document.create({
        data: {
          filename: 'Knowledge Base.txt',
          originalName: 'Knowledge Base.txt',
          mimeType: 'text/plain',
          size: content.length,
          content: content
        }
      })
    }
    
    // แบ่งข้อความเป็น chunks
    console.log('✂️ Splitting text into chunks...')
    const chunks = splitTextIntoChunks(content, 800, 100)
    console.log(`📦 Created ${chunks.length} chunks`)
    
    // สร้าง embeddings และบันทึก chunks
    console.log('🧠 Generating embeddings...')
    let processedChunks = 0
    
    for (const chunk of chunks) {
      try {
        const embedding = await generateEmbedding(chunk)
        
        await prisma.documentChunk.create({
          data: {
            documentId: document.id,
            content: chunk,
            chunkIndex: processedChunks,
            embedding: JSON.stringify(embedding)
          }
        })
        
        processedChunks++
        
        if (processedChunks % 5 === 0) {
          console.log(`⏳ Processed ${processedChunks}/${chunks.length} chunks`)
        }
        
        // หน่วงเวลาเล็กน้อยเพื่อไม่ให้ระบบล้น
        await new Promise(resolve => setTimeout(resolve, 100))
        
      } catch (error) {
        console.error(`❌ Error processing chunk ${processedChunks}:`, error.message)
      }
    }
    
    console.log(`✅ Successfully imported ${processedChunks} chunks from Knowledge Base`)
    
    // ทดสอบการค้นหา
    console.log('\\n🔍 Testing search functionality...')
    
    const { searchSimilarChunks } = await import('../src/lib/rag-service.js')
    
    const testQueries = [
      'SCORM คืออะไร',
      'SkillNexus รองรับ SCORM เวอร์ชันไหน',
      'ฟีเจอร์ SCORM ที่รองรับ'
    ]
    
    for (const query of testQueries) {
      console.log(`\\n❓ Testing: "${query}"`)
      const results = await searchSimilarChunks(query, 2)
      
      if (results.length > 0) {
        console.log(`✅ Found ${results.length} relevant chunks`)
        results.forEach((result, index) => {
          console.log(`   ${index + 1}. Similarity: ${(result.similarity * 100).toFixed(1)}%`)
          console.log(`      Preview: ${result.content.substring(0, 100)}...`)
        })
      } else {
        console.log('❌ No results found')
      }
    }
    
    console.log('\\n🎉 Knowledge Base import completed successfully!')
    
  } catch (error) {
    console.error('❌ Error importing knowledge base:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// เรียกใช้
importKnowledgeBase()