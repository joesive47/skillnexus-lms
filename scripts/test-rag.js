import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testRAG() {
  console.log('🧪 Testing RAG System...\n')

  // 1. Check documents
  const documents = await prisma.document.findMany({
    include: {
      _count: {
        select: { chunks: true }
      }
    }
  })

  console.log(`📄 Documents: ${documents.length}`)
  documents.forEach(doc => {
    console.log(`  - ${doc.filename} (${doc._count.chunks} chunks) [${doc.status}]`)
  })

  // 2. Check chunks
  const totalChunks = await prisma.documentChunk.count()
  console.log(`\n📦 Total Chunks: ${totalChunks}`)

  // 3. Sample chunk
  const sampleChunk = await prisma.documentChunk.findFirst({
    include: { document: true }
  })

  if (sampleChunk) {
    console.log(`\n📝 Sample Chunk:`)
    console.log(`  Document: ${sampleChunk.document.filename}`)
    console.log(`  Content: ${sampleChunk.content.substring(0, 100)}...`)
    console.log(`  Has Embedding: ${sampleChunk.embedding ? 'Yes' : 'No'}`)
  }

  // 4. Check chat sessions
  const sessions = await prisma.chatSession.count()
  const messages = await prisma.chatMessage.count()
  console.log(`\n💬 Chat Sessions: ${sessions}`)
  console.log(`📨 Chat Messages: ${messages}`)

  console.log('\n✅ RAG System Test Complete!')
}

testRAG()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
