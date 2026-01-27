'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Upload, Link, FileText } from 'lucide-react'
import { toast } from 'sonner'

interface InteractiveLessonFormProps {
  lessonId?: string
  onSuccess?: () => void
}

export default function InteractiveLessonForm({ 
  lessonId, 
  onSuccess 
}: InteractiveLessonFormProps) {
  const [uploadType, setUploadType] = useState<'file' | 'url'>('file')
  const [file, setFile] = useState<File | null>(null)
  const [launchUrl, setLaunchUrl] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = async () => {
    if (!lessonId) {
      toast.error('กรุณาเลือกบทเรียน')
      return
    }

    if (uploadType === 'file' && !file) {
      toast.error('กรุณาเลือกไฟล์')
      return
    }

    if (uploadType === 'url' && !launchUrl) {
      toast.error('กรุณาใส่ URL')
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('lessonId', lessonId)
      
      if (uploadType === 'file' && file) {
        formData.append('file', file)
      } else {
        formData.append('launchUrl', launchUrl)
      }

      const response = await fetch('/api/interactive/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        toast.success('อัปโหลดสำเร็จ!')
        setFile(null)
        setLaunchUrl('')
        onSuccess?.()
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการอัปโหลด')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>เพิ่มเนื้อหาแบบ Interactive</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-4">
          <Button
            variant={uploadType === 'file' ? 'default' : 'outline'}
            onClick={() => setUploadType('file')}
            className="flex-1"
          >
            <Upload className="h-4 w-4 mr-2" />
            อัปโหลดไฟล์
          </Button>
          <Button
            variant={uploadType === 'url' ? 'default' : 'outline'}
            onClick={() => setUploadType('url')}
            className="flex-1"
          >
            <Link className="h-4 w-4 mr-2" />
            ใส่ URL
          </Button>
        </div>

        {uploadType === 'file' ? (
          <div className="space-y-2">
            <Label htmlFor="file">ไฟล์ HTML5/SCORM (.html, .zip)</Label>
            <Input
              id="file"
              type="file"
              accept=".html,.zip"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            {file && (
              <p className="text-sm text-muted-foreground">
                ไฟล์ที่เลือก: {file.name}
              </p>
            )}
            <div className="bg-yellow-50 p-3 rounded-lg mt-2">
              <p className="text-sm text-yellow-800">
                ⚠️ <strong>สำหรับ Vercel:</strong> ใช้ "ใส่ URL" แทนการอัปโหลดไฟล์
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="url">SCORM Package URL (jsDelivr CDN)</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://cdn.jsdelivr.net/gh/username/repo@main/scorm-packages/course.zip"
              value={launchUrl}
              onChange={(e) => setLaunchUrl(e.target.value)}
            />
            <div className="bg-green-50 p-3 rounded-lg space-y-2">
              <p className="text-sm font-semibold text-green-900">📦 SCORM Packages พร้อมใช้:</p>
              <div className="space-y-1 text-xs text-green-800">
                <p className="font-mono break-all">
                  • AI Architect: https://cdn.jsdelivr.net/gh/joesive47/skillnexus-lms@main/scorm-packages/ai-architect-blueprint.zip
                </p>
                <p className="font-mono break-all">
                  • Prompt Engineering: https://cdn.jsdelivr.net/gh/joesive47/skillnexus-lms@main/scorm-packages/prompt-engineering.zip
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">
            คำแนะนำสำหรับนักพัฒนาเกม
          </h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p>• ใช้ window.parent.postMessage() เพื่อส่งผลคะแนน</p>
            <p>• รูปแบบ: {`{score: 85, passed: true}`}</p>
            <p>• score: คะแนนเป็นเปอร์เซ็นต์ (0-100)</p>
            <p>• passed: true/false สำหรับผ่าน/ไม่ผ่าน</p>
          </div>
        </div>

        <Button
          onClick={handleFileUpload}
          disabled={isUploading || !lessonId}
          className="w-full"
        >
          {isUploading ? 'กำลังอัปโหลด...' : 'อัปโหลด'}
        </Button>
      </CardContent>
    </Card>
  )
}