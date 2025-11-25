import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // ตรวจสอบข้อมูลใน ragDocument table
    const ragDocuments = await prisma.ragDocument.findMany({
      include: {
        chunks: true,
        _count: {
          select: {
            chunks: true
          }
        }
      }
    })

    // ตรวจสอบข้อมูลใน document table (เก่า)
    const documents = await prisma.document.findMany({
      include: {
        chunks: true,
        _count: {
          select: {
            chunks: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      ragDocuments: {
        count: ragDocuments.length,
        data: ragDocuments.map(doc => ({
          id: doc.id,
          filename: doc.filename,
          status: doc.status,
          totalChunks: doc.totalChunks,
          actualChunks: doc._count.chunks,
          createdAt: doc.createdAt
        }))
      },
      documents: {
        count: documents.length,
        data: documents.map(doc => ({
          id: doc.id,
          filename: doc.filename,
          status: doc.status,
          totalChunks: doc.totalChunks,
          actualChunks: doc._count.chunks,
          createdAt: doc.createdAt
        }))
      }
    })

  } catch (error) {
    console.error('Debug API error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch debug data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}