import prisma from '../src/lib/prisma'
import * as fs from 'fs'
import * as path from 'path'

async function importKnowledgeBase() {
  try {
    console.log('🚀 Starting Knowledge Base Import...')
    
    // Read JSON file
    const jsonPath = path.join(process.cwd(), 'knowledge-base.json')
    const rawData = fs.readFileSync(jsonPath, 'utf-8')
    const data = JSON.parse(rawData)
    
    console.log(`📚 Found ${data.knowledge.length} knowledge chunks`)
    
    // Create document
    const document = await prisma.document.create({
      data: {
        filename: data.metadata.documents[0].filename,
        fileType: data.metadata.documents[0].fileType,
        status: 'completed',
        totalChunks: data.metadata.totalChunks,
        metadata: JSON.stringify(data.metadata)
      }
    })
    
    console.log(`✅ Document created: ${document.id}`)
    
    // Import chunks
    let imported = 0
    for (const chunk of data.knowledge) {
      await prisma.documentChunk.create({
        data: {
          documentId: document.id,
          content: chunk.content,
          chunkIndex: imported,
          metadata: JSON.stringify({
            originalId: chunk.id,
            documentName: chunk.documentName
          })
        }
      })
      imported++
      if (imported % 3 === 0) {
        console.log(`📦 Imported ${imported}/${data.knowledge.length} chunks`)
      }
    }
    
    console.log(`✅ Successfully imported ${imported} knowledge chunks!`)
    console.log(`🎉 Knowledge Base is ready for production!`)
    
  } catch (error) {
    console.error('❌ Import failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

importKnowledgeBase()
