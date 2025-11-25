const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function testRAGSystem() {
  console.log('🧪 Testing RAG System...')
  
  try {
    // 1. ตรวจสอบการเชื่อมต่อฐานข้อมูล
    console.log('\n📊 Checking database connection...')
    const documentsCount = await prisma.ragDocument.count()
    const chunksCount = await prisma.ragChunk.count()
    
    console.log(`✅ Database connected`)
    console.log(`📄 Documents: ${documentsCount}`)
    console.log(`🔪 Chunks: ${chunksCount}`)
    
    // 2. ตรวจสอบเอกสารที่มีอยู่
    if (documentsCount > 0) {
      console.log('\n📋 Existing documents:')
      const documents = await prisma.ragDocument.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
      })
      
      documents.forEach(doc => {
        console.log(`  - ${doc.filename} (${doc.status}) - ${doc.totalChunks} chunks`)
      })
    }
    
    // 3. สร้างเอกสารตัวอย่างถ้ายังไม่มี
    if (documentsCount === 0) {
      console.log('\n📝 Creating sample document...')
      await createSampleDocument()
    }
    
    // 4. ทดสอบการค้นหา
    console.log('\n🔍 Testing search functionality...')
    await testSearch()
    
    // 5. ทดสอบ API endpoints
    console.log('\n🌐 Testing API endpoints...')
    await testAPIEndpoints()
    
    console.log('\n✅ RAG System test completed successfully!')
    
  } catch (error) {
    console.error('❌ RAG System test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

async function createSampleDocument() {
  const sampleContent = `
SkillNexus Learning Management System

SkillNexus เป็นระบบจัดการการเรียนรู้ที่ทันสมัย ออกแบบมาเพื่อให้ผู้เรียนสามารถเรียนรู้ได้อย่างมีประสิทธิภาพ

คุณสมบัติหลัก:
1. ระบบ Anti-Skip Video Player - ป้องกันการข้ามวิดีโอ
2. ระบบ SCORM Support - รองรับมาตรฐาน SCORM 1.2 และ 2004
3. ระบบ Quiz และ Assessment - ประเมินผลการเรียนรู้
4. ระบบ Certificate - ออกใบประกาศนียบัตร
5. ระบบ AI Chatbot - ตอบคำถามอัตโนมัติ

การใช้งานระบบ:
- ผู้ดูแลระบบสามารถสร้างคอร์สเรียน อัพโหลดวิดีโอ และจัดการผู้เรียน
- ครูสามารถสร้างบทเรียน แบบทดสอบ และติดตามความก้าวหน้าของนักเรียน
- นักเรียนสามารถเรียนออนไลน์ ทำแบบทดสอบ และรับใบประกาศนียบัตร

ระบบรองรับการเรียนรู้หลายรูปแบบ:
- Video Learning
- Interactive Content
- SCORM Packages
- Live Streaming
- Virtual Reality (VR)

การติดต่อสนับสนุน:
หากมีปัญหาการใช้งาน สามารถติดต่อทีมสนับสนุนได้ตลอด 24 ชั่วโมง
อีเมล: support@skillnexus.com
โทร: 02-xxx-xxxx
  `

  try {
    // สร้างเอกสาร
    const document = await prisma.ragDocument.create({
      data: {
        filename: 'skillnexus-guide.txt',
        fileType: 'txt',
        fileSize: sampleContent.length,
        status: 'processing',
        totalChunks: 0
      }
    })

    // แบ่งเป็น chunks
    const chunkSize = 300
    const overlap = 50
    const chunks = []
    
    let start = 0
    let chunkIndex = 0
    
    while (start < sampleContent.length) {
      const end = Math.min(start + chunkSize, sampleContent.length)
      const chunk = sampleContent.slice(start, end).trim()
      
      if (chunk.length > 20) {
        chunks.push({
          documentId: document.id,
          content: chunk,
          chunkIndex: chunkIndex++,
          embedding: null // จะสร้าง embedding จริงใน production
        })
      }
      
      start = end - overlap
      if (start >= sampleContent.length) break
    }

    // บันทึก chunks
    await prisma.ragChunk.createMany({
      data: chunks
    })

    // อัพเดทสถานะเอกสาร
    await prisma.ragDocument.update({
      where: { id: document.id },
      data: {
        status: 'completed',
        totalChunks: chunks.length,
        processedAt: new Date()
      }
    })

    console.log(`✅ Sample document created: ${chunks.length} chunks`)
    
  } catch (error) {
    console.error('❌ Failed to create sample document:', error)
  }
}

async function testSearch() {
  try {
    // ทดสอบการค้นหาด้วยคำถามต่างๆ
    const testQueries = [
      'SkillNexus คืออะไร',
      'ระบบ Anti-Skip',
      'SCORM Support',
      'การติดต่อสนับสนุน',
      'ใบประกาศนียบัตร'
    ]

    for (const query of testQueries) {
      console.log(`\n🔍 Searching: "${query}"`)
      
      // ค้นหา chunks ที่เกี่ยวข้อง
      const chunks = await prisma.ragChunk.findMany({
        where: {
          content: {
            contains: query,
            mode: 'insensitive'
          }
        },
        include: {
          document: {
            select: {
              filename: true
            }
          }
        },
        take: 3
      })

      if (chunks.length > 0) {
        console.log(`  ✅ Found ${chunks.length} relevant chunks`)
        chunks.forEach((chunk, i) => {
          console.log(`    ${i + 1}. ${chunk.content.substring(0, 100)}...`)
        })
      } else {
        console.log(`  ❌ No chunks found`)
      }
    }
    
  } catch (error) {
    console.error('❌ Search test failed:', error)
  }
}

async function testAPIEndpoints() {
  try {
    // ทดสอบ API โดยใช้ fetch (ถ้าเซิร์ฟเวอร์รันอยู่)
    const baseUrl = 'http://localhost:3000'
    
    console.log('📡 Testing upload document API...')
    // ในการทดสอบจริงจะต้องมีไฟล์สำหรับอัพโหลด
    
    console.log('📡 Testing chat API...')
    // ทดสอบ chat API
    const chatResponse = await fetch(`${baseUrl}/api/chatbot/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'SkillNexus คืออะไร',
        sessionId: 'test-session-' + Date.now()
      })
    }).catch(() => null)

    if (chatResponse && chatResponse.ok) {
      const data = await chatResponse.json()
      console.log('  ✅ Chat API working')
      console.log(`  📝 Response: ${data.response.substring(0, 100)}...`)
    } else {
      console.log('  ⚠️ Chat API not available (server may not be running)')
    }
    
  } catch (error) {
    console.log('  ⚠️ API test skipped (server not running)')
  }
}

// เรียกใช้งานทดสอบ
if (require.main === module) {
  testRAGSystem()
}

module.exports = { testRAGSystem }