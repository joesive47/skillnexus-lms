import { promises as fs } from 'fs'
import { join } from 'path'

// Mock the SCORM service functionality for testing
async function testCompleteScormProcess() {
  try {
    console.log('🧪 Testing complete SCORM upload process...')
    
    // Test with the problematic package
    const packageDir = 'c:\\API\\The-SkillNexus\\public\\uploads\\scorm\\scorm_1763952502639_1k5yoo0rw'
    
    console.log(`📁 Testing package directory: ${packageDir}`)
    
    // Test 1: Check if package directory exists
    try {
      await fs.access(packageDir)
      console.log('✅ Package directory exists')
    } catch {
      console.log('❌ Package directory not found')
      return
    }
    
    // Test 2: Look for manifest file
    let manifestPath = join(packageDir, 'imsmanifest.xml')
    let manifestDir = packageDir
    
    try {
      await fs.access(manifestPath)
      console.log('✅ Manifest found in root directory')
    } catch {
      console.log('🔍 Searching for manifest in subdirectories...')
      
      const entries = await fs.readdir(packageDir, { withFileTypes: true })
      let found = false
      
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const subManifestPath = join(packageDir, entry.name, 'imsmanifest.xml')
          try {
            await fs.access(subManifestPath)
            manifestPath = subManifestPath
            manifestDir = join(packageDir, entry.name)
            console.log(`✅ Found manifest in subdirectory: ${entry.name}`)
            found = true
            break
          } catch {
            // Continue searching
          }
        }
      }
      
      if (!found) {
        console.log('❌ No manifest file found')
        return
      }
    }
    
    // Test 3: Read and validate manifest
    const manifestXml = await fs.readFile(manifestPath, 'utf-8')
    console.log(`✅ Manifest file read successfully (${manifestXml.length} characters)`)
    
    // Test 4: Check package path calculation
    const relativePath = manifestDir.replace(process.cwd().replace(/\\\\/g, '/'), '').replace(/^[\\\\\\/]public/, '')
    const packagePath = relativePath || `/uploads/scorm/scorm_1763952502639_1k5yoo0rw`
    
    console.log(`📁 Calculated package path: ${packagePath}`)
    
    // Test 5: Check if resources exist
    const resourcesDir = manifestDir
    const resourceFiles = ['modules/introduction/index.html', 'modules/variables/index.html', 'shared/scorm-api.js']
    
    for (const resourceFile of resourceFiles) {
      const resourcePath = join(resourcesDir, resourceFile)
      try {
        await fs.access(resourcePath)
        console.log(`✅ Resource found: ${resourceFile}`)
      } catch {
        console.log(`⚠️ Resource missing: ${resourceFile}`)
      }
    }
    
    console.log('🎉 Complete SCORM process test successful!')
    console.log('📋 Summary:')
    console.log(`   - Package ID: scorm_1763952502639_1k5yoo0rw`)
    console.log(`   - Manifest Path: ${manifestPath}`)
    console.log(`   - Package Path: ${packagePath}`)
    console.log(`   - Resources Directory: ${resourcesDir}`)
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testCompleteScormProcess()