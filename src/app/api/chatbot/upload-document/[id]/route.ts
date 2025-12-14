import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: documentId } = await params

    if (!documentId) {
      return NextResponse.json({ error: 'ไม่พบ ID เอกสาร' }, { status: 400 })
    }

    // ตรวจสอบว่าเอกสารมีอยู่จริง
    const document = await prisma.ragDocument.findUnique({
      where: { id: documentId },
      include: {
        chunks: true
      }
    })

    if (!document) {
      return NextResponse.json({ error: 'ไม่พบเอกสาร' }, { status: 404 })
    }

    console.log(`🗑️ Deleting document: ${document.filename} (${document.chunks.length} chunks)`)

    // ลบ chunks ก่อน (cascade delete ควรจัดการให้ แต่เพื่อความแน่ใจ)
    await prisma.ragChunk.deleteMany({
      where: { documentId }
    })

    // ลบเอกสาร
    await prisma.ragDocument.delete({
      where: { id: documentId }
    })

    console.log(`✅ Document deleted successfully: ${documentId}`)

    return NextResponse.json({ 
      success: true, 
      message: 'ลบเอกสารเรียบร้อยแล้ว' 
    })

  } catch (error) {
    console.error('❌ Delete document error:', error)
    return NextResponse.json({ 
      error: 'เกิดข้อผิดพลาดในการลบเอกสาร: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 })
  }
}

// GET สำหรับดูรายละเอียดเอกสาร
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: documentId } = await params

    const document = await prisma.ragDocument.findUnique({
      where: { id: documentId },
      include: {
        chunks: {
          select: {
            id: true,
            chunkIndex: true,
            content: true,
            embedding: true
          },
          orderBy: {
            chunkIndex: 'asc'
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
      fileType: document.fileType,
      fileSize: document.fileSize,
      status: document.status,
      totalChunks: document.totalChunks,
      processedAt: document.processedAt,
      errorMessage: document.errorMessage,
      createdAt: document.createdAt,
      chunks: document.chunks.map(chunk => ({
        id: chunk.id,
        chunkIndex: chunk.chunkIndex,
        content: chunk.content.substring(0, 200) + (chunk.content.length > 200 ? '...' : ''),
        hasEmbedding: !!chunk.embedding
      }))
    })

  } catch (error) {
    console.error('❌ Get document error:', error)
    return NextResponse.json({ 
      error: 'เกิดข้อผิดพลาดในการดึงข้อมูลเอกสาร' 
    }, { status: 500 })
  }
}