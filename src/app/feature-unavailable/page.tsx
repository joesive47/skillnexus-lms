import Link from 'next/link'
import { Construction, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function FeatureUnavailablePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
      <div className="w-full max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-2xl mb-6 sm:w-20 sm:h-20">
          <Construction className="w-8 h-8 text-yellow-600 sm:w-10 sm:h-10" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-3 sm:text-2xl">
          ฟีเจอร์นี้ยังไม่พร้อมใช้งาน
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-6 sm:text-base">
          ปิดไว้ชั่วคราวระหว่างปรับปรุงการทำงานและความปลอดภัย
          ข้อมูลจำลองไม่ถูกนำมาแสดงเป็นผลการทำงานจริง
        </p>
        <Button asChild>
          <Link href="/dashboard" className="inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            กลับหน้าหลัก
          </Link>
        </Button>
      </div>
    </main>
  )
}
