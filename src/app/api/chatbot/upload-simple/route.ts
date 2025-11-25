import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { processDocument } from '@/lib/document-processor-optimized'
import { splitTextIntoChunksFast } from '@/lib/rag-ultra-fast'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting simple RAG document upload...')
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'ไม่พบไฟล์' }, { status: 400 })
    }

    // ตรวจสอบประเภทไฟล์
    const allowedTypes = ['txt', 'docx', 'doc', 'pdf']
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    
    if (!fileExtension || !allowedTypes.includes(fileExtension)) {
      return NextResponse.json({ 
        error: 'รองรับเฉพาะไฟล์ PDF, TXT, DOCX, DOC เท่านั้น' 
      }, { status: 400 })
    }

    // ตรวจสอบขนาดไฟล์ (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ 
        error: 'ขนาดไฟล์ต้องไม่เกิน 10MB' 
      }, { status: 400 })
    }

    console.log(`📄 Processing file: ${file.name} (${file.size} bytes)`)
    
    // อ่านเนื้อหาไฟล์
    const buffer = await file.arrayBuffer()
    const content = await processDocument(buffer, file.name)

    if (!content || content.trim().length < 10) {
      return NextResponse.json({ 
        error: 'ไม่สามารถอ่านเนื้อหาไฟล์ได้หรือไฟล์ว่าง' 
      }, { status: 400 })
    }

    console.log(`📝 Extracted ${content.length} characters`)

    // แบ่งเนื้อหาเป็นชิ้นส่วน
    const chunks = splitTextIntoChunksFast(content)
    
    if (chunks.length === 0) {
      return NextResponse.json({ 
        error: 'ไม่สามารถแบ่งเนื้อหาเป็นชิ้นส่วนได้' 
      }, { status: 400 })
    }

    console.log(`🔪 Split into ${chunks.length} chunks`)

    // สร้างรายการเอกสารในฐานข้อมูล
    const document = await prisma.ragDocument.create({
      data: {
        filename: file.name,
        fileType: fileExtension,
        fileSize: file.size,
        status: 'processing',
        totalChunks: chunks.length
      }
    })

    console.log(`📄 Created document record: ${document.id}`)
    
    // บันทึกชิ้นส่วนโดยไม่มี embedding ก่อน
    const chunkPromises = chunks.map((chunk, index) => 
      prisma.ragChunk.create({
        data: {
          documentId: document.id,
          content: chunk,
          chunkIndex: index,
          embedding: null // จะเพิ่ม embedding ทีหลัง
        }
      })
    )

    await Promise.all(chunkPromises)

    // อัพเดทสถานะเอกสาร
    await prisma.ragDocument.update({
      where: { id: document.id },
      data: {
        status: 'completed',
        totalChunks: chunks.length,
        processedAt: new Date()
      }
    })

    console.log(`✅ Document processing completed: ${chunks.length} chunks`)

    return NextResponse.json({ 
      success: true, 
      documentId: document.id,
      filename: file.name,
      totalChunks: chunks.length,
      message: `อัพโหลดเอกสาร "${file.name}" สำเร็จ (${chunks.length} ชิ้นส่วน)`
    })

  } catch (error) {
    console.error('❌ Simple upload error:', error)
    return NextResponse.json({ 
      error: 'เกิดข้อผิดพลาดในการอัพโหลด: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 })
  }
}