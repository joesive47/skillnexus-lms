'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Upload, 
  Download, 
  Trash2, 
  Play, 
  FileText, 
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import ScormUploader from '@/components/scorm/ScormUploader'

interface ScormPackage {
  id: string
  lessonId: string
  packagePath: string
  title: string
  version: string
  identifier: string
  createdAt: string
  lesson: {
    id: string
    title: string
    order: number
  }
}

interface ScormManagerProps {
  lessonId: string
  lessonTitle: string
  onUpdate?: () => void
}

export default function ScormManager({ lessonId, lessonTitle, onUpdate }: ScormManagerProps) {
  const [scormPackage, setScormPackage] = useState<ScormPackage | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [showUploader, setShowUploader] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadScormPackage()
  }, [lessonId])

  const loadScormPackage = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/scorm/packages/${lessonId}`)
      
      if (response.ok) {
        const data = await response.json()
        setScormPackage(data.package)
      } else if (response.status === 404) {
        setScormPackage(null)
      } else {
        throw new Error('Failed to load SCORM package')
      }
    } catch (error) {
      console.error('Error loading SCORM package:', error)
      toast({
        title: 'Error',
        description: 'Failed to load SCORM package information',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!scormPackage || !confirm('Are you sure you want to delete this SCORM package?')) {
      return
    }

    try {
      setDeleting(true)
      const response = await fetch(`/api/scorm/packages/${scormPackage.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete SCORM package')
      }

      setScormPackage(null)
      setShowUploader(false)
      onUpdate?.()
      
      toast({
        title: 'Success',
        description: 'SCORM package deleted successfully'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete SCORM package',
        variant: 'destructive'
      })
    } finally {
      setDeleting(false)
    }
  }

  const handleUploadComplete = () => {
    loadScormPackage()
    setShowUploader(false)
    onUpdate?.()
  }

  const handleTestPlay = () => {
    if (scormPackage) {
      window.open(`/courses/test/lessons/${lessonId}/scorm`, '_blank')
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading SCORM information...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>SCORM Package - {lessonTitle}</span>
            </div>
            {!scormPackage && !showUploader && (
              <Button onClick={() => setShowUploader(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload SCORM
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {scormPackage ? (
            <div className="space-y-4">
              {/* Package Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-800">SCORM Package Active</span>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    Version {scormPackage.version}
                  </Badge>
                </div>
              </div>

              {/* Package Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Package Title</label>
                  <p className="text-sm">{scormPackage.title || 'Untitled Package'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Identifier</label>
                  <p className="text-sm font-mono">{scormPackage.identifier}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Upload Date</label>
                  <p className="text-sm">{new Date(scormPackage.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Package Path</label>
                  <p className="text-sm font-mono">{scormPackage.packagePath}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-4 border-t">
                <Button onClick={handleTestPlay} variant="outline">
                  <Play className="h-4 w-4 mr-2" />
                  Test Play
                </Button>
                <Button 
                  onClick={() => setShowUploader(true)} 
                  variant="outline"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Replace Package
                </Button>
                <Button 
                  onClick={handleDelete} 
                  variant="destructive"
                  disabled={deleting}
                >
                  {deleting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Delete Package
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="flex items-center justify-center space-x-2 text-amber-600 mb-4">
                <AlertCircle className="h-6 w-6" />
                <span className="font-medium">No SCORM Package</span>
              </div>
              <p className="text-gray-600 mb-4">
                This lesson doesn't have a SCORM package yet. Upload one to enable SCORM content.
              </p>
              {!showUploader && (
                <Button onClick={() => setShowUploader(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload SCORM Package
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* SCORM Uploader */}
      {showUploader && (
        <Card>
          <CardHeader>
            <CardTitle>Upload SCORM Package</CardTitle>
          </CardHeader>
          <CardContent>
            <ScormUploader 
              lessonId={lessonId} 
              onUploadComplete={handleUploadComplete}
            />
            <div className="mt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowUploader(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}