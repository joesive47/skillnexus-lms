'use client'

import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Loader2, Play, Pause } from 'lucide-react'

interface ScormPlayerProps {
  lessonId: string
  onComplete?: () => void
}

export default function ScormPlayer({ lessonId, onComplete }: ScormPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [scormData, setScormData] = useState<any>(null)
  const [progress, setProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    loadScormPackage()
  }, [lessonId])

  const loadScormPackage = async () => {
    try {
      setLoading(true)
      
      // First try to get SCORM package info
      const packageResponse = await fetch(`/api/scorm/packages/${lessonId}`)
      const packageData = await packageResponse.json()

      if (!packageResponse.ok) {
        throw new Error(packageData.error || 'SCORM package not found')
      }

      setScormData(packageData)
      setupScormAPI(packageData.package.id)
      
      // Load the SCORM content directly
      if (iframeRef.current && packageData.package) {
        const scormPath = packageData.package.packagePath
        const entryPoint = packageData.package.entryPoint || 'index.html'
        const scormUrl = `/api/scorm/${scormPath}/${entryPoint}`
        iframeRef.current.src = scormUrl
      }
    } catch (err) {
      console.error('SCORM loading error:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const setupScormAPI = (packageId: string) => {
    // SCORM API Implementation
    const scormAPI = {
      Initialize: () => {
        setIsPlaying(true)
        return 'true'
      },
      
      Terminate: () => {
        setIsPlaying(false)
        return 'true'
      },
      
      GetValue: (element: string) => {
        const cmiData = scormData?.progress?.cmiData ? JSON.parse(scormData.progress.cmiData) : {}
        return cmiData[element] || ''
      },
      
      SetValue: (element: string, value: string) => {
        updateProgress(packageId, { [element]: value })
        
        if (element === 'cmi.completion_status' && value === 'completed') {
          setProgress(100)
          onComplete?.()
        }
        
        return 'true'
      },
      
      Commit: () => 'true',
      GetLastError: () => '0',
      GetErrorString: () => '',
      GetDiagnostic: () => ''
    }

    // Make API available globally
    ;(window as any).API = scormAPI
    ;(window as any).API_1484_11 = scormAPI
  }

  const updateProgress = async (packageId: string, cmiData: any) => {
    try {
      await fetch('/api/scorm/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId, cmiData })
      })
    } catch (error) {
      console.error('Failed to update SCORM progress:', error)
    }
  }

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading SCORM content...</span>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-8">
          <div className="text-center text-red-600">
            <p className="text-lg font-semibold">Error loading SCORM content</p>
            <p className="text-sm mt-2">{error}</p>
            <Button onClick={loadScormPackage} className="mt-4">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{scormData?.package?.title || 'SCORM Content'}</span>
          <div className="flex items-center space-x-2">
            {isPlaying ? (
              <Pause className="h-5 w-5 text-green-600" />
            ) : (
              <Play className="h-5 w-5 text-gray-400" />
            )}
            <span className="text-sm text-gray-600">
              {progress}% Complete
            </span>
          </div>
        </CardTitle>
        <Progress value={progress} className="w-full" />
      </CardHeader>
      <CardContent>
        <div className="relative w-full" style={{ height: '600px' }}>
          <iframe
            ref={iframeRef}
            className="w-full h-full border-0 rounded-lg"
            title="SCORM Content"
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        </div>
      </CardContent>
    </Card>
  )
}