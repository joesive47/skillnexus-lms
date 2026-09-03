import { unlink, access, stat } from 'fs/promises'
import { constants } from 'fs'
import { join } from 'path'

export interface ForceDeleteOptions {
  retryAttempts?: number
  retryDelay?: number
  skipPermissionCheck?: boolean
}

export async function forceDeleteFile(
  filePath: string, 
  options: ForceDeleteOptions = {}
): Promise<{ success: boolean; error?: string }> {
  const { 
    retryAttempts = 3, 
    retryDelay = 1000,
    skipPermissionCheck = false 
  } = options

  try {
    // Check if file exists
    await access(filePath, constants.F_OK)
    
    // Check file permissions if not skipping
    if (!skipPermissionCheck) {
      const stats = await stat(filePath)
      if (!stats.isFile()) {
        return { success: false, error: 'Path is not a file' }
      }
    }

    let lastError: Error | null = null
    
    for (let attempt = 1; attempt <= retryAttempts; attempt++) {
      try {
        await unlink(filePath)
        return { success: true }
      } catch (error) {
        lastError = error as Error
        
        // If it's the last attempt, don't wait
        if (attempt < retryAttempts) {
          await new Promise(resolve => setTimeout(resolve, retryDelay))
        }
      }
    }

    return { 
      success: false, 
      error: `Failed to delete file after ${retryAttempts} attempts: ${lastError?.message}` 
    }
    
  } catch (error) {
    const err = error as NodeJS.ErrnoException
    if (err.code === 'ENOENT') {
      return { success: true } // File doesn't exist, consider it deleted
    }
    return { success: false, error: err.message || 'Unknown error' }
  }
}

export async function forceDeleteMultipleFiles(
  filePaths: string[],
  options: ForceDeleteOptions = {}
): Promise<{ success: boolean; results: Array<{ path: string; success: boolean; error?: string }> }> {
  const results = await Promise.all(
    filePaths.map(async (path) => {
      const result = await forceDeleteFile(path, options)
      return { path, ...result }
    })
  )

  const allSuccessful = results.every(result => result.success)
  
  return {
    success: allSuccessful,
    results
  }
}

export async function getFileInfo(filePath: string) {
  try {
    const stats = await stat(filePath)
    return {
      exists: true,
      size: stats.size,
      isFile: stats.isFile(),
      isDirectory: stats.isDirectory(),
      modified: stats.mtime,
      permissions: stats.mode
    }
  } catch (error) {
    return { exists: false, error: (error as Error).message }
  }
}