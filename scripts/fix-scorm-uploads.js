import { promises as fs } from 'fs'
import { join } from 'path'

async function fixScormUploads() {
  try {
    console.log('🔧 Fixing SCORM upload directories...')
    
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'scorm')
    const entries = await fs.readdir(uploadsDir, { withFileTypes: true })
    
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const packageDir = join(uploadsDir, entry.name)
        const manifestPath = join(packageDir, 'imsmanifest.xml')
        
        try {
          // Check if manifest exists in root
          await fs.access(manifestPath)
          console.log(`✅ ${entry.name}: Manifest found in root`)
        } catch {
          // Look for manifest in subdirectories
          console.log(`🔍 ${entry.name}: Searching for manifest in subdirectories...`)
          
          const subEntries = await fs.readdir(packageDir, { withFileTypes: true })
          let found = false
          
          for (const subEntry of subEntries) {
            if (subEntry.isDirectory() && subEntry.name !== 'package.zip') {
              const subManifestPath = join(packageDir, subEntry.name, 'imsmanifest.xml')
              try {
                await fs.access(subManifestPath)
                console.log(`✅ ${entry.name}: Found manifest in ${subEntry.name}/`)
                found = true
                break
              } catch {
                // Continue searching
              }
            }
          }
          
          if (!found) {
            console.log(`❌ ${entry.name}: No valid manifest found`)
          }
        }
      }
    }
    
    console.log('🎉 SCORM upload analysis complete!')
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

fixScormUploads()