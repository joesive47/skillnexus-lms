import { NextRequest, NextResponse } from 'next/server'
import { adminAccessDenied } from '@/lib/access-control'
import prisma from '@/lib/prisma'
import { processDocument } from '@/lib/document-processor-optimized'
import { splitTextIntoChunksFast, generateEmbeddingFast } from '@/lib/rag-ultra-fast'

export async function POST(request: NextRequest) {
  const denied = await adminAccessDenied()
  if (denied) return denied
  try {
    console.log('🚀 Starting RAG document upload...')
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    const url = formData.get('url') as string | null
    
    console.log('📋 Form data received:', {
      hasFile: !!file,
      fileName: file?.name,
      fileSize: file?.size,
      hasUrl: !!url,
      url: url
    })
    
    if (!file && !url) {
      return NextResponse.json({ error: 'กรุณาเลือกไฟล์หรือใส่ URL' }, { status: 400 })
    }
    
    if (!file) {
      return NextResponse.json({ error: 'ขณะนี้รองรับเฉพาะการอัพโหลดไฟล์เท่านั้น' }, { status: 400 })
    }

    // ตรวจสอบประเภทไฟล์
    const allowedTypes = ['txt', 'docx', 'doc', 'pdf', 'xlsx', 'xls']
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    
    if (!fileExtension || !allowedTypes.includes(fileExtension)) {
      return NextResponse.json({ 
        error: 'รองรับเฉพาะไฟล์ PDF, Word (.doc, .docx), Excel (.xls, .xlsx), TXT เท่านั้น' 
      }, { status: 400 })
    }

    // ตรวจสอบขนาดไฟล์ (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ 
        error: 'ขนาดไฟล์ต้องไม่เกิน 10MB' 
      }, { status: 400 })
    }

    // สร้างรายการเอกสารในฐานข้อมูล
    const document = await prisma.ragDocument.create({
      data: {
        filename: file.name,
        fileType: fileExtension,
        fileSize: file.size,
        status: 'processing',
        totalChunks: 0
      }
    })

    console.log(`📄 Created document record: ${document.id}`)

    // ประมวลผลเอกสารแบบ async
    processDocumentAsync(document.id, file)

    return NextResponse.json({ 
      success: true, 
      documentId: document.id,
      message: 'เริ่มประมวลผลเอกสารแล้ว กรุณารอสักครู่...' 
    })

  } catch (error) {
    console.error('❌ Document upload error:', error)
    return NextResponse.json({ 
      error: 'เกิดข้อผิดพลาดในการอัพโหลด: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 })
  }
}

async function processDocumentAsync(documentId: string, file: File) {
  try {
    console.log(`⚡ Processing document: ${file.name} (${file.size} bytes)`)
    
    // อ่านเนื้อหาไฟล์
    const buffer = await file.arrayBuffer()
    console.log(`📋 Buffer size: ${buffer.byteLength} bytes`)
    
    const content = await processDocument(buffer, file.name)
    console.log(`📝 Content extracted: ${content?.length || 0} characters`)

    if (!content || content.trim().length < 10) {
      throw new Error('ไม่สามารถอ่านเนื้อหาไฟล์ได้หรือไฟล์ว่าง')
    }

    console.log(`📝 Extracted ${content.length} characters`)

    // แบ่งเนื้อหาเป็นชิ้นส่วนด้วย ultra-fast method
    const chunks = splitTextIntoChunksFast(content)
    
    if (chunks.length === 0) {
      throw new Error('ไม่สามารถแบ่งเนื้อหาเป็นชิ้นส่วนได้')
    }

    console.log(`🔪 Split into ${chunks.length} chunks`)
    
    // บันทึกชิ้นส่วนและสร้าง embedding
    const batchSize = parseInt(process.env.RAG_BATCH_SIZE || '5')
    let processedChunks = 0
    
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize)
      
      const chunkPromises = batch.map(async (chunk, batchIndex) => {
        const index = i + batchIndex
        
        try {
          // สร้าง embedding
          const embedding = await generateEmbeddingFast(chunk)
          
          // บันทึกลงฐานข้อมูล
          return prisma.ragChunk.create({
            data: {
              documentId,
              content: chunk,
              chunkIndex: index,
              embedding: JSON.stringify(embedding)
            }
          })
        } catch (error) {
          console.error(`❌ Error processing chunk ${index}:`, error)
          // บันทึกโดยไม่มี embedding
          return prisma.ragChunk.create({
            data: {
              documentId,
              content: chunk,
              chunkIndex: index,
              embedding: null
            }
          })
        }
      })

      await Promise.all(chunkPromises)
      processedChunks += batch.length
      
      console.log(`⚡ Processed ${processedChunks}/${chunks.length} chunks`)
    }

    // อัพเดทสถานะเอกสาร
    await prisma.ragDocument.update({
      where: { id: documentId },
      data: {
        status: 'completed',
        totalChunks: chunks.length,
        processedAt: new Date()
      }
    })

    console.log(`✅ Document processing completed: ${chunks.length} chunks`)

  } catch (error) {
    console.error('❌ Document processing error:', error)
    
    // อัพเดทสถานะเป็น failed
    await prisma.ragDocument.update({
      where: { id: documentId },
      data: {
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      }
    })
  }
}

// API สำหรับตรวจสอบสถานะ
export async function GET(request: NextRequest) {
  const denied = await adminAccessDenied()
  if (denied) return denied
  try {
    const { searchParams } = new URL(request.url)
    const documentId = searchParams.get('documentId')
    
    if (documentId) {
      const document = await prisma.ragDocument.findUnique({
        where: { id: documentId },
        include: {
          chunks: {
            select: {
              id: true,
              chunkIndex: true,
              embedding: true
            }
          }
        }
      })
      
      if (!document) {
        return NextResponse.json({ error: 'ไม่พบเอกสาร' }, { status: 404 })
      }
      
      return NextResponse.json({
        id: document.id,
        filename: document.filename,
        status: document.status,
        totalChunks: document.totalChunks,
        processedChunks: document.chunks.length,
        embeddedChunks: document.chunks.filter(c => c.embedding).length,
        errorMessage: document.errorMessage
      })
    }
    
    // แสดงรายการเอกสารทั้งหมด
    const documents = await prisma.ragDocument.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10
    })
    
    return NextResponse.json({ documents })
    
  } catch (error) {
    console.error('❌ Status check error:', error)
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด' }, { status: 500 })
  }
}
