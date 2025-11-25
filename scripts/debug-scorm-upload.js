const { scormService } = require('../src/lib/scorm-service.ts')
const fs = require('fs')
const path = require('path')

async function debugScormUpload() {
  try {
    console.log('🔍 Debugging SCORM Upload...')
    
    // Check if sample SCORM file exists
    const sampleScormPath = path.join(process.cwd(), 'public', 'scorm-sample-demo.zip')
    console.log('📁 Checking sample SCORM file:', sampleScormPath)
    
    if (!fs.existsSync(sampleScormPath)) {
      console.error('❌ Sample SCORM file not found!')
      return
    }
    
    const stats = fs.statSync(sampleScormPath)
    console.log('📊 File size:', (stats.size / 1024 / 1024).toFixed(2), 'MB')
    
    // Check upload directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'scorm')
    console.log('📂 Upload directory:', uploadDir)
    
    if (!fs.existsSync(uploadDir)) {
      console.log('📁 Creating upload directory...')
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    
    // Test file reading
    console.log('📖 Reading SCORM file...')
    const fileBuffer = fs.readFileSync(sampleScormPath)
    console.log('✅ File read successfully, size:', fileBuffer.length, 'bytes')
    
    // Test SCORM service initialization
    console.log('🔧 Testing SCORM service...')
    const service = new (require('../src/lib/scorm-service.ts').ScormService)()
    console.log('✅ SCORM service initialized')
    
    console.log('✅ All checks passed! SCORM upload should work.')
    
  } catch (error) {
    console.error('❌ Error during debug:', error)
  }
}

debugScormUpload()