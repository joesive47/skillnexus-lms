import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import * as XLSX from 'xlsx'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const data = XLSX.utils.sheet_to_json(worksheet)

    let imported = 0
    
    for (const row of data as any[]) {
      if (row.question && row.answer) {
        await prisma.chatKnowledgeBase.create({
          data: {
            question: String(row.question),
            answer: String(row.answer),
            category: String(row.category || 'general'),
            courseId: row.courseId || null
          }
        })
        imported++
      }
    }

    return NextResponse.json({ imported, total: data.length })
  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json({ error: 'Failed to import data' }, { status: 500 })
  }
}