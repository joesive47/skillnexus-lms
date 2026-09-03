'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { importQuizFromExcel } from '@/app/actions/quiz'
import { Download, Info } from 'lucide-react'

export function ExcelImportForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [shuffleOptions, setShuffleOptions] = useState(true)
  const [randomizeQuestions, setRandomizeQuestions] = useState(true)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    // Add shuffle and randomize settings
    formData.set('shuffleOptions', shuffleOptions.toString())
    formData.set('randomize', randomizeQuestions.toString())

    const result = await importQuizFromExcel(formData)

    if (result.success) {
      setSuccess(true)
      // Reset form
      const form = document.getElementById('quiz-import-form') as HTMLFormElement
      form?.reset()
      setShuffleOptions(true)
      setRandomizeQuestions(true)
    } else {
      setError(result.error || 'An error occurred')
    }

    setIsLoading(false)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Import Quiz from Excel</CardTitle>
        <CardDescription>
          นำเข้าข้อสอบจากไฟล์ Excel พร้อมตั้งค่าการสุ่มข้อสอบและตัวเลือก
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="quiz-import-form" action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">ชื่อชุดข้อสอบ</Label>
            <Input
              id="title"
              name="title"
              placeholder="เช่น แบบทดสอบท้ายบท 1"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excelFile">ไฟล์ Excel/CSV</Label>
            <Input
              id="excelFile"
              name="excelFile"
              type="file"
              accept=".xlsx,.xls,.csv"
              required
            />
            <p className="text-xs text-muted-foreground">
              รองรับไฟล์ .xlsx, .xls และ .csv
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="questionsToShow">จำนวนข้อที่จะให้ทำ</Label>
              <Input
                id="questionsToShow"
                name="questionsToShow"
                type="number"
                min="1"
                placeholder="เช่น 20"
              />
              <p className="text-xs text-muted-foreground">
                ถ้าไม่ระบุ = ทำทุกข้อ
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeLimit">เวลาจำกัด (นาที)</Label>
              <Input
                id="timeLimit"
                name="timeLimit"
                type="number"
                min="0"
                defaultValue="0"
                placeholder="0 = ไม่จำกัด"
              />
            </div>
          </div>

          <div className="space-y-3 border rounded-lg p-4 bg-slate-50">
            <Label className="text-sm font-semibold">ตั้งค่าการสุ่ม</Label>
            
            <div className="flex items-start space-x-3">
              <Checkbox
                id="randomizeQuestions"
                checked={randomizeQuestions}
                onCheckedChange={(checked) => setRandomizeQuestions(checked as boolean)}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="randomizeQuestions"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  สุ่มลำดับคำถาม
                </label>
                <p className="text-xs text-muted-foreground">
                  แต่ละคนจะได้คำถามลำดับต่างกัน (ป้องกันลอก)
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="shuffleOptions"
                checked={shuffleOptions}
                onCheckedChange={(checked) => setShuffleOptions(checked as boolean)}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="shuffleOptions"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  สุ่มลำดับตัวเลือก (A, B, C, D)
                </label>
                <p className="text-xs text-muted-foreground">
                  แต่ละคนจะได้ตัวเลือกลำดับต่างกัน
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-2">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <strong>ตัวอย่าง:</strong> Import 30 ข้อ แต่ตั้งค่า "จำนวนข้อที่จะให้ทำ" = 20<br />
              → ระบบจะสุ่มเลือก 20 ข้อจาก 30 ข้อให้แต่ละคน
            </div>
          </div>

          <a
            href="/quiz-template.xlsx"
            download="quiz-template.xlsx"
            className="inline-flex items-center justify-center w-full h-10 px-4 py-2 text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md"
          >
            <Download className="w-4 h-4 mr-2" />
            ดาวน์โหลดตัวอย่างไฟล์ Excel
          </a>

          {error && (
            <div className="text-red-500 text-sm bg-red-50 border border-red-200 rounded p-3">
              ❌ {error}
            </div>
          )}

          {success && (
            <div className="text-green-600 text-sm bg-green-50 border border-green-200 rounded p-3">
              ✅ นำเข้าข้อสอบสำเร็จ!
            </div>
          )}

          <Button type="submit" disabled={isLoading} className="w-full" size="lg">
            {isLoading ? 'กำลังนำเข้า...' : 'นำเข้าข้อสอบ'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}