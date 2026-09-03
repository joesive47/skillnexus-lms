import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { AccessError, publicError, requireAdmin } from '@/lib/access-control'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '50', 10) || 50, 1), 100)
    const offset = Math.max(parseInt(searchParams.get('offset') || '0', 10) || 0, 0)
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const where: Prisma.RagDocumentWhereInput = {}
    
    if (status && status !== 'all') {
      where.status = status
    }
    
    if (search) {
      where.filename = {
        contains: search,
        mode: 'insensitive'
      }
    }

    const documents = await prisma.ragDocument.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      include: {
        _count: {
          select: {
            chunks: true
          }
        }
      }
    })

    const total = await prisma.ragDocument.count({ where })

    return NextResponse.json({
      success: true,
      documents: documents.map(doc => ({
        ...doc,
        totalChunks: doc._count.chunks
      })),
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })

  } catch (error) {
    console.error('❌ Documents fetch error:', error)
    return NextResponse.json({ 
      error: publicError(error)
    }, { status: error instanceof AccessError ? error.status : 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const documentId = searchParams.get('id')

    if (!documentId) {
      return NextResponse.json({ error: 'Document ID required' }, { status: 400 })
    }

    // Delete chunks first (cascade should handle this, but being explicit)
    await prisma.ragChunk.deleteMany({
      where: { documentId }
    })

    // Delete document
    await prisma.ragDocument.delete({
      where: { id: documentId }
    })

    return NextResponse.json({
      success: true,
      message: 'Document deleted successfully'
    })

  } catch (error) {
    console.error('❌ Document delete error:', error)
    return NextResponse.json({ 
      error: publicError(error)
    }, { status: error instanceof AccessError ? error.status : 500 })
  }
}
