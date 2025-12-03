'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Award, CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function TestBARDCertificationPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const testCertificateGeneration = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/bard-certificates/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'test-user-id',
          courseId: 'test-course-id'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate certificate')
      }

      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">ทดสอบระบบ BARD Certification</h1>
        <p className="text-muted-foreground mt-1">
          ทดสอบการสร้างและตรวจสอบใบรับรอง BARD
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            ทดสอบการสร้างใบรับรอง
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={testCertificateGeneration}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  กำลังสร้าง...
                </>
              ) : (
                <>
                  <Award className="w-4 h-4 mr-2" />
                  สร้างใบรับรองทดสอบ
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-medium text-red-900">เกิดข้อผิดพลาด</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {result && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3 mb-4">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-900">สร้างใบรับรองสำเร็จ!</p>
                  <p className="text-sm text-green-700 mt-1">
                    ระบบ BARD Certification ทำงานได้ปกติ
                  </p>
                </div>
              </div>

              <div className="space-y-3 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">เลขที่ใบรับรอง</p>
                    <code className="text-sm bg-white px-2 py-1 rounded border">
                      {result.certificate?.certificateNumber}
                    </code>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">สถานะ</p>
                    <Badge variant="default" className="mt-1">
                      {result.certificate?.status}
                    </Badge>
                  </div>
                </div>

                {result.certificate?.bardData && (
                  <div className="mt-4 p-3 bg-white rounded border">
                    <p className="text-sm font-medium mb-2">BARD Data:</p>
                    <pre className="text-xs overflow-auto">
                      {JSON.stringify(JSON.parse(result.certificate.bardData), null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ข้อมูลระบบ BARD</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-900 font-medium">Behavioral</p>
              <p className="text-xs text-blue-700 mt-1">พฤติกรรมและทัศนคติ</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-900 font-medium">Aptitude</p>
              <p className="text-xs text-green-700 mt-1">ความสามารถพื้นฐาน</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-900 font-medium">Role-specific</p>
              <p className="text-xs text-purple-700 mt-1">ทักษะเฉพาะตำแหน่ง</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-orange-900 font-medium">Development</p>
              <p className="text-xs text-orange-700 mt-1">การพัฒนาตนเอง</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
