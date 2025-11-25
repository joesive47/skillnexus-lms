'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ForceDeleteButton } from './force-delete-button'
import { getFileInfoAction } from '@/app/actions/file'
import { FileText, Image, AlertCircle } from 'lucide-react'

interface FileInfo {
  path: string
  name: string
  size: number
  type: 'image' | 'document' | 'other'
  exists: boolean
  error?: string
}

export function FileManager() {
  const [files, setFiles] = useState<FileInfo[]>([])
  const [loading, setLoading] = useState(true)

  // Sample files for demonstration - in real app, this would come from API
  const sampleFiles = [
    '/uploads/courses/1703123456789-sample-course.jpg',
    '/uploads/courses/1703123456790-locked-file.png',
    '/uploads/courses/1703123456791-another-image.webp'
  ]

  useEffect(() => {
    loadFiles()
  }, [])

  async function loadFiles() {
    setLoading(true)
    const fileInfos: FileInfo[] = []

    for (const filePath of sampleFiles) {
      try {
        const result = await getFileInfoAction(filePath)
        const fileName = filePath.split('/').pop() || 'unknown'
        const fileType = getFileType(fileName)
        
        fileInfos.push({
          path: filePath,
          name: fileName,
          size: result.success && result.info ? result.info.size || 0 : 0,
          type: fileType,
          exists: result.success && result.info ? result.info.exists : false,
          error: result.success ? undefined : result.error
        })
      } catch (error) {
        const fileName = filePath.split('/').pop() || 'unknown'
        fileInfos.push({
          path: filePath,
          name: fileName,
          size: 0,
          type: getFileType(fileName),
          exists: false,
          error: 'Failed to get file info'
        })
      }
    }

    setFiles(fileInfos)
    setLoading(false)
  }

  function getFileType(fileName: string): 'image' | 'document' | 'other' {
    const ext = fileName.split('.').pop()?.toLowerCase()
    if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext || '')) {
      return 'image'
    }
    if (['pdf', 'doc', 'docx', 'txt', 'xlsx', 'csv'].includes(ext || '')) {
      return 'document'
    }
    return 'other'
  }

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  function getFileIcon(type: string) {
    switch (type) {
      case 'image':
        return <Image className="w-5 h-5" />
      case 'document':
        return <FileText className="w-5 h-5" />
      default:
        return <FileText className="w-5 h-5" />
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span className="ml-2">Loading files...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Uploaded Files</h2>
        <Button onClick={loadFiles} variant="outline">
          Refresh
        </Button>
      </div>

      <div className="grid gap-4">
        {files.map((file) => (
          <Card key={file.path}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getFileIcon(file.type)}
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {file.exists ? formatFileSize(file.size) : 'File not found'}
                    </p>
                    {file.error && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {file.error}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <ForceDeleteButton
                    filePath={file.path}
                    fileName={file.name}
                    onSuccess={loadFiles}
                    variant="destructive"
                    size="sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {files.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No files found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}