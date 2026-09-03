'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2, AlertTriangle } from 'lucide-react'
import { forceDeleteFileAction } from '@/app/actions/file'

interface ForceDeleteButtonProps {
  filePath: string
  fileName?: string
  onSuccess?: () => void
  variant?: 'default' | 'destructive' | 'outline'
  size?: 'sm' | 'default' | 'lg'
}

export function ForceDeleteButton({ 
  filePath, 
  fileName, 
  onSuccess,
  variant = 'destructive',
  size = 'sm'
}: ForceDeleteButtonProps) {
  const [loading, setLoading] = useState(false)

  async function handleForceDelete() {
    const displayName = fileName || filePath.split('/').pop() || 'file'
    
    if (!confirm(
      `Force delete "${displayName}"?\n\n` +
      'This will attempt to delete the file even if it\'s locked by another process. ' +
      'This action cannot be undone.'
    )) {
      return
    }
    
    setLoading(true)
    try {
      const result = await forceDeleteFileAction(filePath)
      
      if (result.success) {
        alert('File deleted successfully')
        onSuccess?.()
      } else {
        alert(result.error || 'Failed to delete file')
      }
    } catch (error) {
      console.error('Force delete error:', error)
      alert('An unexpected error occurred while deleting the file')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      variant={variant}
      size={size}
      onClick={handleForceDelete}
      disabled={loading}
      className="gap-1"
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Deleting...
        </>
      ) : (
        <>
          <AlertTriangle className="w-4 h-4" />
          <Trash2 className="w-4 h-4" />
          Force Delete
        </>
      )}
    </Button>
  )
}