'use client'

import { deleteCourseAction } from '@/app/actions/course'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'

interface DeleteCourseFormProps {
  courseId: string
  courseTitle: string
}

function DeleteButton() {
  const { pending } = useFormStatus()
  
  return (
    <Button 
      type="submit"
      variant="outline" 
      size="sm"
      disabled={pending}
      className="text-red-600 hover:text-red-700 hover:bg-red-50"
    >
      <Trash2 className="w-4 h-4 mr-1" />
      {pending ? 'Deleting...' : 'Delete'}
    </Button>
  )
}

export function DeleteCourseForm({ courseId, courseTitle }: DeleteCourseFormProps) {
  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    const result = await deleteCourseAction(formData)
    if (result.success) {
      router.refresh()
    } else {
      alert(result.error || 'Failed to delete course')
    }
  }

  const handleClick = () => {
    if (confirm(`Are you sure you want to delete "${courseTitle}"? This action cannot be undone and will remove all associated lessons and enrollments.`)) {
      const form = document.getElementById(`delete-form-${courseId}`) as HTMLFormElement
      if (form) {
        form.requestSubmit()
      }
    }
  }

  return (
    <>
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleClick}
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <Trash2 className="w-4 h-4 mr-1" />
        Delete
      </Button>
      <form id={`delete-form-${courseId}`} action={handleSubmit} className="hidden">
        <input type="hidden" name="courseId" value={courseId} />
        <DeleteButton />
      </form>
    </>
  )
}