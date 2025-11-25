'use client'

import { useState } from 'react'
import { createCourse } from '@/app/actions/course'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function TestCoursePage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    
    try {
      const result = await createCourse(formData)
      setResult(result)
    } catch (error) {
      setResult({ success: false, error: 'Unexpected error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Test Course Creation</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" required />
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" />
        </div>
        
        <div>
          <Label htmlFor="price">Price</Label>
          <Input id="price" name="price" type="number" step="0.01" />
        </div>
        
        <div>
          <input type="checkbox" id="isPublished" name="isPublished" value="true" />
          <Label htmlFor="isPublished" className="ml-2">Published</Label>
        </div>
        
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Course'}
        </Button>
      </form>
      
      {result && (
        <div className="mt-6 p-4 border rounded">
          <h3 className="font-bold">Result:</h3>
          <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}