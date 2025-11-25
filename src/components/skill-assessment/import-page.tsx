'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Upload, Download, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react'
import { importAssessmentQuestions } from '@/app/actions/assessment'
import { toast } from 'sonner'
import * as XLSX from 'xlsx'

interface ImportPageProps {
  onImportComplete: () => void
}

interface ValidationResult {
  isValid: boolean
  errors: string[]
  stats: {
    questions: number
    careers: number
    skills: number
  }
}

export function ImportPage({ onImportComplete }: ImportPageProps) {
  const [file, setFile] = useState<File | null>(null)
  const [data, setData] = useState<any[]>([])
  const [validation, setValidation] = useState<ValidationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [importing, setImporting] = useState(false)

  const requiredColumns = [
    'question_id', 'career_title', 'skill_name', 'question_text',
    'option_1', 'option_2', 'option_3', 'option_4', 'correct_answer', 'score', 'course_link'
  ]

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setLoading(true)

    try {
      const arrayBuffer = await selectedFile.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer)
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)
      
      setData(jsonData)
      validateData(jsonData)
    } catch (error) {
      toast.error('ไม่สามารถอ่านไฟล์ได้')
      setFile(null)
    } finally {
      setLoading(false)
    }
  }

  const validateData = (jsonData: any[]) => {
    const errors: string[] = []
    const careers = new Set()
    const skills = new Set()
    const questionIds = new Set()

    if (jsonData.length === 0) {
      errors.push('ไฟล์ว่างเปล่า')
      setValidation({ isValid: false, errors, stats: { questions: 0, careers: 0, skills: 0 } })
      return
    }

    // Check required columns
    const firstRow = jsonData[0]
    const missingColumns = requiredColumns.filter(col => !(col in firstRow))
    if (missingColumns.length > 0) {
      errors.push(`ขาดคอลัมน์: ${missingColumns.join(', ')}`)
    }

    // Validate each row
    jsonData.forEach((row, index) => {
      const rowNum = index + 2 // Excel row number

      // Check required fields
      requiredColumns.forEach(col => {
        if (col === 'course_link') return // Optional field
        if (!row[col] || row[col].toString().trim() === '') {
          errors.push(`แถว ${rowNum}: ขาดข้อมูล ${col}`)
        }
      })

      // Check duplicate question_id
      const questionId = row.question_id?.toString().trim()
      if (questionId) {
        if (questionIds.has(questionId)) {
          errors.push(`แถว ${rowNum}: question_id ซ้ำ (${questionId})`)
        } else {
          questionIds.add(questionId)
        }
      }

      // Validate correct_answer format
      const correctAnswer = row.correct_answer?.toString().trim()
      if (correctAnswer && !/^[1-4](,[1-4])*$/.test(correctAnswer)) {
        errors.push(`แถว ${rowNum}: correct_answer ต้องเป็น 1,2,3,4 เท่านั้น`)
      }

      // Validate score
      const score = parseInt(row.score)
      if (isNaN(score) || score < 1) {
        errors.push(`แถว ${rowNum}: score ต้องเป็นตัวเลขมากกว่า 0`)
      }

      // Collect stats
      if (row.career_title) careers.add(row.career_title.toString().trim())
      if (row.skill_name) skills.add(row.skill_name.toString().trim())
    })

    setValidation({
      isValid: errors.length === 0,
      errors: errors.slice(0, 10), // Show only first 10 errors
      stats: {
        questions: jsonData.length,
        careers: careers.size,
        skills: skills.size
      }
    })
  }

  const handleImport = async () => {
    if (!validation?.isValid || !data.length) return

    setImporting(true)
    try {
      const result = await importAssessmentQuestions(data)
      if (result.success) {
        toast.success(`นำเข้าสำเร็จ: ${result.data?.questions} คำถาม, ${result.data?.careers} สาขาอาชีพ, ${result.data?.skills} ทักษะ`)
        // Reset form
        setFile(null)
        setData([])
        setValidation(null)
        // Trigger parent refresh
        onImportComplete()
      } else {
        toast.error(result.error || 'เกิดข้อผิดพลาด')
      }
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการนำเข้า')
    } finally {
      setImporting(false)
    }
  }

  const downloadTemplate = () => {
    const link = document.createElement('a')
    link.href = '/skills-assessment-template.xlsx'
    link.download = 'skills-assessment-template.xlsx'
    link.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">นำเข้าข้อสอบประเมินทักษะ</h1>
          <p className="text-gray-600">อัปโหลดไฟล์ Excel เพื่อเพิ่มข้อสอบใหม่</p>
        </div>

        {/* Template Download */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>ดาวน์โหลดแม่แบบ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  ดาวน์โหลดไฟล์แม่แบบ Excel พร้อมตัวอย่างข้อมูล
                </p>
                <div className="text-xs text-gray-500">
                  รองรับ: .xlsx, .xls
                </div>
              </div>
              <Button onClick={downloadTemplate} variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                ดาวน์โหลด Template
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* File Upload */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>อัปโหลดไฟล์</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <FileSpreadsheet className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <Input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="mb-4"
                disabled={loading}
              />
              {file && (
                <p className="text-sm text-green-600">
                  เลือกไฟล์: {file.name}
                </p>
              )}
              {loading && (
                <p className="text-sm text-blue-600">กำลังประมวลผล...</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Validation Results */}
        {validation && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {validation.isValid ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
                ผลการตรวจสอบ
              </CardTitle>
            </CardHeader>
            <CardContent>
              {validation.isValid ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>ข้อมูลถูกต้องครบถ้วน</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600">
                        {validation.stats.questions}
                      </div>
                      <div className="text-sm text-gray-600">คำถาม</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {validation.stats.careers}
                      </div>
                      <div className="text-sm text-gray-600">สาขาอาชีพ</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-pink-600">
                        {validation.stats.skills}
                      </div>
                      <div className="text-sm text-gray-600">ทักษะ</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>พบข้อผิดพลาด {validation.errors.length} รายการ</span>
                  </div>
                  
                  <div className="bg-red-50 rounded-lg p-4">
                    <ul className="space-y-1 text-sm text-red-700">
                      {validation.errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                      {validation.errors.length >= 10 && (
                        <li className="font-medium">... และอื่นๆ</li>
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Preview Table */}
        {data.length > 0 && validation?.isValid && (
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
                    {data.slice(0, 5).map((row, index) => (
                      <tr key={index} className="border-b">
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

        {/* Import Button */}
        {validation?.isValid && (
          <div className="text-center">
            <Button
              onClick={handleImport}
              disabled={importing}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-lg px-8 py-3 gap-2"
            >
              <Upload className="w-5 h-5" />
              {importing ? 'กำลังนำเข้า...' : 'นำเข้าข้อสอบ'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}