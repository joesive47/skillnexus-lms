import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function CourseEditError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  console.error('[COURSE_EDIT_ERROR]', error)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <AlertTriangle className="mx-auto h-16 w-16 text-yellow-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          เกิดข้อผิดพลาด
        </h1>
        <p className="text-gray-600 mb-8">
          ไม่สามารถโหลดหน้าแก้ไขคอร์สได้ กรุณาลองใหม่อีกครั้ง
        </p>

        {error.digest && (
          <p className="text-sm text-gray-500 mb-6">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset}>
            ลองใหม่อีกครั้ง
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/admin/courses">
              กลับไปหน้าคอร์ส
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
