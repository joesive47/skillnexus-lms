'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, Download, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react'

interface ExcelQAImportProps {
  onImportSuccess: () => void
}

export function ExcelQAImport({ onImportSuccess }: ExcelQAImportProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [preview, setPreview] = useState<any[]>([])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/chatbot/excel-import', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (response.ok) {
        setSuccess(`นำเข้าสำเร็จ ${result.imported} คำถาม-คำตอบ`)
        setPreview(result.preview || [])
        onImportSuccess()
        
        // Reset form
        event.target.value = ''
      } else {
        setError(result.error || 'เกิดข้อผิดพลาดในการนำเข้า')
      }
    } catch (error) {
      setError('เกิดข้อผิดพลาดในการอัปโหลดไฟล์')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-green-600" />
          นำเข้าคำถาม-คำตอบจาก Excel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Upload */}
        <div className="space-y-2">
          <Label htmlFor="excel-file">เลือกไฟล์ Excel (.xlsx, .xls)</Label>
          <Input
            id="excel-file"
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            disabled={isLoading}
          />
        </div>

        {/* Template Download */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="flex-1"
          >
            <a href="/chatbot-template.xlsx" download>
              <Download className="w-4 h-4 mr-2" />
              ดาวน์โหลดแม่แบบ Excel
            </a>
          </Button>
        </div>

        {/* Status Messages */}
        {isLoading && (
          <div className="flex items-center gap-2 text-blue-600">
            <Upload className="w-4 h-4 animate-spin" />
            กำลังประมวลผลไฟล์...
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-md">
            <CheckCircle className="w-4 h-4" />
            {success}
          </div>
        )}

        {/* Preview */}
        {preview.length > 0 && (
          <div className="space-y-2">
            <Label>ตัวอย่างข้อมูลที่นำเข้า:</Label>
            <div className="max-h-40 overflow-y-auto border rounded-md p-2 bg-gray-50">
              {preview.slice(0, 3).map((item, index) => (
                <div key={index} className="text-sm mb-2 pb-2 border-b last:border-b-0">
                  <div className="font-medium">Q: {item.question}</div>
                  <div className="text-gray-600">A: {item.answer.substring(0, 100)}...</div>
                </div>
              ))}
              {preview.length > 3 && (
                <div className="text-xs text-gray-500 text-center">
                  และอีก {preview.length - 3} รายการ
                </div>
              )}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
          <div className="font-medium mb-1">รูปแบบไฟล์ Excel:</div>
          <ul className="list-disc list-inside space-y-1">
            <li>คอลัมน์ A: คำถาม (Question)</li>
            <li>คอลัมน์ B: คำตอบ (Answer)</li>
            <li>คอลัมน์ C: หมวดหมู่ (Category) - ไม่บังคับ</li>
            <li>แถวแรกเป็นหัวข้อ (Header)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}