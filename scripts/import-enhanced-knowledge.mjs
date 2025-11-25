import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'
import { pipeline } from '@xenova/transformers'

const prisma = new PrismaClient()

// สร้าง embedding
let embedder = null

async function getEmbedder() {
  if (!embedder) {
    console.log('Loading embedding model...')
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
  }
  return embedder
}

async function generateEmbedding(text) {
  try {
    const model = await getEmbedder()
    const output = await model(text, { pooling: 'mean', normalize: true })
    return Array.from(output.data)
  } catch (error) {
    console.error('Embedding generation error:', error)
    return []
  }
}

async function importKnowledgeBase() {
  try {
    console.log('🚀 Starting enhanced knowledge base import...')
    
    // อ่านไฟล์ JSON
    const knowledgeData = JSON.parse(
      readFileSync('public/knowledge-base-1763982823686.json', 'utf8')
    )
    
    console.log(`📚 Found ${knowledgeData.knowledge.length} knowledge chunks`)
    
    // สร้าง document record ก่อน
    for (const doc of knowledgeData.metadata.documents) {
      await prisma.document.upsert({
        where: { id: doc.id },
        update: {
          filename: doc.filename,
          fileType: doc.fileType || 'json',
          uploadedAt: new Date()
        },
        create: {
          id: doc.id,
          filename: doc.filename,
          fileType: doc.fileType || 'json',
          uploadedAt: new Date()
        }
      })
      console.log(`📄 Document: ${doc.filename}`)
    }
    
    // Import knowledge chunks พร้อม embedding
    let processed = 0
    for (const item of knowledgeData.knowledge) {
      console.log(`Processing ${++processed}/${knowledgeData.knowledge.length}: ${item.documentName}`)
      
      // สร้าง embedding
      const embedding = await generateEmbedding(item.content)
      
      // บันทึกลงฐานข้อมูล
      await prisma.documentChunk.upsert({
        where: { id: item.id },
        update: {
          content: item.content,
          embedding: JSON.stringify(embedding),
          metadata: item.metadata || {}
        },
        create: {
          id: item.id,
          documentId: item.documentId,
          content: item.content,
          embedding: JSON.stringify(embedding),
          metadata: item.metadata || {}
        }
      })
    }
    
    console.log('✅ Enhanced knowledge base import completed!')
    
    // ทดสอบระบบ
    console.log('\n🧪 Testing search functionality...')
    
    const testQueries = [
      'SkillNexus LMS มีฟีเจอร์อะไรบ้าง',
      'ระบบ Anti-Skip คืออะไร',
      'รองรับ SCORM ไหม',
      'PWA คืออะไร',
      'ความปลอดภัยเป็นอย่างไร'
    ]
    
    for (const query of testQueries) {
      const chunks = await prisma.documentChunk.findMany({
        where: { embedding: { not: null } },
        include: { document: true }
      })
      
      console.log(`Query: "${query}" -> Found ${chunks.length} chunks`)
    }
    
    console.log('\n🎉 All done! Chatbot is ready to use.')
    
  } catch (error) {
    console.error('❌ Import failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

importKnowledgeBase()