import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { forceDeleteFile } from './file-manager'

const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'])

function hasImageSignature(buffer: Buffer, type: string): boolean {
  if (type === 'image/jpeg' || type === 'image/jpg') {
    return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff
  }
  if (type === 'image/png') {
    return buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  }
  if (type === 'image/gif') {
    const signature = buffer.subarray(0, 6).toString('ascii')
    return signature === 'GIF87a' || signature === 'GIF89a'
  }
  if (type === 'image/webp') {
    return buffer.length >= 12 &&
      buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
      buffer.subarray(8, 12).toString('ascii') === 'WEBP'
  }
  return false
}

export async function validateImageFile(file: File): Promise<void> {
  if (!file || file.size === 0) throw new Error('No file provided')
  if (file.size > MAX_IMAGE_BYTES) throw new Error('File size is too large (max 5MB)')
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed')
  }

  const header = Buffer.from(await file.slice(0, 16).arrayBuffer())
  if (!hasImageSignature(header, file.type)) {
    throw new Error('File content does not match the declared image type')
  }
}

// File upload system with multiple storage options:
// 1. Vercel Blob Storage (recommended for Vercel deployments) - Configure: BLOB_READ_WRITE_TOKEN
// 2. AWS S3 (optional) - Configure: AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET
// 3. Local filesystem (development and emergency fallback)

export async function saveFileLocally(file: File, folder: string): Promise<string> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Ensure upload directory exists
  const uploadDir = join(process.cwd(), 'public', 'uploads', folder)
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true })
  }

  // Generate unique filename
  const timestamp = Date.now()
  const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
  const filepath = join(uploadDir, filename)

  await writeFile(filepath, buffer)
  
  return `/uploads/${folder}/${filename}`
}

export async function deleteFile(filePath: string): Promise<{ success: boolean; error?: string }> {
  const fullPath = join(process.cwd(), 'public', filePath)
  return await forceDeleteFile(fullPath, { retryAttempts: 3, retryDelay: 500 })
}

export async function uploadToS3(file: File): Promise<string> {
  const isProdLike = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production'

  await validateImageFile(file)

  // Priority 1: Try Vercel Blob Storage (if configured)
  const hasBlobToken = Boolean(process.env.BLOB_READ_WRITE_TOKEN)
  if (hasBlobToken) {
    try {
      console.log('📦 Uploading to Vercel Blob Storage...')
      // Lazy load Vercel Blob to avoid build errors if not installed
      const { put } = await import('@vercel/blob')
      
      const timestamp = Date.now()
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const filename = `${timestamp}-${sanitizedName}`
      const pathname = `courses/${filename}`

      const blob = await put(pathname, file, {
        access: 'public',
        addRandomSuffix: false,
      })

      console.log('✅ Blob upload successful:', blob.url)
      return blob.url
    } catch (err) {
      console.error('❌ Blob upload failed:', err)
      if (isProdLike) {
        // In production, if Blob is configured but fails, we should know
        throw new Error(`Blob upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
      // Fall through to next option in dev mode
    }
  }

  // Priority 2: Try AWS S3 (if configured)
  const bucketName = process.env.S3_BUCKET || process.env.AWS_S3_BUCKET
  const hasS3Env = Boolean(
    process.env.AWS_REGION &&
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    bucketName
  )

  if (hasS3Env) {
    try {
      console.log('📦 Uploading to AWS S3...')
      const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3')
      const s3Client = new S3Client({ region: process.env.AWS_REGION })
      const S3_BUCKET = bucketName as string

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const timestamp = Date.now()
      const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      const key = `courses/${filename}`

      await s3Client.send(new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: file.type,
        ACL: 'public-read',
      }))

      const region = process.env.AWS_REGION
      const url = `https://${S3_BUCKET}.s3.${region}.amazonaws.com/${key}`
      console.log('✅ S3 upload successful:', url)
      return url
    } catch (err) {
      console.error('❌ S3 upload failed:', err)
      if (isProdLike) {
        throw new Error(`S3 upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
      // Fall through to local save in dev mode
    }
  }

  // Priority 3: Local filesystem fallback
  // Note: This won't work on Vercel (read-only filesystem) but is fine for local dev
  if (!isProdLike) {
    console.log('💾 Saving to local filesystem (dev mode)...')
    const uploadPath = await saveFileLocally(file, 'courses')
    return uploadPath
  }

  // If we reach here in production, no storage is configured
  console.warn('⚠️ No file storage configured in production!')
  console.warn('Please set up one of:')
  console.warn('  • Vercel Blob: BLOB_READ_WRITE_TOKEN (recommended)')
  console.warn('  • AWS S3: AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET')
  
  throw new Error(
    'No file storage configured. See server logs for setup instructions.\n' +
    'Quick fix: Set up Vercel Blob Storage in Vercel Dashboard → Storage → Create → Blob'
  )
}
