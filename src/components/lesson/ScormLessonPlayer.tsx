'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ScormPlayer from '@/components/scorm/ScormPlayer'
import ScormUploader from '@/components/scorm/ScormUploader'
import { FileText, Upload, Play } from 'lucide-react'

interface ScormLessonPlayerProps {
  lessonId: string
  isTeacher?: boolean
  onComplete?: () => void
}

export default function ScormLessonPlayer({ 
  lessonId, 
  isTeacher = false, 
  onComplete 
}: ScormLessonPlayerProps) {
  const [hasScormPackage, setHasScormPackage] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkScormPackage()
  }, [lessonId])

  const checkScormPackage = async () => {
    try {
      const response = await fetch(`/api/scorm/player?lessonId=${lessonId}`)
      setHasScormPackage(response.ok)
    } catch (error) {
      setHasScormPackage(false)
    } finally {
      setLoading(false)
    }
  }

  const handleUploadComplete = () => {
    setHasScormPackage(true)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-pulse">Loading SCORM content...</div>
        </CardContent>
      </Card>
    )
  }

  if (!hasScormPackage && !isTeacher) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No SCORM Content Available</h3>
          <p className="text-gray-600">
            This lesson does not have SCORM content yet.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!hasScormPackage && isTeacher) {
    return (
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload" className="flex items-center space-x-2">
            <Upload className="h-4 w-4" />
            <span>Upload SCORM</span>
          </TabsTrigger>
          <TabsTrigger value="preview" disabled>
            <Play className="h-4 w-4" />
            <span>Preview</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload">
          <ScormUploader 
            lessonId={lessonId} 
            onUploadComplete={handleUploadComplete}
          />
        </TabsContent>
      </Tabs>
    )
  }

  return (
    <Tabs defaultValue="player" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="player" className="flex items-center space-x-2">
          <Play className="h-4 w-4" />
          <span>Play SCORM</span>
        </TabsTrigger>
        {isTeacher && (
          <TabsTrigger value="upload" className="flex items-center space-x-2">
            <Upload className="h-4 w-4" />
            <span>Update SCORM</span>
          </TabsTrigger>
        )}
      </TabsList>
      
      <TabsContent value="player">
        <ScormPlayer 
          lessonId={lessonId} 
          onComplete={onComplete}
        />
      </TabsContent>
      
      {isTeacher && (
        <TabsContent value="upload">
          <ScormUploader 
            lessonId={lessonId} 
            onUploadComplete={handleUploadComplete}
          />
        </TabsContent>
      )}
    </Tabs>
  )
}