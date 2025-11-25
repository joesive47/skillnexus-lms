'use client'

import { useState, useCallback } from 'react'
import { Upload, FileText, CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface UploadStatus {
  documentId?: string
  filename?: string
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'failed'
  progress: number
  message: string
  totalChunks?: number
  processedChunks?: number
  embeddedChunks?: number
}

export default function RAGUploader() {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    status: 'idle',
    progress: 0,
    message: ''
  })
  const [isDragOver, setIsDragOver] = useState(false)

  const checkStatus = useCallback(async (documentId: string) => {
    try {
      const response = await fetch(`/api/chatbot/upload-document?documentId=${documentId}`)
      const data = await response.json()
      
      if (data.error) {
        setUploadStatus(prev => ({
          ...prev,
          status: 'failed',
          message: data.error,
          progress: 0
        }))
        return
      }

      const { status, totalChunks, processedChunks, embeddedChunks, errorMessage } = data
      
      if (status === 'completed') {
        setUploadStatus(prev => ({
          ...prev,
          status: 'completed',
          progress: 100,
          message: `สำเร็จ! ประมวลผล ${totalChunks} ชิ้นส่วน (${embeddedChunks} มี AI embedding)`,
          totalChunks,
          processedChunks,
          embeddedChunks
        }))
      } else if (status === 'failed') {
        setUploadStatus(prev => ({
          ...prev,
          status: 'failed',
          message: errorMessage || 'เกิดข้อผิดพลาดในการประมวลผล',
          progress: 0
        }))
      } else if (status === 'processing') {
        const progress = totalChunks > 0 ? Math.round((processedChunks / totalChunks) * 100) : 50
        setUploadStatus(prev => ({
          ...prev,
          status: 'processing',
          progress,
          message: `กำลังประมวลผล... ${processedChunks}/${totalChunks} ชิ้นส่วน`,
          totalChunks,
          processedChunks,
          embeddedChunks
        }))
        
        // ตรวจสอบสถานะอีกครั้งหลัง 2 วินาที
        setTimeout(() => checkStatus(documentId), 2000)
      }
    } catch (error) {
      console.error('Status check error:', error)
      setUploadStatus(prev => ({
        ...prev,
        status: 'failed',
        message: 'ไม่สามารถตรวจสอบสถานะได้',
        progress: 0
      }))
    }
  }, [])

  const uploadFile = async (file: File) => {
    setUploadStatus({
      status: 'uploading',
      progress: 10,
      message: 'กำลังอัพโหลดไฟล์...',
      filename: file.name
    })

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/chatbot/upload-document', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'การอัพโหลดล้มเหลว')
      }

      setUploadStatus({
        status: 'processing',
        progress: 30,
        message: 'เริ่มประมวลผลเอกสาร...',
        filename: file.name,
        documentId: data.documentId
      })

      // เริ่มตรวจสอบสถานะ
      setTimeout(() => checkStatus(data.documentId), 1000)

    } catch (error) {
      console.error('Upload error:', error)
      setUploadStatus({
        status: 'failed',
        progress: 0,
        message: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการอัพโหลด',
        filename: file.name
      })
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      uploadFile(file)
    }
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)
    
    const file = event.dataTransfer.files[0]
    if (file) {
      uploadFile(file)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const resetUpload = () => {
    setUploadStatus({
      status: 'idle',
      progress: 0,
      message: ''
    })
  }

  const getStatusIcon = () => {
    switch (uploadStatus.status) {
      case 'uploading':
      case 'processing':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusColor = () => {
    switch (uploadStatus.status) {
      case 'uploading':
      case 'processing':
        return 'bg-blue-500'
      case 'completed':
        return 'bg-green-500'
      case 'failed':
        return 'bg-red-500'
      default:
        return 'bg-gray-300'
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          อัพโหลดเอกสารสำหรับ RAG Chatbot
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver
              ? 'border-blue-500 bg-blue-50'
              : uploadStatus.status === 'idle'
              ? 'border-gray-300 hover:border-gray-400'
              : 'border-gray-200'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {uploadStatus.status === 'idle' ? (
            <>
              <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์
              </p>
              <p className="text-sm text-gray-500 mb-4">
                รองรับไฟล์: TXT, DOCX, DOC (ขนาดไม่เกิน 5MB)
              </p>
              <input
                type="file"
                accept=".txt,.docx,.doc"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <Button asChild>
                <label htmlFor="file-upload" className="cursor-pointer">
                  เลือกไฟล์
                </label>
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                {getStatusIcon()}
                <span className="font-medium">{uploadStatus.filename}</span>
              </div>
              
              {uploadStatus.progress > 0 && (
                <div className="space-y-2">
                  <Progress 
                    value={uploadStatus.progress} 
                    className="w-full"
                  />
                  <p className="text-sm text-gray-600">{uploadStatus.message}</p>
                </div>
              )}
              
              {uploadStatus.status === 'completed' && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    เอกสารถูกประมวลผลเรียบร้อยแล้ว! ตอนนี้ chatbot สามารถใช้ข้อมูลจากเอกสารนี้ตอบคำถามได้
                  </AlertDescription>
                </Alert>
              )}
              
              {uploadStatus.status === 'failed' && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {uploadStatus.message}
                  </AlertDescription>
                </Alert>
              )}
              
              {(uploadStatus.status === 'completed' || uploadStatus.status === 'failed') && (
                <Button onClick={resetUpload} variant="outline">
                  อัพโหลดไฟล์ใหม่
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">คำแนะนำ:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• อัพโหลดเอกสารที่มีข้อมูลที่ต้องการให้ chatbot ตอบคำถาม</li>
            <li>• ไฟล์จะถูกแบ่งเป็นชิ้นส่วนเล็กๆ และสร้าง AI embedding</li>
            <li>• หลังจากประมวลผลเสร็จ chatbot จะสามารถค้นหาและตอบคำถามจากเอกสารได้</li>
            <li>• รองรับภาษาไทยและภาษาอังกฤษ</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}