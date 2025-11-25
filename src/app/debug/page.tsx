'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RefreshCw, Home, MessageSquare, AlertTriangle, CheckCircle, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function DebugPage() {
  const [systemStatus, setSystemStatus] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const checkSystemStatus = async () => {
    setLoading(true)
    try {
      // Check API endpoints
      const apiChecks = await Promise.allSettled([
        fetch('/api/chatbot/knowledge-base').then(r => ({ endpoint: 'Knowledge Base', status: r.status, ok: r.ok })),
        fetch('/api/chatbot/documents').then(r => ({ endpoint: 'Documents', status: r.status, ok: r.ok })),
        fetch('/api/chatbot/chat', { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: 'test', sessionId: 'debug' })
        }).then(r => ({ endpoint: 'Chat API', status: r.status, ok: r.ok }))
      ])

      setSystemStatus({
        timestamp: new Date().toLocaleString('th-TH'),
        apis: apiChecks.map(result => 
          result.status === 'fulfilled' ? result.value : { endpoint: 'Unknown', status: 'Error', ok: false }
        ),
        browser: {
          userAgent: navigator.userAgent,
          language: navigator.language,
          cookieEnabled: navigator.cookieEnabled,
          onLine: navigator.onLine
        },
        memory: (performance as any).memory ? {
          used: Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round((performance as any).memory.totalJSHeapSize / 1024 / 1024),
          limit: Math.round((performance as any).memory.jsHeapSizeLimit / 1024 / 1024)
        } : null
      })
    } catch (error) {
      console.error('Debug check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkSystemStatus()
  }, [])

  const clearCache = () => {
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name))
      })
    }
    localStorage.clear()
    sessionStorage.clear()
    alert('แคชถูกล้างแล้ว กรุณารีเฟรชหน้าเว็บ')
  }

  const reloadPage = () => {
    window.location.reload()
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <AlertTriangle className="w-8 h-8 text-orange-500" />
          ระบบตรวจสอบและแก้ไขปัญหา
        </h1>
        <p className="text-gray-600">ตรวจสอบสถานะระบบและแก้ไขปัญหาที่อาจเกิดขึ้น</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              การแก้ไขด่วน
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={reloadPage} className="w-full" variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              รีเฟรชหน้าเว็บ
            </Button>
            <Button onClick={clearCache} className="w-full" variant="outline">
              <Trash2 className="w-4 h-4 mr-2" />
              ล้างแคชเบราว์เซอร์
            </Button>
            <Button onClick={checkSystemStatus} className="w-full" disabled={loading}>
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              ตรวจสอบระบบใหม่
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              นำทางกลับ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard" className="block">
              <Button className="w-full" variant="outline">
                <Home className="w-4 h-4 mr-2" />
                กลับหน้าหลัก Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/chatbot" className="block">
              <Button className="w-full" variant="outline">
                <MessageSquare className="w-4 h-4 mr-2" />
                กลับหน้า Chatbot
              </Button>
            </Link>
            <Link href="/" className="block">
              <Button className="w-full" variant="outline">
                <Home className="w-4 h-4 mr-2" />
                หน้าแรกของเว็บไซต์
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {systemStatus && (
        <Card>
          <CardHeader>
            <CardTitle>สถานะระบบ</CardTitle>
            <p className="text-sm text-gray-500">ตรวจสอบล่าสุด: {systemStatus.timestamp}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">API Endpoints</h3>
                <div className="space-y-2">
                  {systemStatus.apis.map((api: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span>{api.endpoint}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">HTTP {api.status}</span>
                        {api.ok ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">เบราว์เซอร์</h3>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <p><strong>ภาษา:</strong> {systemStatus.browser.language}</p>
                  <p><strong>Cookie:</strong> {systemStatus.browser.cookieEnabled ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}</p>
                  <p><strong>เชื่อมต่ออินเทอร์เน็ต:</strong> {systemStatus.browser.onLine ? 'เชื่อมต่อ' : 'ไม่เชื่อมต่อ'}</p>
                </div>
              </div>

              {systemStatus.memory && (
                <div>
                  <h3 className="font-semibold mb-2">หน่วยความจำ</h3>
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <p><strong>ใช้งาน:</strong> {systemStatus.memory.used} MB</p>
                    <p><strong>รวม:</strong> {systemStatus.memory.total} MB</p>
                    <p><strong>จำกัด:</strong> {systemStatus.memory.limit} MB</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>คำแนะนำการแก้ไขปัญหา</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-blue-50 rounded">
              <strong>ปัญหา: ข้อผิดพลาด "map is not a function"</strong>
              <ul className="mt-2 ml-4 list-disc space-y-1">
                <li>รีเฟรชหน้าเว็บ (F5 หรือ Ctrl+R)</li>
                <li>ล้างแคชเบราว์เซอร์</li>
                <li>ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต</li>
              </ul>
            </div>
            <div className="p-3 bg-green-50 rounded">
              <strong>ปัญหา: โหลดช้า</strong>
              <ul className="mt-2 ml-4 list-disc space-y-1">
                <li>ตรวจสอบความเร็วอินเทอร์เน็ต</li>
                <li>ปิดแท็บอื่นๆ ที่ไม่จำเป็น</li>
                <li>รีสตาร์ทเบราว์เซอร์</li>
              </ul>
            </div>
            <div className="p-3 bg-yellow-50 rounded">
              <strong>ปัญหา: ไม่สามารถส่งข้อความได้</strong>
              <ul className="mt-2 ml-4 list-disc space-y-1">
                <li>ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต</li>
                <li>ลองส่งข้อความใหม่อีกครั้ง</li>
                <li>รีเฟรชหน้าเว็บ</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}