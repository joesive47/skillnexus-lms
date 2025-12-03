const { scormService } = require('../src/lib/scorm-service.ts')
const fs = require('fs')
const path = require('path')

async function testScormFix() {
  try {
    console.log('🧪 Testing SCORM manifest parsing fix...')
    
    // Test with the existing uploaded package
    const packageDir = 'c:\\API\\The-SkillNexus\\public\\uploads\\scorm\\scorm_1763952502639_1k5yoo0rw'
    
    console.log(`📁 Testing package directory: ${packageDir}`)
    
    // Create a temporary ScormService instance for testing
    const service = new (class extends scormService.constructor {
      async testParseManifest(dir) {
        return this.parseManifest(dir)
      }
    })()
    
    const manifest = await service.testParseManifest(packageDir)
    
    console.log('✅ Manifest parsed successfully!')
    console.log(`📋 Package Title: ${manifest.title}`)
    console.log(`🆔 Package ID: ${manifest.identifier}`)
    console.log(`📦 Version: ${manifest.version}`)
    
    return true
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    return false
  }
}

testScormFix()