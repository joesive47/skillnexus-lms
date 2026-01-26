import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    const course = await prisma.course.create({
      data: {
        id: 'ai-architect-001',
        title: "AI Architect's Blueprint: จากไอเดียฟุ้งสู่ระบบจริงด้วย Amazon Q & VS Code",
        description: 'เรียนรู้การใช้ Amazon Q และ VS Code ในการพัฒนาระบบจริง',
        price: 0,
        published: true
      }
    })

    const lesson = await prisma.lesson.create({
      data: {
        id: 'lesson-prompt-eng-001',
        courseId: course.id,
        title: 'Prompt Engineering Practice',
        type: 'SCORM',
        lessonType: 'SCORM',
        order: 1,
        duration: 30
      }
    })

    const scormPackage = await prisma.scormPackage.create({
      data: {
        lessonId: lesson.id,
        packagePath: '/scorm/prompt-engineering',
        manifest: '{"identifier":"SCORM_PROMPT_ENG_001","title":"Prompt Engineering","version":"1.2"}',
        version: '1.2',
        title: 'Prompt Engineering for Architects',
        identifier: 'SCORM_PROMPT_ENG_001'
      }
    })

    return NextResponse.json({ success: true, courseId: course.id, lessonId: lesson.id })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
