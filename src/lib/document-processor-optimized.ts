import * as mammoth from 'mammoth'
import pdfParse from 'pdf-parse'
import * as XLSX from 'xlsx'

export async function processDocument(buffer: ArrayBuffer, filename: string): Promise<string | null> {
  try {
    console.log(`📄 Processing file: ${filename}`)
    const fileExtension = filename.split('.').pop()?.toLowerCase()
    
    switch (fileExtension) {
      case 'txt':
        const textContent = new TextDecoder('utf-8').decode(buffer)
        console.log(`📝 TXT content length: ${textContent.length}`)
        return textContent
      
      case 'docx':
        try {
          const result = await mammoth.extractRawText({ buffer: Buffer.from(buffer) })
          console.log(`📝 DOCX content length: ${result.value.length}`)
          if (result.messages.length > 0) {
            console.warn('DOCX warnings:', result.messages)
          }
          return result.value
        } catch (docxError) {
          console.error('DOCX processing failed:', docxError)
          throw new Error('ไม่สามารถอ่านไฟล์ DOCX ได้ กรุณาตรวจสอบไฟล์')
        }
      
      case 'doc':
        try {
          // สำหรับ .doc ใช้ mammoth เช่นกัน แต่อาจมีข้อจำกัด
          const result = await mammoth.extractRawText({ buffer: Buffer.from(buffer) })
          console.log(`📝 DOC content length: ${result.value.length}`)
          return result.value
        } catch (docError) {
          console.error('DOC processing failed:', docError)
          throw new Error('ไม่สามารถอ่านไฟล์ DOC ได้ กรุณาแปลงเป็น DOCX หรือ TXT')
        }
      
      case 'pdf':
        try {
          const pdfBuffer = Buffer.from(buffer)
          const data = await pdfParse(pdfBuffer)
          console.log(`📝 PDF content length: ${data.text.length}`)
          if (!data.text || data.text.trim().length === 0) {
            throw new Error('ไฟล์ PDF ไม่มีข้อความหรือเป็นไฟล์รูปภาพ')
          }
          return data.text
        } catch (pdfError) {
          console.error('PDF processing failed:', pdfError)
          throw new Error('ไม่สามารถอ่านไฟล์ PDF ได้ กรุณาตรวจสอบไฟล์')
        }
      
      case 'xlsx':
      case 'xls':
        try {
          const workbook = XLSX.read(buffer, { type: 'buffer' })
          let allText = ''
          
          workbook.SheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName]
            const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' }) as any[][]
            
            const sheetText = sheetData
              .map((row: any[]) => row.join(' | '))
              .filter((row: string) => row.trim().length > 0)
              .join('\n')
            
            if (sheetText.trim().length > 0) {
              allText += `\n=== ${sheetName} ===\n${sheetText}\n`
            }
          })
          
          console.log(`📊 Excel content length: ${allText.length}`)
          
          if (!allText || allText.trim().length === 0) {
            throw new Error('ไฟล์ Excel ไม่มีข้อมูลหรือเป็นไฟล์ว่าง')
          }
          
          return allText
        } catch (excelError) {
          console.error('Excel processing failed:', excelError)
          throw new Error('ไม่สามารถอ่านไฟล์ Excel ได้ กรุณาตรวจสอบไฟล์')
        }
      
      default:
        throw new Error(`ไม่รองรับไฟล์ประเภท: ${fileExtension}`)
    }
  } catch (error) {
    console.error('❌ Document processing error:', error)
    if (error instanceof Error) {
      throw error
    }
    return null
  }
}

export function extractKeywords(text: string): string[] {
  if (!text || text.trim().length === 0) return []
  
  // ลบ stopwords และสกัดคำสำคัญ (รวม English stopwords)
  const stopwords = [
    // Thai stopwords
    'และ', 'หรือ', 'แต่', 'เพราะ', 'ที่', 'ใน', 'บน', 'กับ', 'จาก', 'ไป', 'มา', 'ได้', 'เป็น', 'คือ', 'มี', 'ไม่', 'จะ', 'ก็', 'ของ', 'ให้', 'แล้ว', 'นี้', 'นั้น', 'เขา', 'เธอ', 'มัน', 'เรา', 'ท่าน', 'คุณ',
    // English stopwords
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those'
  ]
  
  const words = text
    .toLowerCase()
    .replace(/[^\u0E00-\u0E7Fa-zA-Z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopwords.includes(word))
  
  if (words.length === 0) return []
  
  // นับความถี่และเลือกคำที่ปรากฏบ่อย
  const wordCount = words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  return Object.entries(wordCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 15)
    .map(([word]) => word)
}

export function generateSummary(text: string, maxLength: number = 300): string {
  if (!text || text.trim().length === 0) return ''
  
  // แยกประโยคด้วย pattern ที่ครอบคลุมมากขึ้น
  const sentences = text
    .split(/[.!?\u0E2F\u0E46]+/) // รวม Thai sentence endings
    .map(s => s.trim())
    .filter(s => s.length > 15)
  
  if (sentences.length === 0) {
    return text.substring(0, maxLength) + (text.length > maxLength ? '...' : '')
  }
  
  if (sentences.length <= 2) {
    const summary = sentences.join(' ')
    return summary.length > maxLength 
      ? summary.substring(0, maxLength) + '...'
      : summary
  }
  
  // เลือกประโยคแรกและประโยคที่มีคำสำคัญมากที่สุด
  const keywords = extractKeywords(text)
  
  if (keywords.length === 0) {
    // ถ้าไม่มี keywords ให้เลือกประโยคแรกๆ
    const summary = sentences.slice(0, 3).join(' ')
    return summary.length > maxLength 
      ? summary.substring(0, maxLength) + '...'
      : summary
  }
  
  const scoredSentences = sentences.map(sentence => {
    const lowerSentence = sentence.toLowerCase()
    const score = keywords.reduce((acc, keyword) => {
      return acc + (lowerSentence.includes(keyword.toLowerCase()) ? 1 : 0)
    }, 0)
    return { sentence: sentence.trim(), score }
  })
  
  // เลือกประโยคที่มีคะแนนสูงสุด 2-3 ประโยค
  const topSentences = scoredSentences
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(s => s.sentence)
  
  const summary = topSentences.join(' ')
  return summary.length > maxLength 
    ? summary.substring(0, maxLength) + '...'
    : summary
}