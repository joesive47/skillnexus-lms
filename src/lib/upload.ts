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
  
  if (file.size > 2 * 1024 * 1024) { // 2MB limit (reduced from 5MB)
    throw new Error('File size is too large (max 2MB)')
  }
  
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, WebP, and SVG are allowed')
  }
  
  // For SVG, return as-is (small file)
  if (file.type === 'image/svg+xml') {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    return `data:${file.type};base64,${base64}`
  }
  
  // For other images, compress before converting to base64
  try {
    const compressedFile = await compressImage(file)
    const bytes = await compressedFile.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    return `data:${compressedFile.type};base64,${base64}`
  } catch (error) {
    console.error('Compression error:', error)
    // Fallback: use original file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    return `data:${file.type};base64,${base64}`
  }
}

async function compressImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (e) => {
      const img = new Image()
      img.src = e.target?.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height
        
        // Resize if too large
        const maxDimension = 800
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height / width) * maxDimension
            width = maxDimension
          } else {
            width = (width / height) * maxDimension
            height = maxDimension
          }
        }
        
        canvas.width = width
        canvas.height = height
        
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              })
              resolve(compressedFile)
            } else {
              reject(new Error('Compression failed'))
            }
          },
          'image/jpeg',
          0.7 // 70% quality
        )
      }
      img.onerror = reject
    }
    reader.onerror = reject
  })
}