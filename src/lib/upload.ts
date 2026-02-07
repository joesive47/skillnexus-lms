import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { forceDeleteFile } from './file-manager'

// Optional: use AWS S3 in production. Configure these env vars in Vercel:
// AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET
// Do not create S3 client at module import time. Instead create it lazily
// inside `uploadToS3` so that runtime environment variables configured
// in the hosting platform (Vercel) are respected.

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
  const bucketName = process.env.S3_BUCKET || process.env.AWS_S3_BUCKET
  const hasS3Env = Boolean(
    process.env.AWS_REGION &&
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    bucketName
  )

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
  
  // If S3 is configured via environment variables, attempt to upload to S3.
  if (hasS3Env) {
    try {
      // Lazy-require the AWS SDK so environments that don't need it won't fail.
      // @ts-ignore
      const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
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
      return url
    } catch (err) {
      console.error('S3 upload failed, falling back to local save:', err)
      // fall through to local save
    }
  }

  if (isProdLike) {
    throw new Error('S3 is not configured in this environment. Set AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and S3_BUCKET (or AWS_S3_BUCKET).')
  }

  // Fallback: save locally (useful for local/dev environments)
  // Note: serverless platforms (Vercel) often have read-only fs; prefer S3 in production
  const uploadPath = await saveFileLocally(file, 'courses')
  return uploadPath
}