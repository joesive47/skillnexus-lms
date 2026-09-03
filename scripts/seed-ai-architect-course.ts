import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function seedAIArchitectCourse() {
  console.log('🚀 Creating AI Architect Course...')

  try {
    // Create course
    const course = await prisma.course.create({
      data: {
        title: "AI Architect's Blueprint: จากไอเดียฟุ้งสู่ระบบจริงด้วย Amazon Q & VS Code",
        description: `เรียนรู้การใช้ Amazon Q และ VS Code ในการพัฒนาระบบจริง
        
📚 เนื้อหาที่จะได้เรียนรู้:
- Prompt Engineering สำหรับ Architects
- การใช้ Amazon Q ในการออกแบบระบบ
- VS Code Tips & Tricks
- สร้างระบบจริงด้วย AI Assistant

🎯 เหมาะสำหรับ:
- Software Architects
- Senior Developers
- Tech Leads
- ผู้ที่สนใจ AI-Assisted Development`,
        price: 0,
        published: true,
        imageUrl: '/images/ai-architect-course.jpg'
      }
    })

    console.log(`✅ Course created: ${course.id}`)

    // Create SCORM lesson
    const lesson = await prisma.lesson.create({
      data: {
        courseId: course.id,
        title: 'Prompt Engineering Practice',
        type: 'SCORM',
        lessonType: 'SCORM',
        order: 1,
        content: 'Interactive SCORM lesson for practicing prompt engineering',
        duration: 30
      }
    })

    console.log(`✅ Lesson created: ${lesson.id}`)

    // Create SCORM package entry
    const scormPackage = await prisma.scormPackage.create({
      data: {
        lessonId: lesson.id,
        packagePath: '/scorm/prompt-engineering',
        manifest: JSON.stringify({
          identifier: 'SCORM_PROMPT_ENG_001',
          title: 'Prompt Engineering for Architects',
          version: '1.2'
        }),
        version: '1.2',
        title: 'Prompt Engineering for Architects',
        identifier: 'SCORM_PROMPT_ENG_001'
      }
    })

    console.log(`✅ SCORM package created: ${scormPackage.id}`)

    // Copy SCORM files to public
    const sourceDir = path.join(process.cwd(), 'scorm-packages', 'prompt-engineering')
    const targetDir = path.join(process.cwd(), 'public', 'scorm', 'prompt-engineering')

    if (fs.existsSync(sourceDir)) {
      fs.mkdirSync(targetDir, { recursive: true })
      
      const files = ['index.html', 'scorm_functions.js', 'imsmanifest.xml']
      for (const file of files) {
        const src = path.join(sourceDir, file)
        const dest = path.join(targetDir, file)
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, dest)
          console.log(`✅ Copied: ${file}`)
        }
      }
    }

    console.log('\n🎉 Course setup complete!')
    console.log(`📚 Course ID: ${course.id}`)
    console.log(`📝 Lesson ID: ${lesson.id}`)
    console.log(`📦 SCORM Package ID: ${scormPackage.id}`)
    console.log(`\n🌐 View course at: http://localhost:3000/courses/${course.id}`)

  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seedAIArchitectCourse()
