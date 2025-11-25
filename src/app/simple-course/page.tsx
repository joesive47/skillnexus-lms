'use client'

import { useState } from 'react'
import { createCourse } from '@/app/actions/course'

export default function SimpleCourseTest() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData()
    formData.append('title', 'Test Course ' + Date.now())
    formData.append('description', 'This is a test course')
    formData.append('price', '99.99')
    formData.append('isPublished', 'true')
    
    try {
      const result = await createCourse(formData)
      setResult(result)
      console.log('Course creation result:', result)
    } catch (error) {
      console.error('Error:', error)
      setResult({ success: false, error: 'Unexpected error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Simple Course Creation Test</h1>
      
      <button 
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Test Course'}
      </button>
      
      {result && (
        <div className="mt-6 p-4 border rounded">
          <h3 className="font-bold mb-2">Result:</h3>
          <div className={`p-3 rounded ${result.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {result.success ? 'Course created successfully!' : `Error: ${result.error}`}
          </div>
          <pre className="text-sm mt-2 bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}