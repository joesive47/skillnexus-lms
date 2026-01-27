'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, File, CheckCircle, AlertCircle, Link } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ScormUploaderProps {
  lessonId: string
  onUploadComplete?: () => void
}

export default function ScormUploader({ lessonId, onUploadComplete }: ScormUploaderProps) {
  const [uploadType, setUploadType] = useState<'file' | 'url'>('url')
  const [file, setFile] = useState<File | null>(null)
  const [packageUrl, setPackageUrl] = useState('')
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
    if (uploadType === 'file' && !file) return
    if (uploadType === 'url' && !packageUrl) return

    setUploading(true)
    setUploadStatus('idle')

    try {
      if (uploadType === 'url') {
        // Save URL directly to database
        const response = await fetch('/api/scorm/url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lessonId, packageUrl })
        })

        const result = await response.json()
        if (!response.ok) throw new Error(result.error || 'Failed to save URL')
      } else {
        // Upload file
        const formData = new FormData()
        formData.append('file', file!)
        formData.append('lessonId', lessonId)
        formData.append('replace', 'true')

        const response = await fetch('/api/scorm/upload', {
          method: 'POST',
          body: formData
        })

        const result = await response.json()
        if (!response.ok) throw new Error(result.error || 'Upload failed')
      }

      setUploadStatus('success')
      toast({
        title: 'Success',
        description: uploadType === 'url' ? 'SCORM URL saved successfully' : 'SCORM package uploaded successfully'
      })
      
      setFile(null)
      setPackageUrl('')
      onUploadComplete?.()
    } catch (error) {
      setUploadStatus('error')
      toast({
        title: 'Failed',
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
        <div className="flex space-x-2 mb-4">
          <Button
            type="button"
            variant={uploadType === 'url' ? 'default' : 'outline'}
            onClick={() => setUploadType('url')}
            className="flex-1"
          >
            <Link className="h-4 w-4 mr-2" />
            URL (แนะนำ)
          </Button>
          <Button
            type="button"
            variant={uploadType === 'file' ? 'default' : 'outline'}
            onClick={() => setUploadType('file')}
            className="flex-1"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload File
          </Button>
        </div>

        {uploadType === 'url' ? (
          <div className="space-y-2">
            <Label htmlFor="package-url">SCORM Package URL (jsDelivr CDN)</Label>
            <Input
              id="package-url"
              type="url"
              placeholder="https://cdn.jsdelivr.net/gh/username/repo@main/scorm-packages/course.zip"
              value={packageUrl}
              onChange={(e) => setPackageUrl(e.target.value)}
              disabled={uploading}
            />
            <div className="bg-green-50 p-3 rounded-lg space-y-2">
              <p className="text-sm font-semibold text-green-900">📦 SCORM Packages พร้อมใช้:</p>
              <div className="space-y-1 text-xs text-green-800">
                <p className="font-mono break-all cursor-pointer hover:bg-green-100 p-1 rounded" 
                   onClick={() => setPackageUrl('https://cdn.jsdelivr.net/gh/joesive47/skillnexus-lms@main/scorm-packages/ai-architect-blueprint.zip')}>
                  • AI Architect: https://cdn.jsdelivr.net/gh/joesive47/skillnexus-lms@main/scorm-packages/ai-architect-blueprint.zip
                </p>
                <p className="font-mono break-all cursor-pointer hover:bg-green-100 p-1 rounded"
                   onClick={() => setPackageUrl('https://cdn.jsdelivr.net/gh/joesive47/skillnexus-lms@main/scorm-packages/prompt-engineering.zip')}>
                  • Prompt Engineering: https://cdn.jsdelivr.net/gh/joesive47/skillnexus-lms@main/scorm-packages/prompt-engineering.zip
                </p>
                <p className="text-xs text-green-700 mt-2">💡 คลิกที่ URL เพื่อใช้งาน</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="scorm-file">SCORM Package (ZIP file)</Label>
            <Input
              id="scorm-file"
              type="file"
              accept=".zip"
              onChange={handleFileChange}
              disabled={uploading}
            />
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ <strong>สำหรับ Vercel:</strong> ใช้ "URL" แทนการอัปโหลดไฟล์
              </p>
            </div>
          </div>
        )}

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
          disabled={(uploadType === 'file' && !file) || (uploadType === 'url' && !packageUrl) || uploading}
          className="w-full"
        >
          {uploading ? 'Processing...' : uploadType === 'url' ? 'Save URL' : 'Upload Package'}
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