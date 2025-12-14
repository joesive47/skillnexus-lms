import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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
      error: 'Failed to fetch document',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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
      error: 'Failed to delete document',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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
      error: 'Failed to update document',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}