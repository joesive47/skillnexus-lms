import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { forceDeleteFile } from './file-manager'

// Optional: use AWS S3 in production. Configure these env vars in Vercel:
// AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET
let s3Client: any = null
let S3_BUCKET: string | undefined
try {
  if (process.env.AWS_REGION && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.S3_BUCKET) {
    // Lazy-require to avoid adding dependency in environments that won't use it
    // and to prevent import-time errors in the edge runtime.
    // @ts-ignore
    const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
    s3Client = new S3Client({ region: process.env.AWS_REGION })
    S3_BUCKET = process.env.S3_BUCKET
    // expose for use below
    ;(global as any).__S3_PUT_COMMAND = PutObjectCommand
  }
} catch (err) {
  s3Client = null
}

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
  // File validation
  if (!file || file.size === 0) {
    throw new Error('No file provided')
  }
  
  if (file.size > 5 * 1024 * 1024) { // 5MB limit
    throw new Error('File size is too large (max 5MB)')
  }
  
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed')
  }
  
  // If S3 is configured, upload to S3 and return the public URL
  if (s3Client && S3_BUCKET) {
    try {
      const PutObjectCommand = (global as any).__S3_PUT_COMMAND
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

      // Construct URL (standard S3 public URL). Adjust if using custom domain or CloudFront.
      const region = process.env.AWS_REGION
      const url = `https://${S3_BUCKET}.s3.${region}.amazonaws.com/${key}`
      return url
    } catch (err) {
      console.error('S3 upload failed, falling back to local save:', err)
      // fall through to local save
    }
  }

  // Fallback: save locally (useful for local/dev environments)
  // Note: serverless platforms (Vercel) often have read-only fs; prefer S3 in production
  const uploadPath = await saveFileLocally(file, 'courses')
  return uploadPath
}