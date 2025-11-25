'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[ERROR]', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-red-600">⚠️ เกิดข้อผิดพลาด</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600">
            <p><strong>ข้อผิดพลาด:</strong></p>
            <p className="font-mono bg-gray-100 p-2 rounded text-xs break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="mt-2">
                <strong>Digest:</strong> {error.digest}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Button onClick={reset} className="w-full">
              🔄 ลองใหม่
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.location.href = '/debug'}
            >
              🔧 ไปหน้า Debug
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.location.href = '/'}
            >
              🏠 กลับหน้าหลัก
            </Button>
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p><strong>วิธีแก้ไขปัญหา:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>ตรวจสอบการเชื่อมต่อฐานข้อมูล</li>
              <li>รีเซตระบบที่หน้า /debug</li>
              <li>ตรวจสอบ console สำหรับข้อมูลเพิ่มเติม</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}