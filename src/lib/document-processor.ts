import mammoth from 'mammoth'
import * as XLSX from 'xlsx'
import { lookup } from 'node:dns/promises'
import { isIP } from 'node:net'
import pdf from 'pdf-parse'
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
    text += data.map(row => Array.isArray(row) ? row.join(' | ') : String(row)).join('\n')
  })
  
  return text
}

const MAX_REMOTE_DOCUMENT_BYTES = 5 * 1024 * 1024

function isPrivateIpv4(address: string) {
  const parts = address.split('.').map(Number)
  if (parts.length !== 4 || parts.some(part => !Number.isInteger(part) || part < 0 || part > 255)) return true
  const [a, b, c] = parts
  return a === 0 || a === 10 || a === 127 || a >= 224 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && (b === 0 || b === 168)) ||
    (a === 198 && (b === 18 || b === 19 || (b === 51 && c === 100))) ||
    (a === 203 && b === 0 && c === 113)
}

export function isPrivateAddress(address: string) {
  if (isIP(address) === 4) return isPrivateIpv4(address)
  const normalized = address.toLowerCase().split('%')[0]
  if (normalized.startsWith('::ffff:')) return isPrivateIpv4(normalized.slice(7))
  return normalized === '::' || normalized === '::1' ||
    normalized.startsWith('fc') || normalized.startsWith('fd') ||
    /^fe[89ab]/.test(normalized)
}

export async function assertSafeRemoteUrl(input: string) {
  let parsed: URL
  try { parsed = new URL(input) } catch { throw new Error('Invalid document URL') }
  if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password) {
    throw new Error('Only public HTTP(S) document URLs are allowed')
  }

  const hostname = parsed.hostname.toLowerCase().replace(/\.$/, '')
  if (!hostname || hostname === 'localhost' || hostname.endsWith('.localhost') || hostname.endsWith('.local')) {
    throw new Error('Private document URLs are not allowed')
  }

  const productionAllowlist = (process.env.DOCUMENT_FETCH_ALLOWED_HOSTS || '')
    .split(',').map(host => host.trim().toLowerCase()).filter(Boolean)
  if (process.env.NODE_ENV === 'production' && !productionAllowlist.includes(hostname)) {
    throw new Error('Document URL host is not allowed')
  }

  const addresses = isIP(hostname) ? [{ address: hostname }] : await lookup(hostname, { all: true, verbatim: true })
  if (!addresses.length || addresses.some(result => isPrivateAddress(result.address))) {
    throw new Error('Private document URLs are not allowed')
  }
  return parsed
}

export async function processURL(url: string): Promise<string> {
  const parsed = await assertSafeRemoteUrl(url)
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)
  try {
    const response = await fetch(parsed, { redirect: 'error', signal: controller.signal })
    if (!response.ok) throw new Error('Remote document could not be fetched')
    const contentType = response.headers.get('content-type')?.toLowerCase() || ''
    if (!contentType.startsWith('text/html') && !contentType.startsWith('text/plain')) {
      throw new Error('Remote document must be HTML or plain text')
    }
    const declaredSize = Number(response.headers.get('content-length') || 0)
    if (declaredSize > MAX_REMOTE_DOCUMENT_BYTES) throw new Error('Remote document is too large')

    const reader = response.body?.getReader()
    if (!reader) throw new Error('Remote document has no body')
    const chunks: Uint8Array[] = []
    let received = 0
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      received += value.byteLength
      if (received > MAX_REMOTE_DOCUMENT_BYTES) {
        await reader.cancel()
        throw new Error('Remote document is too large')
      }
      chunks.push(value)
    }
    const html = Buffer.concat(chunks).toString('utf8')

    return html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  } finally {
    clearTimeout(timeout)
  }
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
  const sourceUrl = url || undefined

  if (file) {
    if (file.size <= 0 || file.size > 10 * 1024 * 1024) throw new Error('Document is too large')
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
