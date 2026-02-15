'use client'

import { useState } from 'react'
import { ScormLockStatus } from './scorm-lock-status'
import { ScormFullscreenWrapper } from './scorm-fullscreen-wrapper'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

interface ScormWithVideoCheckProps {
  packagePath: string
  lessonId: string
  userId: string
  courseId: string
  lessonTitle: string
  courseTitle: string
}

/**
 * Wrapper component that checks video progress before showing SCORM content
 * 
 * Flow:
 * 1. Check if user has watched video to 80% or more
 * 2. If yes: Show SCORM player
 * 3. If no: Show lock status with instructions to watch video
 */
export function ScormWithVideoCheck({
  packagePath,
  lessonId,
  userId,
  courseId,
  lessonTitle,
  courseTitle
}: ScormWithVideoCheckProps) {
  // null = checking, true = unlocked, false = locked
  const [canAccess, setCanAccess] = useState<boolean | null>(null)

  // Step 1: Checking video progress
  if (canAccess === null) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ScormLockStatus
          lessonId={lessonId}
          courseId={courseId}
          onStatusChecked={(status) => setCanAccess(status)}
        />
      </div>
    )
  }

  // Step 2: Video not complete - show lock screen
  if (canAccess === false) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ScormLockStatus
          lessonId={lessonId}
          courseId={courseId}
          onStatusChecked={(status) => setCanAccess(status)}
        />
      </div>
    )
  }

  // Step 3: Video complete - show SCORM player
  return (
    <ScormFullscreenWrapper
      packagePath={packagePath}
      lessonId={lessonId}
      userId={userId}
      courseId={courseId}
      lessonTitle={lessonTitle}
      courseTitle={courseTitle}
    />
  )
}
