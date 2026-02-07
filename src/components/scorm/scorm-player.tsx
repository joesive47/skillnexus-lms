'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Play, Pause, RotateCcw, ExternalLink } from 'lucide-react'

interface ScormPlayerProps {
  packagePath: string
  lessonId: string
  userId: string
  onComplete?: () => void
  className?: string
  hideHeader?: boolean
  fullHeight?: boolean
}

export function ScormPlayer({ 
  packagePath, 
  lessonId, 
  userId, 
  onComplete,
  className = '',
  hideHeader = false,
  fullHeight = false
}: ScormPlayerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [completionStatus, setCompletionStatus] = useState('incomplete')
  const [score, setScore] = useState<number | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    // Load existing progress
    loadProgress()
  }, [lessonId, userId])

  async function loadProgress() {
    try {
      const response = await fetch(`/api/scorm/progress?lessonId=${lessonId}&userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.progress) {
          setProgress(data.progress.scoreRaw || 0)
          setCompletionStatus(data.progress.completionStatus || 'incomplete')
          setScore(data.progress.scoreRaw)
        }
      }
    } catch (error) {
      console.error('Error loading progress:', error)
    }
  }

  async function saveProgress(cmiData: any) {
    try {
      await fetch('/api/scorm/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonId,
          userId,
          cmiData,
        }),
      })

      // Update local state
      if (cmiData['cmi.score.raw']) {
        setScore(parseFloat(cmiData['cmi.score.raw']))
        setProgress(parseFloat(cmiData['cmi.score.raw']))
      }

      if (cmiData['cmi.completion_status']) {
        setCompletionStatus(cmiData['cmi.completion_status'])
        if (cmiData['cmi.completion_status'] === 'completed') {
          // Handle completion internally
          console.log('SCORM lesson completed!')
          onComplete?.()
        }
      }
    } catch (error) {
      console.error('Error saving progress:', error)
    }
  }

  function handleIframeLoad() {
    setIsLoading(false)
    
    // Set up SCORM API communication
    if (iframeRef.current?.contentWindow) {
      const iframe = iframeRef.current.contentWindow as any
      
      // Provide SCORM API to the content
      iframe.API = {
        LMSInitialize: () => 'true',
        LMSFinish: () => 'true',
        LMSGetValue: (element: string) => {
          // Return stored values based on element
          switch (element) {
            case 'cmi.completion_status':
              return completionStatus
            case 'cmi.score.raw':
              return score?.toString() || ''
            default:
              return ''
          }
        },
        LMSSetValue: (element: string, value: string) => {
          // Handle setting values
          const cmiData: any = {}
          cmiData[element] = value
          saveProgress(cmiData)
          return 'true'
        },
        LMSCommit: () => 'true',
        LMSGetLastError: () => '0',
        LMSGetErrorString: () => '',
        LMSGetDiagnostic: () => ''
      }

      // Also provide API_1484_11 for SCORM 2004
      iframe.API_1484_11 = iframe.API
    }
  }

  function resetProgress() {
    setProgress(0)
    setScore(null)
    setCompletionStatus('incomplete')
    
    // Reload iframe
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src
    }
  }

  function openInNewWindow() {
    const scormUrl = packagePath.startsWith('http') 
      ? packagePath.replace('.zip', '/index.html')
      : `${packagePath}/index.html`
    window.open(scormUrl, '_blank', 'width=1024,height=768,scrollbars=yes,resizable=yes')
  }

  const scormUrl = packagePath.startsWith('http') 
    ? packagePath.replace('.zip', '/index.html')
    : `${packagePath}/index.html`

  return (
    <Card className={`flex flex-col ${fullHeight ? 'h-full' : ''} ${className}`}>
      {!hideHeader && (
        <CardHeader className="flex-shrink-0">
          <CardTitle className="flex items-center justify-between">
            <span>เนื้อหา SCORM</span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={resetProgress}
                disabled={isLoading}
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                รีเซ็ต
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={openInNewWindow}
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                เปิดหน้าต่างใหม่
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={`flex flex-col ${fullHeight ? 'flex-1 min-h-0' : ''} ${hideHeader ? 'p-0' : 'space-y-4'}`}>
        {!hideHeader && (
          <div className="space-y-2 flex-shrink-0">
            <div className="flex justify-between text-sm">
              <span>ความคืบหน้า:</span>
              <span>{completionStatus === 'completed' ? 'เสร็จสมบูรณ์' : 'กำลังเรียน'}</span>
            </div>
            {score !== null && (
              <div className="flex justify-between text-sm">
                <span>คะแนน:</span>
                <span>{score}%</span>
              </div>
            )}
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {/* SCORM Content Frame - Flex-based, no fixed height */}
        <div className={`relative ${fullHeight ? 'flex-1 min-h-0' : 'h-[600px]'}`}>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">กำลังโหลดเนื้อหา SCORM...</p>
              </div>
            </div>
          )}
          <iframe
            ref={iframeRef}
            src={scormUrl}
            className={`w-full h-full ${hideHeader ? 'rounded-none' : 'border rounded-lg'}`}
            onLoad={handleIframeLoad}
            title="SCORM Content"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
            allowFullScreen
          />
        </div>

        {!hideHeader && (
          <div className="text-xs text-gray-500 space-y-1 flex-shrink-0">
            <p>• เนื้อหา SCORM จะบันทึกความคืบหน้าอัตโนมัติ</p>
            <p>• ทำกิจกรรมให้ครบทุกส่วนเพื่อทำเครื่องหมายว่าเรียนจบ</p>
            <p>• หากต้องการประสบการณ์ที่ดีกว่า ใช้ "เปิดหน้าต่างใหม่"</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
}