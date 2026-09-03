'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Upload, FileSpreadsheet, Download } from 'lucide-react'
import * as XLSX from 'xlsx'

interface ImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (data: any[]) => void
}

export function ImportDialog({ open, onOpenChange, onImport }: ImportDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleImport = async () => {
    if (!file) return

    setLoading(true)
    try {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data)
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)
      
      onImport(jsonData)
    } catch (error) {
      console.error('Import error:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadTemplate = () => {
    const link = document.createElement('a')
    link.href = '/skills-assessment-template.xlsx'
    link.download = 'skills-assessment-template.xlsx'
    link.click()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>นำเข้าข้อสอบจาก Excel</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            <p>รองรับไฟล์ .xlsx และ .xls</p>
            <p>ข้อมูลต้องมีคอลัมน์ที่จำเป็น:</p>
            <ul className="list-disc list-inside mt-2 text-xs space-y-1">
              <li>question_id - รหัสคำถาม</li>
              <li>career_title - ชื่ออาชีพ</li>
              <li>skill_name - ชื่อทักษะ</li>
              <li>question_text - คำถาม</li>
              <li>option_1, option_2, option_3, option_4 - ตัวเลือก</li>
              <li>correct_answer - คำตอบที่ถูก (1,2,3,4)</li>
              <li>score - คะแนน</li>
            </ul>
          </div>

          <Button
            variant="outline"
            onClick={downloadTemplate}
            className="w-full gap-2"
          >
            <Download className="w-4 h-4" />
            ดาวน์โหลดแม่แบบ Excel
          </Button>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <FileSpreadsheet className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <Input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="mb-4"
            />
            {file && (
              <p className="text-sm text-green-600">
                เลือกไฟล์: {file.name}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              ยกเลิก
            </Button>
            <Button
              onClick={handleImport}
              disabled={!file || loading}
              className="flex-1 gap-2"
            >
              <Upload className="w-4 h-4" />
              {loading ? 'กำลังนำเข้า...' : 'นำเข้า'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}