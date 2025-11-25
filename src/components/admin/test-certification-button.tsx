'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { adminTestE2E, resetCourseProgress } from '@/app/actions/admin'
import { TestTube, RotateCcw, CheckCircle, XCircle, Trophy } from 'lucide-react'

interface TestCertificationButtonProps {
  courseId: string
  courseTitle: string
}

export function TestCertificationButton({ courseId, courseTitle }: TestCertificationButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message?: string
    error?: string
    certificate?: any
    completedLessons?: number
  } | null>(null)

  const handleTest = async () => {
    setIsLoading(true)
    setResult(null)
    
    try {
      const response = await adminTestE2E(courseId)
      setResult(response)
      
      if (response.success && response.certificate) {
        // Show success notification with certificate info
        console.log('Certificate generated:', response.certificate)
      }
    } catch (error) {
      setResult({
        success: false,
        error: 'Failed to run E2E test'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = async () => {
    setIsResetting(true)
    
    try {
      const response = await resetCourseProgress(courseId)
      if (response.success) {
        setResult(null)
        // Optionally show success message
      }
    } catch (error) {
      console.error('Failed to reset progress:', error)
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handleTest}
          disabled={isLoading}
          className="text-orange-700 border-orange-300 hover:bg-orange-100"
        >
          {isLoading ? (
            <>
              <TestTube className="w-3 h-3 mr-1 animate-spin" />
              Testing...
            </>
          ) : (
            <>
              <TestTube className="w-3 h-3 mr-1" />
              Test Pipeline
            </>
          )}
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={handleReset}
          disabled={isResetting}
          className="text-gray-600 hover:bg-gray-100"
        >
          {isResetting ? (
            <RotateCcw className="w-3 h-3 animate-spin" />
          ) : (
            <RotateCcw className="w-3 h-3" />
          )}
        </Button>
      </div>

      {result && (
        <div className={`p-3 rounded-lg text-sm ${
          result.success 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-start gap-2">
            {result.success ? (
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            )}
            <div className="flex-1">
              <p className={result.success ? 'text-green-800' : 'text-red-800'}>
                {result.message || result.error}
              </p>
              
              {result.success && result.completedLessons && (
                <p className="text-green-700 text-xs mt-1">
                  ✅ {result.completedLessons} lessons completed
                </p>
              )}
              
              {result.certificate && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                  <div className="flex items-center gap-1 mb-1">
                    <Trophy className="w-3 h-3 text-yellow-600" />
                    <span className="text-yellow-800 font-medium text-xs">Certificate Generated!</span>
                  </div>
                  <p className="text-yellow-700 text-xs">
                    ID: {result.certificate.uniqueId}
                  </p>
                  <p className="text-yellow-600 text-xs">
                    Issued: {new Date(result.certificate.issuedAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}