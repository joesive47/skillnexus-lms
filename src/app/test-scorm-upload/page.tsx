'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestScormUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [lessonId, setLessonId] = useState('')
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!file || !lessonId) {
      setError('Please select a file and enter a lesson ID')
      return
    }

    setUploading(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('lessonId', lessonId)
      formData.append('replace', 'true')

      console.log('🚀 Uploading SCORM package...')
      console.log('📁 File:', file.name, 'Size:', file.size)
      console.log('🎯 Lesson ID:', lessonId)

      const response = await fetch('/api/scorm/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      
      if (response.ok) {
        setResult(data)
        console.log('✅ Upload successful:', data)
      } else {
        setError(data.error || 'Upload failed')
        console.error('❌ Upload failed:', data)
      }
    } catch (error) {
      console.error('❌ Upload error:', error)
      setError('Network error occurred')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>🧪 SCORM Upload Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="lessonId">Lesson ID</Label>
            <Input
              id="lessonId"
              value={lessonId}
              onChange={(e) => setLessonId(e.target.value)}
              placeholder="Enter lesson ID (e.g., lesson_123)"
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter any lesson ID for testing (it will be created if it doesn't exist)
            </p>
          </div>

          <div>
            <Label htmlFor="scormFile">SCORM Package (.zip)</Label>
            <Input
              id="scormFile"
              type="file"
              accept=".zip"
              onChange={handleFileChange}
            />
            {file && (
              <p className="text-sm text-green-600 mt-1">
                ✅ Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>

          <Button 
            onClick={handleUpload} 
            disabled={uploading || !file || !lessonId}
            className="w-full"
          >
            {uploading ? '⏳ Uploading...' : '🚀 Upload SCORM Package'}
          </Button>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <p className="text-red-700">❌ Error: {error}</p>
            </div>
          )}

          {result && (
            <div className="bg-green-50 border border-green-200 rounded p-3">
              <p className="text-green-700">✅ Success!</p>
              <pre className="text-sm mt-2 bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <h3 className="font-semibold text-blue-800">📝 Test Instructions:</h3>
            <ol className="text-sm text-blue-700 mt-2 space-y-1">
              <li>1. Enter any lesson ID (e.g., "test-lesson-1")</li>
              <li>2. Select the scorm-working-demo.zip file from the public folder</li>
              <li>3. Click upload and check the browser console for detailed logs</li>
              <li>4. Check the server logs for SCORM processing details</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}