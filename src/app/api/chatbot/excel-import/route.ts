import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { addExcelQAItems, getExcelQAStats } from '@/lib/excel-qa-utils'

interface ExcelQARow {
  question: string
  answer: string
  category?: string
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'ไม่พบไฟล์' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      return NextResponse.json(
        { error: 'รองรับเฉพาะไฟล์ .xlsx และ .xls เท่านั้น' },
        { status: 400 }
      )
    }

    // Read Excel file
    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    
    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]

    if (jsonData.length < 2) {
      return NextResponse.json(
        { error: 'ไฟล์ต้องมีอย่างน้อย 2 แถว (หัวข้อ + ข้อมูล)' },
        { status: 400 }
      )
    }

    // Process data (skip header row)
    const qaItems: ExcelQARow[] = []
    const errors: string[] = []

    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i]
      
      if (!row || row.length < 2) continue
      
      const question = String(row[0] || '').trim()
      const answer = String(row[1] || '').trim()
      const category = String(row[2] || 'general').trim()

      if (!question || !answer) {
        errors.push(`แถว ${i + 1}: คำถามหรือคำตอบว่างเปล่า`)
        continue
      }

      if (question.length < 3) {
        errors.push(`แถว ${i + 1}: คำถามสั้นเกินไป`)
        continue
      }

      if (answer.length < 5) {
        errors.push(`แถว ${i + 1}: คำตอบสั้นเกินไป`)
        continue
      }

      qaItems.push({ question, answer, category })
    }

    if (qaItems.length === 0) {
      return NextResponse.json(
        { 
          error: 'ไม่พบข้อมูลที่ถูกต้อง',
          details: errors
        },
        { status: 400 }
      )
    }

    // Save to in-memory database
    const newItems = qaItems.map(item => ({
      id: `excel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      question: item.question,
      answer: item.answer,
      category: item.category || 'general',
      source: 'excel' as const,
      createdAt: new Date().toISOString()
    }))

    addExcelQAItems(newItems)

    console.log(`📊 Excel import: ${newItems.length} items added to database`)

    return NextResponse.json({
      success: true,
      imported: newItems.length,
      errors: errors.length > 0 ? errors : undefined,
      preview: newItems.slice(0, 5).map(item => ({
        question: item.question,
        answer: item.answer,
        category: item.category
      }))
    })

  } catch (error) {
    console.error('❌ Excel import error:', error)
    
    return NextResponse.json({
      error: 'เกิดข้อผิดพลาดในการประมวลผลไฟล์',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  const stats = getExcelQAStats()
  return NextResponse.json({
    status: 'Excel Q&A Import API',
    ...stats
  })
}

