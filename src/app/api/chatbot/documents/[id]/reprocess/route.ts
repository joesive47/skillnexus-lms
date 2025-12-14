import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const document = await prisma.ragDocument.findUnique({
      where: { id }
    })

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Update status to processing
    await prisma.ragDocument.update({
      where: { id },
      data: {
        status: 'processing',
        errorMessage: null,
        updatedAt: new Date()
      }
    })

    // Delete existing chunks
    await prisma.ragChunk.deleteMany({
      where: { documentId: id }
    })

    // For reprocessing, we need the original file content
    // Since we don't store it, mark as failed with helpful message
    await prisma.ragDocument.update({
      where: { id },
      data: {
        status: 'failed',
        errorMessage: 'ไม่สามารถประมวลผลใหม่ได้: ไม่มีไฟล์ต้นฉบับ กรุณาอัพโหลดเอกสารใหม่',
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'กรุณาอัพโหลดเอกสารใหม่เพื่อประมวลผลใหม่'
    })

  } catch (error) {
    console.error('❌ Document reprocess error:', error)
    return NextResponse.json({ 
      error: 'Failed to start reprocessing',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}