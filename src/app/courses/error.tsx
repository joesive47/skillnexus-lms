'use client'

import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Courses page error:', error)
  }, [error])

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            เกิดข้อผิดพลาด
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              ไม่สามารถโหลดหน้าหลักสูตรได้ในขณะนี้
            </p>
            
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-red-50 p-4 rounded-md">
                <p className="text-sm font-mono text-red-800">
                  Error: {error.message}
                </p>
                {error.digest && (
                  <p className="text-sm font-mono text-red-600 mt-2">
                    Digest: {error.digest}
                  </p>
                )}
              </div>
            )}
            
            <div className="flex gap-2">
              <Button onClick={reset}>
                ลองใหม่
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
                กลับไปแดชบอร์ด
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}