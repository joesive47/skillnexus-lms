'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, File, CheckCircle, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ScormUploaderProps {
  lessonId: string
  onUploadComplete?: () => void
}

export default function ScormUploader({ lessonId, onUploadComplete }: ScormUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.zip')) {
        toast({
          title: 'Invalid file type',
          description: 'Please select a ZIP file containing SCORM package',
          variant: 'destructive'
        })
        return
      }
      setFile(selectedFile)
      setUploadStatus('idle')
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setUploadStatus('idle')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('lessonId', lessonId)
      formData.append('replace', 'true') // Allow replacing existing package

      const response = await fetch('/api/scorm/upload', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed')
      }

      setUploadStatus('success')
      toast({
        title: 'Upload successful',
        description: 'SCORM package has been uploaded successfully'
      })
      
      setFile(null) // Clear file selection
      onUploadComplete?.()
    } catch (error) {
      setUploadStatus('error')
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive'
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5" />
          <span>Upload SCORM Package</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="scorm-file">SCORM Package (ZIP file)</Label>
          <Input
            id="scorm-file"
            type="file"
            accept=".zip"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <p className="text-sm text-gray-600">
            Select a ZIP file containing your SCORM 1.2 or SCORM 2004 package
          </p>
        </div>

        {file && (
          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
            <File className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium">{file.name}</span>
            <span className="text-sm text-gray-500">
              ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </span>
          </div>
        )}

        {uploadStatus === 'success' && (
          <div className="flex items-center space-x-2 p-3 bg-green-50 text-green-700 rounded-lg">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm">SCORM package uploaded successfully!</span>
          </div>
        )}

        {uploadStatus === 'error' && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 text-red-700 rounded-lg">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm">Upload failed. Please try again.</span>
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full"
        >
          {uploading ? 'Uploading...' : 'Upload SCORM Package'}
        </Button>

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Supported formats: SCORM 1.2, SCORM 2004</p>
          <p>• Maximum file size: 100MB</p>
          <p>• Package must contain imsmanifest.xml</p>
        </div>
      </CardContent>
    </Card>
  )
}