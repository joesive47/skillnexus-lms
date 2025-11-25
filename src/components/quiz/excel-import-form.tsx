'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { importQuizFromExcel } from '@/app/actions/quiz'
import { Download } from 'lucide-react'

export function ExcelImportForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    const result = await importQuizFromExcel(formData)

    if (result.success) {
      setSuccess(true)
      // Reset form
      const form = document.getElementById('quiz-import-form') as HTMLFormElement
      form?.reset()
    } else {
      setError(result.error || 'An error occurred')
    }

    setIsLoading(false)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Import Quiz from Excel</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="quiz-import-form" action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Quiz Name</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter quiz name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excelFile">Excel/CSV File</Label>
            <Input
              id="excelFile"
              name="excelFile"
              type="file"
              accept=".xlsx,.csv"
              required
            />
          </div>

          <a
            href="/quiz-template.xlsx"
            download="quiz-template.xlsx"
            className="inline-flex items-center justify-center w-full h-10 px-4 py-2 text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Sample Excel Template
          </a>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          {success && (
            <div className="text-green-500 text-sm">Quiz imported successfully!</div>
          )}

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Importing...' : 'Import Quiz'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}