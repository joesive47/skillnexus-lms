import { promises as fs } from 'fs'
import { join } from 'path'
import { parseString } from 'xml2js'

async function parseManifest(packageDir) {
  try {
    let manifestPath = join(packageDir, 'imsmanifest.xml')
    console.log(`📋 Looking for manifest file: ${manifestPath}`)
    
    // Check if manifest exists in root
    try {
      await fs.access(manifestPath)
      console.log(`✅ Found manifest in root directory`)
    } catch (error) {
      console.log(`📋 Manifest not found in root, searching subdirectories...`)
      
      // Look for manifest in subdirectories
      const entries = await fs.readdir(packageDir, { withFileTypes: true })
      let found = false
      
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const subManifestPath = join(packageDir, entry.name, 'imsmanifest.xml')
          try {
            await fs.access(subManifestPath)
            manifestPath = subManifestPath
            console.log(`✅ Found manifest in subdirectory: ${entry.name}`)
            found = true
            break
          } catch {
            // Continue searching
          }
        }
      }
      
      if (!found) {
        throw new Error(`Manifest file not found: ${manifestPath}. This may not be a valid SCORM package.`)
      }
    }
    
    const manifestXml = await fs.readFile(manifestPath, 'utf-8')
    console.log(`📋 Manifest file size: ${manifestXml.length} characters`)
    
    return new Promise((resolve, reject) => {
      parseString(manifestXml, (err, result) => {
        if (err) {
          console.error('❌ Failed to parse manifest XML:', err)
          return reject(new Error(`Failed to parse manifest XML: ${err.message}`))
        }
        
        if (!result || !result.manifest) {
          return reject(new Error('Invalid manifest structure: missing manifest element'))
        }
        
        const manifest = result.manifest
        
        if (!manifest.$) {
          return reject(new Error('Invalid manifest structure: missing attributes'))
        }
        
        console.log(`✅ Manifest parsed successfully. Identifier: ${manifest.$.identifier}`)
        
        resolve({
          identifier: manifest.$.identifier || 'unknown',
          title: manifest.metadata?.[0]?.lom?.[0]?.general?.[0]?.title?.[0]?.string?.[0]?._ || 
                 manifest.organizations?.[0]?.organization?.[0]?.title || 
                 'SCORM Package',
          version: manifest.$.version || '1.2',
          organizations: manifest.organizations?.[0] || { organization: [] },
          resources: manifest.resources?.[0] || { resource: [] }
        })
      })
    })
  } catch (error) {
    console.error('❌ Manifest parsing error:', error)
    throw new Error(`Failed to parse manifest: ${error instanceof Error ? error.message : String(error)}`)
  }
}

async function testManifestParsing() {
  try {
    console.log('🧪 Testing manifest parsing with subdirectory support...')
    
    // Test with the problematic package
    const packageDir = 'c:\\API\\The-SkillNexus\\public\\uploads\\scorm\\scorm_1763952502639_1k5yoo0rw'
    
    const manifest = await parseManifest(packageDir)
    
    console.log('✅ Test successful!')
    console.log(`📋 Package Title: ${manifest.title}`)
    console.log(`🆔 Package ID: ${manifest.identifier}`)
    console.log(`📦 Version: ${manifest.version}`)
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testManifestParsing()