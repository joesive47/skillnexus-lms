'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, BookOpen, Video, FileQuestion, Package } from 'lucide-react'
import Link from 'next/link'
import { deleteLesson } from '@/app/actions/lesson'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface LessonListItemProps {
  lesson: any
  index: number
  courseId: string
}

export function LessonListItem({ lesson, index, courseId }: LessonListItemProps) {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const getLessonIcon = () => {
    if (lesson.scormPackage) return <Package className="w-4 h-4" />
    if (lesson.quiz) return <FileQuestion className="w-4 h-4" />
    if (lesson.youtubeUrl) return <Video className="w-4 h-4" />
    return <BookOpen className="w-4 h-4" />
  }

  const getLessonType = () => {
    if (lesson.scormPackage) return 'SCORM'
    if (lesson.quiz) return 'Quiz'
    if (lesson.youtubeUrl) return 'Video'
    return 'Content'
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const result = await deleteLesson(lesson.id)
      
      if (result.success) {
        toast.success('ลบบทเรียนสำเร็จ')
        router.refresh()
        setShowDeleteDialog(false)
      } else {
        toast.error(result.error || 'ไม่สามารถลบบทเรียนได้')
      }
    } catch (error) {
      console.error('Error deleting lesson:', error)
      toast.error('เกิดข้อผิดพลาดในการลบบทเรียน')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold">
            {index + 1}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {getLessonIcon()}
              <h4 className="font-semibold">{lesson.title || 'Untitled Lesson'}</h4>
            </div>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge variant="outline">{getLessonType()}</Badge>
              {lesson.duration && (
                <span className="text-sm text-gray-500">{lesson.duration} นาที</span>
              )}
            </div>
            {/* Show All Lesson Details */}
            <div className="mt-2 space-y-2">
              {/* Video URL */}
              {lesson.youtubeUrl && (
                <div className="p-2 bg-blue-50 rounded text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-600">Video URL:</span>
                    <a 
                      href={lesson.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline truncate max-w-md"
                    >
                      {lesson.youtubeUrl}
                    </a>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2"
                      onClick={() => {
                        navigator.clipboard.writeText(lesson.youtubeUrl || '')
                        toast.success('คัดลอก URL แล้ว')
                      }}
                    >
                      คัดลอก
                    </Button>
                  </div>
                </div>
              )}
              
              {/* SCORM Package */}
              {lesson.scormPackage && (
                <div className="p-2 bg-purple-50 rounded text-xs">
                  <div className="font-medium text-gray-600 mb-1">SCORM Package:</div>
                  <div className="space-y-1 text-gray-700">
                    <div>• เวอร์ชัน: {lesson.scormPackage.version}</div>
                    <div>• Path: {lesson.scormPackage.packagePath}</div>
                    {lesson.scormPackage.title && (
                      <div>• ชื่อ: {lesson.scormPackage.title}</div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Quiz */}
              {lesson.quiz && (
                <div className="p-2 bg-green-50 rounded text-xs">
                  <div className="font-medium text-gray-600 mb-1">Quiz:</div>
                  <div className="space-y-1 text-gray-700">
                    <div>• ชื่อ: {lesson.quiz.title}</div>
                    <div>• เวลา: {lesson.quiz.timeLimit || 'ไม่จำกัด'} นาที</div>
                    <div>• สุ่มคำถาม: {lesson.quiz.randomize ? 'ใช่' : 'ไม่'}</div>
                  </div>
                </div>
              )}
              
              {/* Content */}
              {lesson.content && (
                <div className="p-2 bg-yellow-50 rounded text-xs">
                  <span className="font-medium text-gray-600">เนื้อหา:</span>
                  <div className="text-gray-700 mt-1 max-h-20 overflow-y-auto">
                    {lesson.content.substring(0, 200)}{lesson.content.length > 200 ? '...' : ''}
                  </div>
                </div>
              )}
              
              {/* Metadata */}
              <div className="p-2 bg-gray-50 rounded text-xs text-gray-500">
                <div className="flex gap-4">
                  <span>ID: {lesson.id}</span>
                  <span>Order: {lesson.order}</span>
                  <span>สร้าง: {new Date(lesson.createdAt).toLocaleDateString('th-TH')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/admin/courses/${courseId}/lessons/${lesson.id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              แก้ไข
            </Button>
          </Link>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
            disabled={isDeleting}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการลบบทเรียน</AlertDialogTitle>
            <AlertDialogDescription>
              คุณแน่ใจหรือไม่ที่จะลบบทเรียน &quot;{lesson.title || 'Untitled Lesson'}&quot;?
              <br />
              <br />
              การกระทำนี้ไม่สามารถย้อนกลับได้ และจะลบข้อมูลทั้งหมดที่เกี่ยวข้องกับบทเรียนนี้
              {lesson.scormPackage && ' รวมถึง SCORM Package'}
              {lesson.quiz && ' และ Quiz'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'กำลังลบ...' : 'ลบบทเรียน'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
