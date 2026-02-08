'use client'

import { useEffect, useRef, useState } from 'react'
import { updateScormProgress } from '@/app/actions/learning-progress'

interface ScormProgressTrackerProps {
  nodeId: string
  lessonId: string
  scormIframeRef: React.RefObject<HTMLIFrameElement>
  onProgressUpdate?: (progress: number) => void
  onComplete?: () => void
}

export function ScormProgressTracker({
  nodeId,
  lessonId,
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
      const completionStatus = 
        cmiDataRef.current['cmi.completion_status'] || 
        cmiDataRef.current['cmi.core.lesson_status'] || 
        'incomplete'
      
      const successStatus = 
        cmiDataRef.current['cmi.success_status'] || 
        cmiDataRef.current['cmi.core.lesson_status'] || 
        'unknown'
      
      const scoreRaw = 
        parseFloat(cmiDataRef.current['cmi.score.raw'] || 
        cmiDataRef.current['cmi.core.score.raw'] || 
        '0')
      
      const scoreMin = 
        parseFloat(cmiDataRef.current['cmi.score.min'] || 
        cmiDataRef.current['cmi.core.score.min'] || 
        '0')
      
      const scoreMax = 
        parseFloat(cmiDataRef.current['cmi.score.max'] || 
        cmiDataRef.current['cmi.core.score.max'] || 
        '100')
      
      const sessionTime = 
        cmiDataRef.current['cmi.session_time'] || 
        cmiDataRef.current['cmi.core.session_time'] || 
        '0000:00:00'

      const result = await updateScormProgress({
        nodeId,
        lessonId,
        completionStatus,
        successStatus,
        scoreRaw,
        scoreMin,
        scoreMax,
        sessionTime,
        cmiData: cmiDataRef.current
      })

      if (result.success && result.progress) {
        const progressPercent = result.progress.progressPercent || 0
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
