import { promises as fs } from 'fs'
import { join } from 'path'
import * as yauzl from 'yauzl'
import { parseString } from 'xml2js'
import prisma from './prisma'

export interface ScormManifest {
  identifier: string
  title: string
  version: string
  organizations: {
    organization: {
      identifier: string
      title: string
      item: ScormItem[]
    }[]
  }
  resources: {
    resource: ScormResource[]
  }
}

export interface ScormItem {
  identifier: string
  title: string
  identifierref?: string
  item?: ScormItem[]
}

export interface ScormResource {
  identifier: string
  type: string
  href: string
  file: { href: string }[]
}

export class ScormService {
  private uploadDir = join(process.cwd(), 'public', 'uploads', 'scorm')

  constructor() {
    // Ensure upload directory exists
    this.ensureUploadDir()
  }

  private async ensureUploadDir() {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true })
    } catch (error) {
      console.error('Failed to create SCORM upload directory:', error)
    }
  }

  async uploadPackage(file: File | Buffer, lessonId: string, replace: boolean = false): Promise<string> {
    try {
      console.log(`📦 Starting SCORM upload for lesson ${lessonId}...`)
      
      // Verify the lesson exists with retry mechanism
      let lesson = null
      let retryCount = 0
      const maxRetries = 3
      
      while (!lesson && retryCount < maxRetries) {
        lesson = await prisma.lesson.findUnique({
          where: { id: lessonId },
          include: { scormPackage: true }
        })
        
        if (!lesson) {
          retryCount++
          console.log(`⏳ Lesson ${lessonId} not found, retry ${retryCount}/${maxRetries}...`)
          if (retryCount < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second
          }
        }
      }
      
      if (!lesson) {
        console.error(`❌ Lesson with ID ${lessonId} not found in database after ${maxRetries} retries`)
        throw new Error(`Lesson with ID ${lessonId} not found`)
      }
      
      console.log(`✅ Lesson found: ${lesson.title} (Type: ${lesson.lessonType})`)

      // Check if lesson already has a SCORM package
      if (lesson.scormPackage && !replace) {
        console.log(`📦 Lesson ${lessonId} already has SCORM package, skipping upload`)
        return lesson.scormPackage.id
      }

      // If replacing, delete existing package
      if (lesson.scormPackage && replace) {
        try {
          const packageDir = join(process.cwd(), 'public', lesson.scormPackage.packagePath)
          await fs.rm(packageDir, { recursive: true, force: true })
          await prisma.scormPackage.delete({ where: { id: lesson.scormPackage.id } })
          console.log(`🗑️ Deleted existing SCORM package for lesson ${lessonId}`)
        } catch (error) {
          console.warn('⚠️ Failed to delete existing package:', error)
        }
      }

      const packageId = `scorm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const packageDir = join(this.uploadDir, packageId)
      
      console.log(`📁 Creating package directory: ${packageDir}`)
      await fs.mkdir(packageDir, { recursive: true })
      
      const zipPath = join(packageDir, 'package.zip')
      const buffer = file instanceof File ? Buffer.from(await file.arrayBuffer()) : file
      
      console.log(`💾 Writing SCORM file (${buffer.length} bytes)...`)
      await fs.writeFile(zipPath, buffer)
      
      console.log(`📂 Extracting SCORM package...`)
      await this.extractPackage(zipPath, packageDir)
      
      console.log(`📋 Parsing manifest...`)
      const { manifest, manifestDir } = await this.parseManifest(packageDir)
    
      console.log(`💾 Saving SCORM package to database...`)
      
      // Determine the correct package path
      const relativePath = manifestDir.replace(process.cwd().replace(/\\/g, '/'), '').replace(/^[\\\/]public/, '')
      const packagePath = relativePath || `/uploads/scorm/${packageId}`
      
      console.log(`📁 Package path: ${packagePath}`)
      
      const scormPackage = await prisma.scormPackage.create({
        data: {
          lessonId,
          packagePath,
          manifest: JSON.stringify(manifest),
          version: manifest.version || '1.2',
          title: manifest.title,
          identifier: manifest.identifier
        }
      })
      
      // Update lesson type to SCORM
      console.log(`🔄 Updating lesson type to SCORM...`)
      await prisma.lesson.update({
        where: { id: lessonId },
        data: {
          type: 'SCORM',
          lessonType: 'SCORM'
        }
      })
      
      console.log(`✅ Successfully uploaded SCORM package ${packageId} for lesson ${lessonId}`)
      return scormPackage.id
    } catch (error) {
      console.error('❌ SCORM upload error:', error)
      throw new Error(`Failed to upload SCORM package: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  private async extractPackage(zipPath: string, extractDir: string): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log(`📂 Opening ZIP file: ${zipPath}`)
      
      yauzl.open(zipPath, { lazyEntries: true }, (err, zipfile) => {
        if (err) {
          console.error('❌ Failed to open ZIP file:', err)
          return reject(new Error(`Failed to open ZIP file: ${err.message}`))
        }
        
        let extractedFiles = 0
        
        zipfile.readEntry()
        zipfile.on('entry', (entry) => {
          if (/\/$/.test(entry.fileName)) {
            // Directory entry
            zipfile.readEntry()
          } else {
            // File entry
            zipfile.openReadStream(entry, (err, readStream) => {
              if (err) {
                console.error(`❌ Failed to read entry ${entry.fileName}:`, err)
                return reject(new Error(`Failed to read entry ${entry.fileName}: ${err.message}`))
              }
              
              const filePath = join(extractDir, entry.fileName)
              const dir = join(filePath, '..')
              
              fs.mkdir(dir, { recursive: true }).then(() => {
                const writeStream = require('fs').createWriteStream(filePath)
                readStream.pipe(writeStream)
                
                writeStream.on('close', () => {
                  extractedFiles++
                  console.log(`✅ Extracted: ${entry.fileName}`)
                  zipfile.readEntry()
                })
                
                writeStream.on('error', (err: Error) => {
                  console.error(`❌ Failed to write file ${filePath}:`, err)
                  reject(new Error(`Failed to write file ${filePath}: ${err.message}`))
                })
              }).catch(reject)
            })
          }
        })
        
        zipfile.on('end', () => {
          console.log(`✅ Extraction complete. ${extractedFiles} files extracted.`)
          resolve()
        })
        
        zipfile.on('error', (err) => {
          console.error('❌ ZIP file error:', err)
          reject(new Error(`ZIP file error: ${err.message}`))
        })
      })
    })
  }

  private async parseManifest(packageDir: string): Promise<{ manifest: ScormManifest; manifestDir: string }> {
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
          
          const manifestData = {
            identifier: manifest.$.identifier || 'unknown',
            title: manifest.metadata?.[0]?.lom?.[0]?.general?.[0]?.title?.[0]?.string?.[0]?._ || 
                   manifest.organizations?.[0]?.organization?.[0]?.title || 
                   'SCORM Package',
            version: manifest.$.version || '1.2',
            organizations: manifest.organizations?.[0] || { organization: [] },
            resources: manifest.resources?.[0] || { resource: [] }
          }
          
          // Get the directory containing the manifest
          const manifestDir = manifestPath.replace(/[\\\/]imsmanifest\.xml$/, '')
          
          resolve({
            manifest: manifestData,
            manifestDir
          })
        })
      })
    } catch (error) {
      console.error('❌ Manifest parsing error:', error)
      throw new Error(`Failed to parse manifest: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  async getPackage(lessonId: string) {
    return await prisma.scormPackage.findUnique({
      where: { lessonId },
      include: { lesson: true }
    })
  }

  async updateProgress(userId: string, packageId: string, cmiData: any) {
    return await prisma.scormProgress.upsert({
      where: {
        userId_packageId: { userId, packageId }
      },
      update: {
        cmiData: JSON.stringify(cmiData),
        completionStatus: cmiData['cmi.completion_status'] || 'incomplete',
        successStatus: cmiData['cmi.success_status'] || 'unknown',
        scoreRaw: parseFloat(cmiData['cmi.score.raw']) || null,
        scoreMax: parseFloat(cmiData['cmi.score.max']) || null,
        scoreMin: parseFloat(cmiData['cmi.score.min']) || null,
        sessionTime: cmiData['cmi.session_time'] || null,
        totalTime: cmiData['cmi.total_time'] || null,
        location: cmiData['cmi.location'] || null,
        suspendData: cmiData['cmi.suspend_data'] || null
      },
      create: {
        userId,
        packageId,
        cmiData: JSON.stringify(cmiData),
        completionStatus: cmiData['cmi.completion_status'] || 'incomplete',
        successStatus: cmiData['cmi.success_status'] || 'unknown',
        scoreRaw: parseFloat(cmiData['cmi.score.raw']) || null,
        scoreMax: parseFloat(cmiData['cmi.score.max']) || null,
        scoreMin: parseFloat(cmiData['cmi.score.min']) || null,
        sessionTime: cmiData['cmi.session_time'] || null,
        totalTime: cmiData['cmi.total_time'] || null,
        location: cmiData['cmi.location'] || null,
        suspendData: cmiData['cmi.suspend_data'] || null
      }
    })
  }

  async getProgress(userId: string, packageId: string) {
    return await prisma.scormProgress.findUnique({
      where: {
        userId_packageId: { userId, packageId }
      }
    })
  }
}

export const scormService = new ScormService()