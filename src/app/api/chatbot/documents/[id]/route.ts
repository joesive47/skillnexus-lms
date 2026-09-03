import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { AccessError, publicError, requireAdmin } from '@/lib/access-control'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()

    const { id } = await params
    const document = await prisma.ragDocument.findUnique({
      where: { id },
      include: {
        chunks: {
          select: {
            id: true,
            chunkIndex: true,
            content: true,
            embedding: true,
            keywords: true,
            summary: true,
            createdAt: true
          },
          orderBy: { chunkIndex: 'asc' }
        }
      }
    })

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      document: {
        ...document,
        chunks: document.chunks.map(chunk => ({
          ...chunk,
          hasEmbedding: !!chunk.embedding,
          embedding: undefined // Don't send the actual embedding data
        }))
      }
    })

  } catch (error) {
    console.error('❌ Document fetch error:', error)
    return NextResponse.json({ 
      error: publicError(error)
    }, { status: error instanceof AccessError ? error.status : 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()

    const { id } = await params
    // Check if document exists
    const document = await prisma.ragDocument.findUnique({
      where: { id }
    })

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Delete chunks first
    await prisma.ragChunk.deleteMany({
      where: { documentId: id }
    })

    // Delete document
    await prisma.ragDocument.delete({
      where: { id }
    })

    console.log(`✅ Document deleted: ${document.filename} (${id})`)

    return NextResponse.json({
      success: true,
      message: 'Document and all chunks deleted successfully'
    })

  } catch (error) {
    console.error('❌ Document delete error:', error)
    return NextResponse.json({ 
      error: publicError(error)
    }, { status: error instanceof AccessError ? error.status : 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()

    const { id } = await params
    const { filename, status } = await request.json()

    const document = await prisma.ragDocument.update({
      where: { id },
      data: {
        ...(filename && { filename }),
        ...(status && { status }),
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      document
    })

  } catch (error) {
    console.error('❌ Document update error:', error)
    return NextResponse.json({ 
      error: publicError(error)
    }, { status: error instanceof AccessError ? error.status : 500 })
  }
}
