import { put } from '@vercel/blob'
import * as yauzl from 'yauzl'
import { parseString } from 'xml2js'
import prisma from './prisma'
import { Readable } from 'stream'

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
  /**
   * Upload SCORM package to Vercel Blob Storage
   */
  async uploadPackage(file: File, lessonId: string, replace: boolean = false): Promise<string> {
    try {
      console.log(`📦 Starting SCORM upload for lesson ${lessonId}...`)
      
      // Verify the lesson exists
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: { scormPackage: true }
      })
      
      if (!lesson) {
        throw new Error(`Lesson with ID ${lessonId} not found`)
      }
      
      console.log(`✅ Lesson found: ${lesson.title}`)

      // Check if lesson already has a SCORM package
      if (lesson.scormPackage && !replace) {
        console.log(`📦 Lesson already has SCORM package`)
        return lesson.scormPackage.id
      }

      // If replacing, delete existing package
      if (lesson.scormPackage && replace) {
        try {
          // Delete from Blob Storage
          const { del } = await import('@vercel/blob')
          await del(lesson.scormPackage.packagePath)
          await prisma.scormPackage.delete({ where: { id: lesson.scormPackage.id } })
          console.log(`🗑️ Deleted existing SCORM package`)
        } catch (error) {
          console.warn('⚠️ Failed to delete existing package:', error)
        }
      }

      // Generate unique filename
      const timestamp = Date.now()
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const filename = `${timestamp}-${sanitizedName}`
      const pathname = `scorm/${filename}`

      console.log(`☁️ Uploading to Vercel Blob: ${pathname}`)

      // Upload to Vercel Blob
      const blob = await put(pathname, file, {
        access: 'public',
        addRandomSuffix: false,
      })

      console.log(`✅ Blob upload successful: ${blob.url}`)

      // Parse manifest from ZIP (in-memory)
      const manifest = await this.parseManifestFromFile(file)
      
      console.log(`📋 Manifest parsed: ${manifest?.title || 'Unknown'}`)

      // Save to database
      const scormPackage = await prisma.scormPackage.create({
        data: {
          lessonId,
          packagePath: blob.url, // Store Blob URL
          manifest: manifest ? JSON.stringify(manifest) : '{}',
          version: manifest?.version || '1.2',
          title: manifest?.title || file.name,
          identifier: manifest?.identifier || `scorm_${timestamp}`
        }
      })
      
      // Update lesson type to SCORM
      await prisma.lesson.update({
        where: { id: lessonId },
        data: {
          type: 'SCORM',
          lessonType: 'SCORM'
        }
      })
      
      console.log(`✅ SCORM package created: ${scormPackage.id}`)
      return scormPackage.id

    } catch (error) {
      console.error('❌ SCORM upload failed:', error)
      throw error
    }
  }

  /**
   * Parse SCORM manifest from ZIP file (in-memory)
   */
  private async parseManifestFromFile(file: File): Promise<ScormManifest | null> {
    try {
      const buffer = Buffer.from(await file.arrayBuffer())
      
      return new Promise((resolve, reject) => {
        yauzl.fromBuffer(buffer, { lazyEntries: true }, (err, zipfile) => {
          if (err || !zipfile) {
            console.warn('Failed to open ZIP:', err)
            resolve(null)
            return
          }

          let manifestFound = false

          zipfile.readEntry()
          zipfile.on('entry', (entry: yauzl.Entry) => {
            // Look for imsmanifest.xml
            if (entry.fileName.toLowerCase().includes('imsmanifest.xml')) {
              manifestFound = true
              zipfile.openReadStream(entry, (err, readStream) => {
                if (err || !readStream) {
                  zipfile.readEntry()
                  return
                }

                const chunks: Buffer[] = []
                readStream.on('data', (chunk) => chunks.push(chunk))
                readStream.on('end', () => {
                  const xmlContent = Buffer.concat(chunks).toString('utf-8')
                  this.parseManifestXML(xmlContent)
                    .then(resolve)
                    .catch(() => resolve(null))
                  zipfile.close()
                })
              })
            } else {
              zipfile.readEntry()
            }
          })

          zipfile.on('end', () => {
            if (!manifestFound) {
              console.warn('No imsmanifest.xml found in ZIP')
              resolve(null)
            }
          })

          zipfile.on('error', (err) => {
            console.error('ZIP file error:', err)
            resolve(null)
          })
        })
      })
    } catch (error) {
      console.error('Failed to parse manifest:', error)
      return null
    }
  }

  /**
   * Parse SCORM manifest XML
   */
  private async parseManifestXML(xmlContent: string): Promise<ScormManifest | null> {
    return new Promise((resolve) => {
      parseString(xmlContent, (err, result) => {
        if (err || !result) {
          console.error('XML parse error:', err)
          resolve(null)
          return
        }

        try {
          const manifest = result.manifest || result
          const metadata = manifest.metadata?.[0] || {}
          const organizations = manifest.organizations?.[0] || {}
          const resources = manifest.resources?.[0] || {}

          const scormManifest: ScormManifest = {
            identifier: manifest.$?.identifier || 'unknown',
            title: metadata['lom:lom']?.[0]?.['lom:general']?.[0]?.['lom:title']?.[0]?.['lom:string']?.[0] || 
                   manifest.$?.identifier || 'SCORM Package',
            version: manifest.$?.version || '1.2',
            organizations,
            resources
          }

          resolve(scormManifest)
        } catch (error) {
          console.error('Failed to extract manifest data:', error)
          resolve(null)
        }
      })
    })
  }

  /**
   * Get SCORM package by lesson ID
   */
  async getPackage(lessonId: string) {
    return await prisma.scormPackage.findUnique({
      where: { lessonId }
    })
  }

  /**
   * Delete SCORM package
   */
  async deletePackage(packageId: string) {
    try {
      const scormPackage = await prisma.scormPackage.findUnique({
        where: { id: packageId }
      })

      if (!scormPackage) {
        throw new Error('Package not found')
      }

      // Delete from Blob Storage
      try {
        const { del } = await import('@vercel/blob')
        await del(scormPackage.packagePath)
        console.log(`🗑️ Deleted blob: ${scormPackage.packagePath}`)
      } catch (error) {
        console.warn('Failed to delete blob:', error)
      }

      // Delete from database
      await prisma.scormPackage.delete({
        where: { id: packageId }
      })

      console.log(`✅ Package ${packageId} deleted`)
      return true
    } catch (error) {
      console.error('Delete package error:', error)
      throw error
    }
  }

  /**
   * Get SCORM progress for user
   */
  async getProgress(userId: string, packageId: string) {
    try {
      return await prisma.scormProgress.findUnique({
        where: {
          userId_packageId: {
            userId,
            packageId
          }
        }
      })
    } catch (error) {
      console.error('Get progress error:', error)
      return null
    }
  }

  /**
   * Update SCORM progress
   */
  async updateProgress(userId: string, packageId: string, cmiData: any) {
    try {
      const data = {
        userId,
        packageId,
        completionStatus: cmiData['cmi.completion_status'] || cmiData['cmi.core.lesson_status'] || 'incomplete',
        successStatus: cmiData['cmi.success_status'] || 'unknown',
        scoreRaw: cmiData['cmi.score.raw'] ? parseFloat(cmiData['cmi.score.raw']) : null,
        scoreMin: cmiData['cmi.score.min'] ? parseFloat(cmiData['cmi.score.min']) : null,
        scoreMax: cmiData['cmi.score.max'] ? parseFloat(cmiData['cmi.score.max']) : null,
        sessionTime: cmiData['cmi.session_time'] || null,
        totalTime: cmiData['cmi.total_time'] || null,
        suspendData: cmiData['cmi.suspend_data'] || null,
        cmiData: JSON.stringify(cmiData)
      }

      return await prisma.scormProgress.upsert({
        where: {
          userId_packageId: {
            userId,
            packageId
          }
        },
        update: data,
        create: data
      })
    } catch (error) {
      console.error('Update progress error:', error)
      throw error
    }
  }
}

export const scormService = new ScormService()
