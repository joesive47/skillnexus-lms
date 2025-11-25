import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function testExcelSupport() {
  try {
    console.log('🧪 Testing Excel support...')
    
    // ตรวจสอบว่า XLSX library ติดตั้งแล้วหรือไม่
    const XLSX = await import('xlsx')
    console.log('✅ XLSX library is available')
    
    // สร้างไฟล์ Excel ทดสอบ
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.aoa_to_sheet([
      ['หัวข้อ', 'เนื้อหา', 'หมายเหตุ'],
      ['การใช้งาน LMS', 'ระบบจัดการการเรียนรู้', 'สำหรับนักเรียนและครู'],
      ['Chatbot', 'ตอบคำถามอัตโนมัติ', 'ใช้ AI ในการตอบ'],
      ['การประเมินผล', 'แบบทดสอบออนไลน์', 'ให้คะแนนทันที'],
      ['SCORM', 'รองรับมาตรฐาน SCORM', 'สำหรับเนื้อหาแบบโต้ตอบ'],
      ['วิดีโอ', 'เล่นวิดีโอแบบ Anti-Skip', 'ป้องกันการข้ามเนื้อหา']
    ])
    XLSX.utils.book_append_sheet(wb, ws, 'Knowledge')
    
    const excelPath = path.join(__dirname, 'public', 'test-knowledge.xlsx')
    XLSX.writeFile(wb, excelPath)
    console.log('✅ Created test Excel file:', excelPath)
    
    // ทดสอบการอ่านไฟล์ Excel
    const buffer = fs.readFileSync(excelPath)
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    let allText = ''
    
    workbook.SheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName]
      const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' })
      
      const sheetText = sheetData
        .map((row) => row.join(' | '))
        .filter(row => row.trim().length > 0)
        .join('\n')
      
      if (sheetText.trim().length > 0) {
        allText += `\n=== ${sheetName} ===\n${sheetText}\n`
      }
    })
    
    console.log(`✅ Excel processing successful: ${allText.length} characters`)
    console.log('📊 Excel content preview:')
    console.log(allText.substring(0, 300) + '...')
    
    console.log('\n🎉 Excel support test completed!')
    console.log('\n📋 Summary:')
    console.log('- ✅ XLSX library is working')
    console.log('- ✅ Can create Excel files')
    console.log('- ✅ Can read Excel files')
    console.log('- ✅ Ready to upload .xlsx and .xls files')
    console.log('\n💡 You can now upload Excel files at: http://localhost:3000/dashboard/rag-management')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

testExcelSupport()