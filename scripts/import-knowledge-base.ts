import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function importKnowledgeBase() {
  try {
    // Read JSON file
    const jsonPath = process.argv[2]
    if (!jsonPath) {
      console.error('❌ Please provide JSON file path')
      console.log('Usage: npx tsx scripts/import-knowledge-base.ts <path-to-json>')
      process.exit(1)
    }

    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
    
    if (!jsonData.knowledge || !Array.isArray(jsonData.knowledge)) {
      console.error('❌ Invalid JSON format')
      process.exit(1)
    }

    console.log(`📚 Importing ${jsonData.knowledge.length} knowledge items...`)

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

        let category = 'general'
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
        console.log(`✅ Imported: ${question.substring(0, 50)}...`)
      } catch (error) {
        console.error('❌ Error importing item:', error)
        skipped++
      }
    }

    console.log(`\n✨ Import completed!`)
    console.log(`✅ Imported: ${imported}`)
    console.log(`⏭️  Skipped: ${skipped}`)

  } catch (error) {
    console.error('❌ Import failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

importKnowledgeBase()
