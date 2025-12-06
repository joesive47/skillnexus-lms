'use client'

import { useState } from 'react'
import { deleteCourse } from '@/app/actions/course'
import { forceDeleteFileAction } from '@/app/actions/file'
import { Button } from '@/components/ui/button'
import { Trash2, AlertTriangle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface DeleteCourseButtonProps {
  courseId: string
  courseTitle: string
  imageUrl?: string
  forceDelete?: boolean
}

export function DeleteCourseButton({ courseId, courseTitle, imageUrl, forceDelete = false }: DeleteCourseButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { data: session, status } = useSession()

  async function handleDelete() {
    if (status === 'loading') {
      alert('Please wait for authentication to load')
      return
    }

    if (!session) {
      alert('You must be logged in to delete courses')
      router.push('/login')
      return
    }

    if (session.user.role !== 'ADMIN') {
      alert('Only administrators can delete courses')
      return
    }

    const confirmMessage = forceDelete 
      ? `Force delete "${courseTitle}"?\n\nThis will forcefully remove the course and attempt to delete locked files. This action cannot be undone.`
      : `Are you sure you want to delete "${courseTitle}"? This action cannot be undone and will remove all associated lessons and enrollments.`

    if (!confirm(confirmMessage)) {
      return
    }
    
    setLoading(true)
    try {
      // If force delete and has image, try to force delete the image first
      if (forceDelete && imageUrl) {
        try {
          await forceDeleteFileAction(imageUrl)
        } catch (fileError) {
          console.warn('Failed to force delete image:', fileError)
        }
      }

      const result = await deleteCourse(courseId)
      
      if (result.success) {
        alert('Course deleted successfully')
        router.refresh()
      } else {
        alert(result.error || 'Failed to delete course')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('An unexpected error occurred while deleting the course')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <Button 
        variant="outline" 
        size="sm"
        disabled
        className="text-red-600"
      >
        <Trash2 className="w-4 h-4 mr-1" />
        Loading...
      </Button>
    )
  }

  if (!session || session.user.role !== 'ADMIN') {
    return null
  }

  return (
    <Button 
      variant={forceDelete ? "destructive" : "outline"}
      size="sm"
      onClick={handleDelete}
      disabled={loading}
      className={forceDelete ? "" : "text-red-600 hover:text-red-700 hover:bg-red-50"}
    >
      {forceDelete && <AlertTriangle className="w-4 h-4 mr-1" />}
      <Trash2 className="w-4 h-4 mr-1" />
      {loading ? 'Deleting...' : (forceDelete ? 'Force Delete' : 'Delete')}
    </Button>
  )
}