import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'ไม่พบไฟล์' }, { status: 400 })
    }

    if (!file.name.endsWith('.json')) {
      return NextResponse.json({ error: 'รองรับเฉพาะไฟล์ JSON เท่านั้น' }, { status: 400 })
    }

    const content = await file.text()
    const jsonData = JSON.parse(content)

    if (!jsonData.knowledge || !Array.isArray(jsonData.knowledge)) {
      return NextResponse.json({ error: 'รูปแบบไฟล์ JSON ไม่ถูกต้อง' }, { status: 400 })
    }

    let imported = 0
    let skipped = 0

    for (const item of jsonData.knowledge) {
      if (!item.content || item.content.trim().length < 10) {
        skipped++
        continue
      }

      try {
        const content = item.content.trim()
        const lines = content.split('\n').filter((line: string) => line.trim())
        
        let question = lines[0] || 'คำถามจาก Knowledge Base'
        if (question.length > 200) {
          question = question.substring(0, 200) + '...'
        }

        const answer = content

        let category = 'knowledge-base'
        if (item.documentName) {
          if (item.documentName.includes('Security')) category = 'security'
          else if (item.documentName.includes('Tech')) category = 'technical'
          else if (item.documentName.includes('Core')) category = 'course'
        }

        await prisma.chatKnowledgeBase.create({
          data: {
            question,
            answer,
            category,
            isActive: true
          }
        })

        imported++
      } catch (error) {
        console.error('Error importing item:', error)
        skipped++
      }
    }

    return NextResponse.json({
      success: true,
      message: `นำเข้าข้อมูลสำเร็จ ${imported} รายการ${skipped > 0 ? `, ข้าม ${skipped} รายการ` : ''}`,
      imported,
      skipped
    })

  } catch (error) {
    console.error('Import JSON error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการนำเข้าข้อมูล' },
      { status: 500 }
    )
  }
}