import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertCircle, Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <AlertCircle className="mx-auto h-16 w-16 text-red-500" />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          ไม่พบคอร์สนี้
        </h2>
        <p className="text-gray-600 mb-8">
          ขอโทษครับ คอร์สที่คุณกำลังมองหาอาจถูกลบหรือไม่มีอยู่ในระบบ
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="default">
            <Link href="/dashboard/admin/courses">
              <ArrowLeft className="mr-2 h-4 w-4" />
              กลับไปหน้าคอร์ส
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/admin">
              <Home className="mr-2 h-4 w-4" />
              หน้าแดชบอร์ด
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
