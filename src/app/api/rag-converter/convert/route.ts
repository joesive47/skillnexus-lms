import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { documentIds } = await request.json()
    console.log('Received documentIds:', documentIds)

    if (!documentIds || !Array.isArray(documentIds) || documentIds.length === 0) {
      console.log('Invalid documentIds:', documentIds)
      return NextResponse.json(
        { error: 'กรุณาเลือกเอกสารอย่างน้อย 1 ไฟล์' },
        { status: 400 }
      )
    }

    // ดึงข้อมูลเอกสารและ chunks
    const documents = await prisma.ragDocument.findMany({
      where: {
        id: { in: documentIds },
        status: 'completed'
      },
      include: {
        chunks: true
      }
    })

    console.log('Found documents:', documents.length)
    console.log('Documents:', documents.map(d => ({ id: d.id, filename: d.filename, chunks: d.chunks.length })))

    if (documents.length === 0) {
      console.log('No documents found for IDs:', documentIds)
      return NextResponse.json(
        { error: 'ไม่พบเอกสารที่เลือก' },
        { status: 404 }
      )
    }

    // สร้าง Knowledge Base
    const knowledgeBase = {
      metadata: {
        createdAt: new Date().toISOString(),
        totalDocuments: documents.length,
        totalChunks: documents.reduce((sum, doc) => sum + doc.chunks.length, 0),
        documents: documents.map(doc => ({
          id: doc.id,
          filename: doc.filename,
          fileType: doc.fileType,
          totalChunks: doc.chunks.length
        }))
      },
      knowledge: documents.flatMap(doc => 
        doc.chunks.map(chunk => ({
          id: chunk.id,
          documentId: doc.id,
          documentName: doc.filename,
          content: chunk.content,
          metadata: {},
          embedding: chunk.embedding
        }))
      )
    }

    // สร้าง blob URL สำหรับดาวน์โหลด
    const jsonString = JSON.stringify(knowledgeBase, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    
    // ใน production ควรเก็บไฟล์ใน S3 หรือ storage service
    // ตอนนี้ส่งข้อมูลกลับไปให้ client สร้าง download link
    
    return NextResponse.json({
      success: true,
      totalChunks: knowledgeBase.metadata.totalChunks,
      totalDocuments: knowledgeBase.metadata.totalDocuments,
      knowledgeBase: knowledgeBase, // ส่งข้อมูลกลับไปให้ client
      message: `สร้าง Knowledge Base สำเร็จ จาก ${documents.length} เอกสาร`
    })

  } catch (error) {
    console.error('Error converting to knowledge base:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการแปลง Knowledge Base' },
      { status: 500 }
    )
  }
}