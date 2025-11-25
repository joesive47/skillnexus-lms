const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function importKnowledgeFromJson() {
  try {
    console.log('📚 Starting knowledge base import from JSON...')
    
    const jsonPath = path.join(__dirname, '../public/knowledge-base-1763982823686.json')
    
    if (!fs.existsSync(jsonPath)) {
      console.error('❌ JSON file not found:', jsonPath)
      return
    }

    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
    
    if (!jsonData.knowledge || !Array.isArray(jsonData.knowledge)) {
      console.error('❌ Invalid JSON structure')
      return
    }

    console.log(`📊 Found ${jsonData.knowledge.length} knowledge chunks`)

    // Clear existing knowledge chunks
    await prisma.knowledgeChunk.deleteMany({})
    console.log('🧹 Cleared existing knowledge chunks')

    let imported = 0
    
    for (const item of jsonData.knowledge) {
      if (!item.content || !item.documentName) {
        console.warn('⚠️ Skipping invalid item:', item.id)
        continue
      }

      await prisma.knowledgeChunk.create({
        data: {
          id: item.id,
          content: item.content.trim(),
          documentName: item.documentName,
          embedding: item.embedding,
          createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
          updatedAt: new Date()
        }
      })
      
      imported++
      
      if (imported % 5 === 0) {
        console.log(`📝 Imported ${imported}/${jsonData.knowledge.length} chunks`)
      }
    }

    console.log(`✅ Successfully imported ${imported} knowledge chunks`)
    console.log('📚 Knowledge base is ready for chatbot queries!')

  } catch (error) {
    console.error('❌ Import failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

importKnowledgeFromJson()