import fs from 'fs'
import path from 'path'
import yauzl from 'yauzl'

async function testScormUpload() {
  try {
    console.log('🧪 Testing SCORM Upload Functionality...')
    
    // Check if sample SCORM file exists
    const sampleScormPath = path.join(process.cwd(), 'public', 'scorm-sample-demo.zip')
    console.log('📁 Sample SCORM file path:', sampleScormPath)
    
    if (!fs.existsSync(sampleScormPath)) {
      console.error('❌ Sample SCORM file not found!')
      console.log('📝 Available files in public directory:')
      const publicFiles = fs.readdirSync(path.join(process.cwd(), 'public'))
      publicFiles.forEach(file => {
        if (file.endsWith('.zip')) {
          console.log(`   - ${file}`)
        }
      })
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
      console.log('✅ Upload directory created')
    } else {
      console.log('✅ Upload directory exists')
    }
    
    // Test file permissions
    try {
      fs.accessSync(sampleScormPath, fs.constants.R_OK)
      console.log('✅ SCORM file is readable')
    } catch (error) {
      console.error('❌ Cannot read SCORM file:', error.message)
      return
    }
    
    try {
      fs.accessSync(uploadDir, fs.constants.W_OK)
      console.log('✅ Upload directory is writable')
    } catch (error) {
      console.error('❌ Cannot write to upload directory:', error.message)
      return
    }
    
    // Test ZIP file structure
    
    console.log('🔍 Testing ZIP file structure...')
    yauzl.open(sampleScormPath, { lazyEntries: true }, (err, zipfile) => {
      if (err) {
        console.error('❌ Failed to open ZIP file:', err.message)
        return
      }
      
      console.log('✅ ZIP file opened successfully')
      
      let hasManifest = false
      let fileCount = 0
      
      zipfile.readEntry()
      zipfile.on('entry', (entry) => {
        fileCount++
        console.log(`📄 Found: ${entry.fileName}`)
        
        if (entry.fileName === 'imsmanifest.xml') {
          hasManifest = true
          console.log('✅ Found imsmanifest.xml')
        }
        
        zipfile.readEntry()
      })
      
      zipfile.on('end', () => {
        console.log(`📊 Total files in ZIP: ${fileCount}`)
        
        if (hasManifest) {
          console.log('✅ Valid SCORM package structure detected')
        } else {
          console.error('❌ No imsmanifest.xml found - not a valid SCORM package')
        }
        
        console.log('🎉 SCORM upload test completed!')
      })
      
      zipfile.on('error', (err) => {
        console.error('❌ ZIP file error:', err.message)
      })
    })
    
  } catch (error) {
    console.error('❌ Test error:', error.message)
  }
}

testScormUpload()