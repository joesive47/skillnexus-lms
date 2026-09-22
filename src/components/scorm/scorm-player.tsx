'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Play, Pause, RotateCcw, Maximize, Minimize } from 'lucide-react'

interface ScormPlayerProps {
  packagePath: string
  lessonId: string
  userId: string
  onComplete?: () => void
  className?: string
  hideHeader?: boolean
  fullHeight?: boolean
  isFullscreen?: boolean
  onToggleFullscreen?: () => void
}

export function ScormPlayer({ 
  packagePath, 
  lessonId, 
  userId, 
  onComplete,
  className = '',
  hideHeader = false,
  fullHeight = false,
  isFullscreen = false,
  onToggleFullscreen
}: ScormPlayerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [completionStatus, setCompletionStatus] = useState('incomplete')
  const [score, setScore] = useState<number | null>(null)
  const [extractedUrl, setExtractedUrl] = useState<string | null>(null)
  const [extractionError, setExtractionError] = useState<string | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const cmiDataRef = useRef<Record<string, string>>({})

  // Serve archive assets from the LMS origin rather than asking the browser
  // to download and unpack a ZIP. This preserves relative URLs in SCORM
  // content and avoids browser filters that block binary archive requests.
  useEffect(() => {
    let cancelled = false
    const isZipFile = packagePath.endsWith('.zip')
    
    if (!isZipFile) {
      // Direct URL to SCORM content (traditional hosting)
      setExtractedUrl(packagePath)
      setIsLoading(false)
      return
    }

    async function prepareScormPackage() {
      try {
        setIsLoading(true)
        setExtractionError(null)
        const response = await fetch(`/learning-content/${lessonId}/launch`, { cache: 'no-store' })
        const data = await response.json()
        if (!response.ok || typeof data.launchPath !== 'string') {
          throw new Error(data.error || 'Failed to prepare SCORM package')
        }
        const launchPath = data.launchPath.split('/').map(encodeURIComponent).join('/')
        if (!cancelled) setExtractedUrl(`/learning-content/${lessonId}/asset/${launchPath}`)
      } catch (error) {
        console.error('Error extracting SCORM package:', error)
        if (!cancelled) {
          setExtractionError(error instanceof Error ? error.message : 'Failed to extract SCORM package')
          setIsLoading(false)
        }
      }
    }

    void prepareScormPackage()

    return () => {
      cancelled = true
    }
  }, [packagePath, lessonId])

  useEffect(() => {
    // Load existing progress
    loadProgress()
  }, [lessonId, userId])

  async function loadProgress() {
    try {
      const response = await fetch(`/learning-progress/scorm?lessonId=${lessonId}&userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.progress) {
          try {
            const stored = typeof data.progress.cmiData === 'string'
              ? JSON.parse(data.progress.cmiData)
              : data.progress.cmiData
            if (stored && typeof stored === 'object' && !Array.isArray(stored)) {
              cmiDataRef.current = Object.fromEntries(
                Object.entries(stored).flatMap(([key, value]) =>
                  typeof value === 'string' || typeof value === 'number'
                    ? [[key, String(value)]]
                    : []
                )
              )
            }
          } catch {
            // Older SCORM records may contain malformed legacy CMI JSON.
            cmiDataRef.current = {}
          }
          cmiDataRef.current['cmi.core.lesson_status'] ||= data.progress.completionStatus || 'incomplete'
          cmiDataRef.current['cmi.core.score.raw'] ||= data.progress.scoreRaw?.toString() || ''
          setProgress(data.progress.scoreRaw || 0)
          setCompletionStatus(data.progress.completionStatus || 'incomplete')
          setScore(data.progress.scoreRaw)
        }
      }
    } catch (error) {
      console.error('Error loading progress:', error)
    }
  }

  async function saveProgress(cmiData: Record<string, string>) {
    try {
      await fetch('/learning-progress/scorm', {
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

      const completion = cmiData['cmi.completion_status'] || cmiData['cmi.core.lesson_status']
      if (completion) {
        setCompletionStatus(completion)
        if (completion === 'completed' || completion === 'passed') {
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
        LMSGetValue: (element: string) => {
          if (element in cmiDataRef.current) return cmiDataRef.current[element]
          if (element === 'cmi.completion_status') return completionStatus
          if (element === 'cmi.score.raw') return score?.toString() || ''
          return ''
        },
        LMSSetValue: (element: string, value: string) => {
          // A SCORM player sets several fields before it commits. Keep the
          // complete CMI snapshot locally, then persist that atomic snapshot
          // on LMSCommit/LMSFinish so concurrent field writes cannot erase a
          // completed status or score.
          cmiDataRef.current[element] = String(value)
          return 'true'
        },
        LMSCommit: () => {
          void saveProgress({ ...cmiDataRef.current })
          return 'true'
        },
        LMSFinish: () => {
          void saveProgress({ ...cmiDataRef.current })
          return 'true'
        },
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

  return (
    <Card className={`flex flex-col ${fullHeight ? 'h-full' : ''} ${isFullscreen ? 'border-0 shadow-none' : ''} ${className}`}>
      {!hideHeader && (
        <CardHeader className="flex-shrink-0 pb-3">
          <CardTitle className="flex items-center justify-between">
            <span className="text-lg">เนื้อหา SCORM</span>
            <div className="flex items-center gap-2">
              {/* Fullscreen Toggle */}
              {onToggleFullscreen && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onToggleFullscreen}
                  className="flex items-center gap-1.5"
                  title={isFullscreen ? 'ออกจากเต็มจอ (กด ESC)' : 'เปิดเต็มจอ'}
                >
                  {isFullscreen ? (
                    <>
                      <Minimize className="w-4 h-4" />
                      <span className="hidden sm:inline">ออกจากเต็มจอ</span>
                    </>
                  ) : (
                    <>
                      <Maximize className="w-4 h-4" />
                      <span className="hidden sm:inline">เต็มจอ</span>
                    </>
                  )}
                </Button>
              )}
              
              {/* Reset Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={resetProgress}
                disabled={isLoading || !extractedUrl}
                className="flex items-center gap-1.5"
                title="รีเซ็ตความคืบหน้า"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">รีเซ็ต</span>
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={`flex flex-col ${fullHeight ? 'flex-1 min-h-0' : ''} ${hideHeader || isFullscreen ? 'p-0' : 'pt-0 space-y-3'}`}>
        {!hideHeader && !isFullscreen && (
          <div className="space-y-2 flex-shrink-0">
            <div className="flex justify-between text-sm text-gray-700">
              <span className="font-medium">ความคืบหน้า:</span>
              <span className={completionStatus === 'completed' ? 'text-green-600 font-semibold' : 'text-blue-600'}>
                {completionStatus === 'completed' ? '✓ เสร็จสมบูรณ์' : 'กำลังเรียน'}
              </span>
            </div>
            {score !== null && (
              <div className="flex justify-between text-sm text-gray-700">
                <span className="font-medium">คะแนน:</span>
                <span className="font-semibold text-blue-600">{score}%</span>
              </div>
            )}
            <Progress value={progress} className="w-full h-2" />
          </div>
        )}

        {/* SCORM Content Frame - Full viewport in fullscreen, flex-based otherwise */}
        <div className={`relative overflow-hidden ${
          isFullscreen 
            ? 'w-full h-full' 
            : fullHeight 
              ? 'flex-1 min-h-0 bg-gray-100 rounded-lg' 
              : 'h-[600px] bg-gray-100 rounded-lg'
        }`}
        style={{
          maxWidth: isFullscreen ? '100vw' : undefined,
          maxHeight: isFullscreen ? '100vh' : undefined
        }}
        >
          {isLoading && !extractionError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">
                  {packagePath.endsWith('.zip') ? 'กำลังแตกไฟล์ SCORM...' : 'กำลังโหลดเนื้อหา SCORM...'}
                </p>
              </div>
            </div>
          )}

          {extractionError && (
            <div className="absolute inset-0 flex items-center justify-center bg-red-50 rounded-lg z-10">
              <div className="text-center p-6">
                <div className="text-red-600 text-lg font-semibold mb-2">ไม่สามารถแตกไฟล์ SCORM ได้</div>
                <p className="text-sm text-red-500">{extractionError}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  ลองใหม่
                </Button>
              </div>
            </div>
          )}

          {extractedUrl && !extractionError && (
            <iframe
              ref={iframeRef}
              src={extractedUrl}
              className={`${
                isFullscreen 
                  ? 'w-screen h-screen rounded-none border-0' 
                  : 'w-full h-full bg-white border-0 rounded-lg'
              }`}
              onLoad={handleIframeLoad}
              title="SCORM Content"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-popups-to-escape-sandbox"
              allowFullScreen
              style={{
                minHeight: fullHeight ? '100%' : '600px',
                maxWidth: isFullscreen ? '100vw' : '100%',
                maxHeight: isFullscreen ? '100vh' : '100%',
                objectFit: isFullscreen ? 'contain' : undefined,
                backgroundColor: isFullscreen ? 'transparent' : undefined
              }}
            />
          )}
        </div>

        {!hideHeader && !isFullscreen && (
          <div className="text-xs text-gray-500 space-y-1 flex-shrink-0 pt-2">
            <p className="flex items-start gap-1.5">
              <span className="text-blue-600 mt-0.5">ℹ️</span>
              <span>เนื้อหา SCORM จะบันทึกความคืบหน้าอัตโนมัติ</span>
            </p>
            <p className="flex items-start gap-1.5">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>ทำกิจกรรมให้ครบทุกส่วนเพื่อทำเครื่องหมายว่าเรียนจบ</span>
            </p>
            {packagePath.endsWith('.zip') && (
              <p className="flex items-start gap-1.5">
                <span className="text-purple-600 mt-0.5">📦</span>
                <span>แตกไฟล์จาก Vercel Blob Storage แล้ว</span>
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
