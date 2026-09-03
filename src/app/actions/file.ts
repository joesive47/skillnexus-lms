'use server'

import { auth } from '@/auth'
import { forceDeleteFile, forceDeleteMultipleFiles, getFileInfo } from '@/lib/file-manager'
import { join } from 'path'

export async function forceDeleteFileAction(filePath: string) {
  try {
    const session = await auth()
    if (!session?.user) {
      return { success: false, error: 'Authentication required' }
    }

    if (session.user.role !== 'ADMIN') {
      return { success: false, error: 'Admin access required' }
    }

    // Ensure file is within uploads directory for security
    const uploadsPath = join(process.cwd(), 'public', 'uploads')
    const fullPath = join(process.cwd(), 'public', filePath)
    
    if (!fullPath.startsWith(uploadsPath)) {
      return { success: false, error: 'Invalid file path' }
    }

    const result = await forceDeleteFile(fullPath, {
      retryAttempts: 5,
      retryDelay: 1000,
      skipPermissionCheck: false
    })

    return result
  } catch (error) {
    console.error('Error force deleting file:', error)
    return { success: false, error: 'Failed to delete file' }
  }
}

export async function forceDeleteMultipleFilesAction(filePaths: string[]) {
  try {
    const session = await auth()
    if (!session?.user) {
      return { success: false, error: 'Authentication required' }
    }

    if (session.user.role !== 'ADMIN') {
      return { success: false, error: 'Admin access required' }
    }

    const uploadsPath = join(process.cwd(), 'public', 'uploads')
    const fullPaths = filePaths.map(path => join(process.cwd(), 'public', path))
    
    // Security check - ensure all files are within uploads directory
    for (const fullPath of fullPaths) {
      if (!fullPath.startsWith(uploadsPath)) {
        return { success: false, error: 'Invalid file path detected' }
      }
    }

    const result = await forceDeleteMultipleFiles(fullPaths, {
      retryAttempts: 5,
      retryDelay: 1000,
      skipPermissionCheck: false
    })

    return result
  } catch (error) {
    console.error('Error force deleting multiple files:', error)
    return { success: false, error: 'Failed to delete files' }
  }
}

export async function getFileInfoAction(filePath: string) {
  try {
    const session = await auth()
    if (!session?.user) {
      return { success: false, error: 'Authentication required' }
    }

    if (session.user.role !== 'ADMIN') {
      return { success: false, error: 'Admin access required' }
    }

    const uploadsPath = join(process.cwd(), 'public', 'uploads')
    const fullPath = join(process.cwd(), 'public', filePath)
    
    if (!fullPath.startsWith(uploadsPath)) {
      return { success: false, error: 'Invalid file path' }
    }

    const info = await getFileInfo(fullPath)
    return { success: true, info }
  } catch (error) {
    console.error('Error getting file info:', error)
    return { success: false, error: 'Failed to get file info' }
  }
}