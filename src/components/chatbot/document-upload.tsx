'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, Link as LinkIcon, FileText, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface DocumentUploadProps {
  courseId?: string
  onUploadComplete?: (documentId: string) => void
}

export function DocumentUpload({ courseId, onUploadComplete }: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [url, setUrl] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file')

  const handleFileUpload = async () => {
    if (!file && !url) {
      toast.error('กรุณาเลือกไฟล์หรือใส่ URL')
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      
      if (uploadMode === 'file' && file) {
        formData.append('file', file)
        console.log('📤 Uploading file:', file.name, file.size, 'bytes')
      } else if (uploadMode === 'url' && url) {
        formData.append('url', url)
        console.log('📤 Uploading URL:', url)
      }

      if (courseId) {
        formData.append('courseId', courseId)
      }

      console.log('🚀 Sending request to /api/chatbot/upload-document')
      const response = await fetch('/api/chatbot/upload-document', {
        method: 'POST',
        body: formData
      })

      console.log('📥 Response status:', response.status)
      const data = await response.json()
      console.log('📥 Response data:', data)

      if (response.ok) {
        if (data.success) {
          toast.success(`เริ่มประมวลผลแล้ว: ${file?.name || url}`)
          setFile(null)
          setUrl('')
          onUploadComplete?.(data.documentId)
        } else {
          toast.error(data.error || 'เกิดข้อผิดพลาด')
        }
      } else {
        toast.error(data.error || `HTTP Error: ${response.status}`)
      }
    } catch (error) {
      console.error('❌ Upload error:', error)
      toast.error(`ไม่สามารถอัพโหลดได้: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5" />
          อัพโหลดเอกสารสำหรับ Chatbot
        </h3>
      </div>

      <div className="flex gap-2">
        <Button
          variant={uploadMode === 'file' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setUploadMode('file')}
        >
          <Upload className="w-4 h-4 mr-2" />
          ไฟล์
        </Button>
        <Button
          variant={uploadMode === 'url' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setUploadMode('url')}
        >
          <LinkIcon className="w-4 h-4 mr-2" />
          URL
        </Button>
      </div>

      {uploadMode === 'file' ? (
        <div className="space-y-2">
          <Label htmlFor="file">เลือกไฟล์ (PDF, Word, Excel)</Label>
          <Input
            id="file"
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            disabled={isUploading}
          />
          {file && (
            <p className="text-sm text-gray-600">
              ไฟล์: {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="url">URL ของเว็บไซต์</Label>
          <Input
            id="url"
            type="url"
            placeholder="https://example.com/article"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isUploading}
          />
        </div>
      )}

      <Button
        onClick={handleFileUpload}
        disabled={isUploading || (!file && !url)}
        className="w-full"
      >
        {isUploading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            กำลังประมวลผล...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 mr-2" />
            อัพโหลดและประมวลผล
          </>
        )}
      </Button>

      <p className="text-xs text-gray-500">
        ระบบจะแบ่งเอกสารเป็นส่วนย่อยและสร้าง embeddings เพื่อใช้ในการตอบคำถาม
      </p>
    </div>
  )
}
