'use client'

import { useState, useEffect, useRef } from 'react'
import JSZip from 'jszip'
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
  const blobUrlsRef = useRef<string[]>([])

  // Extract ZIP if packagePath is a .zip file
  useEffect(() => {
    const isZipFile = packagePath.endsWith('.zip')
    
    if (!isZipFile) {
      // Direct URL to SCORM content (traditional hosting)
      setExtractedUrl(packagePath)
      setIsLoading(false)
      return
    }

    // Extract ZIP from Vercel Blob Storage
    async function extractScormPackage() {
      try {
        setIsLoading(true)
        setExtractionError(null)

        // Download ZIP file
        const response = await fetch(packagePath)
        if (!response.ok) throw new Error('Failed to download SCORM package')
        
        const arrayBuffer = await response.arrayBuffer()
        const zip = await JSZip.loadAsync(arrayBuffer)

        // Find imsmanifest.xml to get launch file
        const manifestFile = zip.file('imsmanifest.xml')
        let launchFile = 'index.html' // default

        if (manifestFile) {
          const manifestContent = await manifestFile.async('string')
          const parser = new DOMParser()
          const xmlDoc = parser.parseFromString(manifestContent, 'text/xml')
          const resourceElement = xmlDoc.querySelector('resource[href]')
          if (resourceElement) {
            launchFile = resourceElement.getAttribute('href') || 'index.html'
          }
        }

        // Extract all files and create blob URLs
        const fileMap = new Map<string, string>()
        const promises: Promise<void>[] = []

        zip.forEach((relativePath, file) => {
          if (!file.dir) {
            const promise = file.async('blob').then((blob) => {
              // Determine MIME type
              let mimeType = 'application/octet-stream'
              if (relativePath.endsWith('.html')) mimeType = 'text/html'
              else if (relativePath.endsWith('.js')) mimeType = 'text/javascript'
              else if (relativePath.endsWith('.css')) mimeType = 'text/css'
              else if (relativePath.endsWith('.json')) mimeType = 'application/json'
              else if (relativePath.endsWith('.xml')) mimeType = 'application/xml'
              else if (relativePath.endsWith('.png')) mimeType = 'image/png'
              else if (relativePath.endsWith('.jpg') || relativePath.endsWith('.jpeg')) mimeType = 'image/jpeg'
              else if (relativePath.endsWith('.gif')) mimeType = 'image/gif'
              else if (relativePath.endsWith('.svg')) mimeType = 'image/svg+xml'

              const blobWithType = new Blob([blob], { type: mimeType })
              const url = URL.createObjectURL(blobWithType)
              fileMap.set(relativePath, url)
              blobUrlsRef.current.push(url)
            })
            promises.push(promise)
          }
        })

        await Promise.all(promises)

        // Get launch URL
        const launchUrl = fileMap.get(launchFile)
        if (!launchUrl) {
          throw new Error(`Launch file not found: ${launchFile}`)
        }

        // Inject base tag to handle relative URLs
        const htmlBlob = await fetch(launchUrl).then(r => r.blob())
        const htmlText = await htmlBlob.text()
        
        // Create modified HTML with base tag and file map
        const modifiedHtml = htmlText.replace(
          /<head>/i,
          `<head>
          <script>
            // Map relative URLs to blob URLs
            const fileMap = ${JSON.stringify(Object.fromEntries(fileMap))};
            
            // Override fetch to use blob URLs
            const originalFetch = window.fetch;
            window.fetch = function(url, options) {
              if (typeof url === 'string' && fileMap[url]) {
                return originalFetch(fileMap[url], options);
              }
              return originalFetch(url, options);
            };

            // Override XMLHttpRequest
            const OriginalXHR = window.XMLHttpRequest;
            window.XMLHttpRequest = function() {
              const xhr = new OriginalXHR();
              const originalOpen = xhr.open;
              xhr.open = function(method, url, ...args) {
                if (typeof url === 'string' && fileMap[url]) {
                  url = fileMap[url];
                }
                return originalOpen.call(this, method, url, ...args);
              };
              return xhr;
            };
          </script>`
        )

        const modifiedBlob = new Blob([modifiedHtml], { type: 'text/html' })
        const modifiedUrl = URL.createObjectURL(modifiedBlob)
        blobUrlsRef.current.push(modifiedUrl)

        setExtractedUrl(modifiedUrl)
        setIsLoading(false)
      } catch (error) {
        console.error('Error extracting SCORM package:', error)
        setExtractionError(error instanceof Error ? error.message : 'Failed to extract SCORM package')
        setIsLoading(false)
      }
    }

    extractScormPackage()

    // Cleanup blob URLs on unmount
    return () => {
      blobUrlsRef.current.forEach(url => URL.revokeObjectURL(url))
      blobUrlsRef.current = []
    }
  }, [packagePath])

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

        {/* SCORM Content Frame - Flex-based, no fixed height, no scroll overlap */}
        <div className={`relative overflow-hidden ${
          isFullscreen 
            ? 'flex-1 min-h-0' 
            : fullHeight 
              ? 'flex-1 min-h-0 bg-gray-100 rounded-lg' 
              : 'h-[600px] bg-gray-100 rounded-lg'
        }`}>
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
              className={`w-full h-full ${
                isFullscreen ? 'rounded-none border-0' : 'bg-white border-0 rounded-lg'
              }`}
              onLoad={handleIframeLoad}
              title="SCORM Content"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-popups-to-escape-sandbox"
              allowFullScreen
              style={{ minHeight: fullHeight ? '100%' : '600px' }}
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