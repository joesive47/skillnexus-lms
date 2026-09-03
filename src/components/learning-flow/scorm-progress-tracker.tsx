'use client'

import { useEffect, useRef, useState } from 'react'
import { updateScormProgress } from '@/app/actions/learning-progress'

interface ScormProgressTrackerProps {
  nodeId: string
  lessonId: string
  courseId: string
  scormIframeRef: React.RefObject<HTMLIFrameElement>
  onProgressUpdate?: (progress: number) => void
  onComplete?: () => void
}

export function ScormProgressTracker({
  nodeId,
  lessonId,
  courseId,
  scormIframeRef,
  onProgressUpdate,
  onComplete
}: ScormProgressTrackerProps) {
  const [isInitialized, setIsInitialized] = useState(false)
  const cmiDataRef = useRef<Record<string, any>>({})
  const lastSyncRef = useRef<number>(0)
  const SYNC_INTERVAL = 10000 // Sync every 10 seconds

  useEffect(() => {
    const iframe = scormIframeRef.current
    if (!iframe) return

    // Setup SCORM API for the iframe
    const setupScormAPI = () => {
      const scormAPI = {
        LMSInitialize: () => {
          console.log('SCORM: Initialize')
          setIsInitialized(true)
          return 'true'
        },
        
        LMSFinish: () => {
          console.log('SCORM: Finish')
          syncProgressToServer(true)
          return 'true'
        },
        
        LMSGetValue: (element: string) => {
          console.log('SCORM: GetValue', element)
          return cmiDataRef.current[element] || ''
        },
        
        LMSSetValue: (element: string, value: any) => {
          console.log('SCORM: SetValue', element, value)
          cmiDataRef.current[element] = value
          
          // Auto-sync on important events
          if (
            element === 'cmi.core.lesson_status' ||
            element === 'cmi.core.score.raw' ||
            element === 'cmi.completion_status'
          ) {
            const now = Date.now()
            if (now - lastSyncRef.current >= SYNC_INTERVAL) {
              syncProgressToServer()
              lastSyncRef.current = now
            }
          }
          
          return 'true'
        },
        
        LMSCommit: () => {
          console.log('SCORM: Commit')
          syncProgressToServer()
          return 'true'
        },
        
        LMSGetLastError: () => {
          return '0'
        },
        
        LMSGetErrorString: (errorCode: string) => {
          return 'No error'
        },
        
        LMSGetDiagnostic: (errorCode: string) => {
          return 'No diagnostic available'
        }
      }

      // Expose API to iframe (SCORM 1.2)
      ;(window as any).API = scormAPI
      // SCORM 2004
      ;(window as any).API_1484_11 = scormAPI
    }

    const handleLoad = () => {
      setupScormAPI()
    }

    iframe.addEventListener('load', handleLoad)

    return () => {
      iframe.removeEventListener('load', handleLoad)
      // Final sync on unmount
      if (isInitialized) {
        syncProgressToServer(true)
      }
    }
  }, [scormIframeRef])

  const syncProgressToServer = async (isCompleting = false) => {
    try {
      const result = await updateScormProgress({
        lessonId,
        courseId,
        cmiData: cmiDataRef.current
      })

      if (result.success) {
        // Calculate progress based on completion status
        const progressPercent = result.completed ? 100 : 50
        onProgressUpdate?.(progressPercent)

        if (result.completed || isCompleting) {
          onComplete?.()
        }
      }
    } catch (error) {
      console.error('Error syncing SCORM progress:', error)
    }
  }

  // Periodic sync
  useEffect(() => {
    if (!isInitialized) return

    const interval = setInterval(() => {
      syncProgressToServer()
    }, SYNC_INTERVAL)

    return () => clearInterval(interval)
  }, [isInitialized])

  return null // Headless component
}
