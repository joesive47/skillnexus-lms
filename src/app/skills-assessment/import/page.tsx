'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, Download, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { importAssessmentQuestions } from '@/app/actions/assessment'
import * as XLSX from 'xlsx'

export default function ImportPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<any[]>([])
  const [validation, setValidation] = useState<any>(null)
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleFileUpload = async (selectedFile: File) => {
    setFile(selectedFile)
    
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer)
      const workbook = XLSX.read(data, { type: 'array' })
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)
      
      setPreview(jsonData.slice(0, 5))
      validateData(jsonData)
    }
    reader.readAsArrayBuffer(selectedFile)
  }

  const validateData = (data: any[]) => {
    const requiredColumns = [
      'question_id', 'career_title', 'skill_name', 'question_text',
      'option_1', 'option_2', 'option_3', 'option_4', 'correct_answer', 'score', 'course_link'
    ]
    
    const validation = {
      hasAllColumns: true,
      uniqueIds: true,
      validAnswers: true,
      totalQuestions: data.length,
      careers: new Set(),
      skills: new Set(),
      errors: [] as string[]
    }

    if (data.length === 0) {
      validation.errors.push('ไฟล์ว่างเปล่า')
      setValidation(validation)
      return
    }

    const firstRow = data[0]
    const missingColumns = requiredColumns.filter(col => !(col in firstRow))
    if (missingColumns.length > 0) {
      validation.hasAllColumns = false
      validation.errors.push(`ขาดคอลัมน์: ${missingColumns.join(', ')}`)
    }

    const questionIds = new Set()
    data.forEach((row, index) => {
      if (questionIds.has(row.question_id)) {
        validation.uniqueIds = false
        validation.errors.push(`question_id ซ้ำ: ${row.question_id}`)
      }
      questionIds.add(row.question_id)

      const correctAnswers = row.correct_answer?.toString().split(',')
      if (!correctAnswers?.every((ans: string) => ['1', '2', '3', '4'].includes(ans.trim()))) {
        validation.validAnswers = false
        validation.errors.push(`correct_answer ไม่ถูกต้องในแถว ${index + 2}`)
      }

      validation.careers.add(row.career_title)
      validation.skills.add(row.skill_name)
    })

    setValidation(validation)
  }

  const handleImport = async () => {
    if (!file || !validation?.hasAllColumns || !validation?.uniqueIds || !validation?.validAnswers) {
      alert('กรุณาตรวจสอบข้อมูลในไฟล์ก่อนนำเข้า')
      return
    }
    
    setImporting(true)
    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: 'array' })
          const worksheet = workbook.Sheets[workbook.SheetNames[0]]
          const jsonData = XLSX.utils.sheet_to_json(worksheet)
          
          if (jsonData.length === 0) {
            throw new Error('ไฟล์ว่างเปล่า')
          }
          
          const result = await importAssessmentQuestions(jsonData)
          
          if (result.success) {
            setResult(result)
          } else {
            throw new Error(result.error || 'เกิดข้อผิดพลาดในการนำเข้าข้อมูล')
          }
        } catch (error) {
          console.error('Import processing error:', error)
          alert(`เกิดข้อผิดพลาด: ${error instanceof Error ? error.message : 'ไม่ทราบสาเหตุ'}`)
        } finally {
          setImporting(false)
        }
      }
      
      reader.onerror = () => {
        setImporting(false)
        alert('ไม่สามารถอ่านไฟล์ได้')
      }
      
      reader.readAsArrayBuffer(file)
    } catch (error) {
      console.error('Import error:', error)
      setImporting(false)
      alert('เกิดข้อผิดพลาดในการนำเข้าข้อมูล')
    }
  }

  const downloadTemplate = () => {
    const template = [
      {
        question_id: 'Q001',
        career_title: 'Social Media Manager',
        skill_name: 'Content Creation',
        question_text: 'คุณใช้เครื่องมือใดในการออกแบบ?',
        option_1: 'Canva',
        option_2: 'Photoshop',
        option_3: 'Figma',
        option_4: 'Illustrator',
        correct_answer: '2,3,4',
        score: 5,
        course_link: 'https://example.com/course'
      }
    ]
    
    const ws = XLSX.utils.json_to_sheet(template)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Template')
    XLSX.writeFile(wb, 'Skills_Assessment_Template.xlsx')
  }

  if (result?.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="text-center">
            <CardContent className="p-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">นำเข้าข้อสอบสำเร็จ!</h2>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{result.data.questions}</div>
                  <div className="text-sm text-gray-600">คำถาม</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{result.data.careers}</div>
                  <div className="text-sm text-gray-600">สาขาอาชีพ</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{result.data.skills}</div>
                  <div className="text-sm text-gray-600">ทักษะ</div>
                </div>
              </div>
              <Button onClick={() => router.push('/skills-assessment')} className="bg-gradient-to-r from-indigo-500 to-purple-600">
                ไปหน้าเลือกสาขาอาชีพ
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => router.push('/skills-assessment')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับหน้าหลัก
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">จัดการข้อสอบ - Import Questions</h1>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>อัปโหลดไฟล์ Excel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-300 transition-colors">
              <Upload className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <p className="text-lg text-gray-600 mb-4">
                ลากไฟล์ Excel มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์
              </p>
              <p className="text-sm text-gray-500 mb-4">
                รองรับไฟล์ .xlsx และ .xls เท่านั้น
              </p>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                className="hidden"
                id="file-upload"
              />
              <div className="flex gap-4 justify-center">
                <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    เลือกไฟล์
                  </label>
                </Button>
                <Button variant="outline" onClick={downloadTemplate} className="border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                  <Download className="w-4 h-4 mr-2" />
                  ดาวน์โหลด Template
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {preview.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>ตัวอย่างข้อมูล (5 แถวแรก)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Question ID</th>
                      <th className="text-left p-2">Career</th>
                      <th className="text-left p-2">Skill</th>
                      <th className="text-left p-2">Question</th>
                      <th className="text-left p-2">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((row, i) => (
                      <tr key={i} className="border-b">
                        <td className="p-2">{row.question_id}</td>
                        <td className="p-2">{row.career_title}</td>
                        <td className="p-2">{row.skill_name}</td>
                        <td className="p-2 max-w-xs truncate">{row.question_text}</td>
                        <td className="p-2">{row.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {validation && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>สถานะการตรวจสอบ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {validation.hasAllColumns ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  )}
                  <span>คอลัมน์ครบถ้วน</span>
                </div>
                <div className="flex items-center gap-2">
                  {validation.uniqueIds ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  )}
                  <span>ไม่มี question_id ซ้ำ</span>
                </div>
                <div className="flex items-center gap-2">
                  {validation.validAnswers ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  )}
                  <span>correct_answer ถูกต้อง</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">คำถามทั้งหมด:</span> {validation.totalQuestions}
                </div>
                <div>
                  <span className="font-medium">สาขาอาชีพ:</span> {validation.careers.size}
                </div>
                <div>
                  <span className="font-medium">ทักษะ:</span> {validation.skills.size}
                </div>
              </div>

              {validation.errors.length > 0 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                  <h4 className="font-medium text-red-800 mb-2">ข้อผิดพลาด:</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    {validation.errors.map((error: string, i: number) => (
                      <li key={i}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {validation?.hasAllColumns && validation?.uniqueIds && validation?.validAnswers && (
          <div className="flex gap-4">
            <Button
              onClick={handleImport}
              disabled={importing || !validation?.hasAllColumns || !validation?.uniqueIds || !validation?.validAnswers}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50"
            >
              {importing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  กำลังนำเข้า...
                </>
              ) : (
                'นำเข้าข้อสอบ'
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setFile(null)
                setPreview([])
                setValidation(null)
                setResult(null)
              }}
              disabled={importing}
            >
              ยกเลิก
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}