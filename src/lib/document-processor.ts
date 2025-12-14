import mammoth from 'mammoth'
import * as XLSX from 'xlsx'
const pdf = require('pdf-parse')
import { splitTextIntoChunks, generateEmbedding } from './rag-service'
import prisma from './prisma'

export async function processPDF(buffer: Buffer): Promise<string> {
  const data = await pdf(buffer)
  return data.text
}

export async function processWord(buffer: Buffer): Promise<string> {
  try {
    console.log('📄 Processing Word document with mammoth...')
    const result = await mammoth.extractRawText({ buffer })
    console.log('✅ Word document processed successfully, text length:', result.value.length)
    
    if (result.messages && result.messages.length > 0) {
      console.log('⚠️ Mammoth warnings:', result.messages)
    }
    
    return result.value
  } catch (error) {
    console.error('❌ Error processing Word document:', error)
    throw new Error(`Failed to process Word document: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function processExcel(buffer: Buffer): Promise<string> {
  const workbook = XLSX.read(buffer, { type: 'buffer' })
  let text = ''
  
  workbook.SheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 })
    text += `\n=== ${sheetName} ===\n`
    text += data.map((row: any) => row.join(' | ')).join('\n')
  })
  
  return text
}

export async function processURL(url: string): Promise<string> {
  const response = await fetch(url)
  const html = await response.text()
  
  const text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  
  return text
}

export async function processDocument(
  file: File | null,
  url: string | null,
  courseId?: string,
  userId?: string
) {
  let text = ''
  let filename = ''
  let fileType = ''
  let sourceUrl = url || undefined

  if (file) {
    filename = file.name
    fileType = file.type
    const buffer = Buffer.from(await file.arrayBuffer())
    const fileExtension = filename.toLowerCase().split('.').pop()

    console.log(`📁 Processing file: ${filename}`, {
      type: file.type,
      extension: fileExtension,
      size: buffer.length
    })
    
    try {
      if (file.type === 'application/pdf' || fileExtension === 'pdf') {
        console.log('📄 Processing as PDF...')
        text = await processPDF(buffer)
      } else if (
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.type === 'application/msword' ||
        file.type === 'application/octet-stream' || // บางครั้ง .docx อาจมี MIME type นี้
        fileExtension === 'docx' ||
        fileExtension === 'doc'
      ) {
        console.log('📄 Processing as Word document...')
        text = await processWord(buffer)
      } else if (
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel' ||
        fileExtension === 'xlsx' ||
        fileExtension === 'xls'
      ) {
        console.log('📈 Processing as Excel...')
        text = await processExcel(buffer)
      } else if (file.type.startsWith('text/') || fileExtension === 'txt') {
        console.log('📄 Processing as text file...')
        text = buffer.toString('utf-8')
      } else {
        console.error('❌ Unsupported file type:', { type: file.type, extension: fileExtension })
        throw new Error(`Unsupported file type: ${file.type} (.${fileExtension}). Supported types: PDF, Word (.docx/.doc), Excel (.xlsx/.xls), Text (.txt)`)
      }
      
      console.log(`✅ Text extracted successfully, length: ${text.length} characters`)
    } catch (error) {
      console.error('❌ Error processing file:', error)
      
      // ให้ข้อมูลเพิ่มเติมสำหรับการ debug
      if (error instanceof Error && error.message.includes('mammoth')) {
        throw new Error(`Failed to process Word document (.${fileExtension}): The file may be corrupted or not a valid Word document. Please try with a different .docx file.`)
      }
      
      throw new Error(`Failed to process ${fileExtension?.toUpperCase()} file: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  } else if (url) {
    filename = new URL(url).pathname.split('/').pop() || 'web-content'
    fileType = 'text/html'
    text = await processURL(url)
  } else {
    throw new Error('No file or URL provided')
  }

  const document = await prisma.document.create({
    data: {
      filename,
      fileType,
      sourceUrl,
      courseId,
      uploadedBy: userId,
      status: 'processing',
      totalChunks: 0
    }
  })

  const chunks = splitTextIntoChunks(text)
  
  for (let i = 0; i < chunks.length; i++) {
    const embedding = await generateEmbedding(chunks[i])
    
    await prisma.documentChunk.create({
      data: {
        documentId: document.id,
        content: chunks[i],
        embedding: JSON.stringify(embedding),
        chunkIndex: i,
        metadata: JSON.stringify({ length: chunks[i].length })
      }
    })
  }

  await prisma.document.update({
    where: { id: document.id },
    data: {
      status: 'completed',
      totalChunks: chunks.length
    }
  })

  return document
}
