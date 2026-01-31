import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { forceDeleteFile } from './file-manager'

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
  
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, WebP, and SVG are allowed')
  }
  
  // Convert to base64 for Vercel deployment (no filesystem access)
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const base64 = buffer.toString('base64')
  const dataUrl = `data:${file.type};base64,${base64}`
  
  return dataUrl
}