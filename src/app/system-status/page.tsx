'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RefreshCw, 
  Database, 
  Globe, 
  HardDrive,
  Cpu,
  Wifi,
  Clock
} from 'lucide-react'

interface SystemStatus {
  timestamp: string
  database: {
    status: 'online' | 'offline' | 'error'
    users: number
    courses: number
    lessons: number
    responseTime: number
  }
  api: {
    auth: 'ok' | 'error'
    courses: 'ok' | 'error'
    chatbot: 'ok' | 'error'
  }
  browser: {
    language: string
    cookiesEnabled: boolean
    online: boolean
    memory: {
      used: number
      total: number
      limit: number
    }
  }
  performance: {
    loadTime: number
    renderTime: number
  }
}

export default function SystemStatusPage() {
  const [status, setStatus] = useState<SystemStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastCheck, setLastCheck] = useState<Date>(new Date())

  const checkSystemStatus = async () => {
    setLoading(true)
    
    try {
      const startTime = performance.now()
      
      // จำลองการตรวจสอบระบบ
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const endTime = performance.now()
      const loadTime = endTime - startTime
      
      const mockStatus: SystemStatus = {
        timestamp: new Date().toISOString(),
        database: {
          status: 'online',
          users: 156,
          courses: 12,
          lessons: 89,
          responseTime: Math.random() * 100 + 50
        },
        api: {
          auth: 'ok',
          courses: 'ok',
          chatbot: 'ok'
        },
        browser: {
          language: navigator.language,
          cookiesEnabled: navigator.cookieEnabled,
          online: navigator.onLine,
          memory: {
            used: 11,
            total: 13,
            limit: 2144
          }
        },
        performance: {
          loadTime: loadTime,
          renderTime: Math.random() * 50 + 10
        }
      }
      
      setStatus(mockStatus)
      setLastCheck(new Date())
    } catch (error) {
      console.error('Error checking system status:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkSystemStatus()
    
    // ตรวจสอบทุก 30 วินาที
    const interval = setInterval(checkSystemStatus, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
      case 'ok':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'offline':
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
      case 'ok':
        return <Badge variant="default" className="bg-green-500">ปกติ</Badge>
      case 'offline':
      case 'error':
        return <Badge variant="destructive">ข้อผิดพลาด</Badge>
      default:
        return <Badge variant="secondary">ไม่ทราบ</Badge>
    }
  }

  if (loading && !status) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>กำลังตรวจสอบสถานะระบบ...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">สถานะระบบ</h1>
          <p className="text-muted-foreground">
            ตรวจสอบล่าสุด: {lastCheck.toLocaleString('th-TH')}
          </p>
        </div>
        <Button 
          onClick={checkSystemStatus} 
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          ตรวจสอบใหม่
        </Button>
      </div>

      {status && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* API Endpoints */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">API Endpoints</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Knowledge Base</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(status.api.auth)}
                  <span className="text-sm">HTTP 200</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Documents</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(status.api.courses)}
                  <span className="text-sm">HTTP 200</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Chat API</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(status.api.chatbot)}
                  <span className="text-sm">HTTP 200</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Database Status */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ฐานข้อมูล</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">สถานะ</span>
                {getStatusBadge(status.database.status)}
              </div>
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>ผู้ใช้:</span>
                  <span>{status.database.users.toLocaleString()} คน</span>
                </div>
                <div className="flex justify-between">
                  <span>หลักสูตร:</span>
                  <span>{status.database.courses} หลักสูตร</span>
                </div>
                <div className="flex justify-between">
                  <span>บทเรียน:</span>
                  <span>{status.database.lessons} บทเรียน</span>
                </div>
                <div className="flex justify-between">
                  <span>เวลาตอบสนอง:</span>
                  <span>{status.database.responseTime.toFixed(0)}ms</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Browser Info */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">เบราว์เซอร์</CardTitle>
              <Cpu className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>ภาษา:</span>
                  <span>{status.browser.language}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cookie:</span>
                  <span>{status.browser.cookiesEnabled ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}</span>
                </div>
                <div className="flex justify-between">
                  <span>เชื่อมต่ออินเทอร์เน็ต:</span>
                  <div className="flex items-center gap-1">
                    <Wifi className="h-3 w-3" />
                    <span>{status.browser.online ? 'เชื่อมต่อ' : 'ไม่เชื่อมต่อ'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Memory Usage */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">หน่วยความจำ</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>ใช้งาน:</span>
                  <span>{status.browser.memory.used} MB</span>
                </div>
                <div className="flex justify-between">
                  <span>รวม:</span>
                  <span>{status.browser.memory.total} MB</span>
                </div>
                <div className="flex justify-between">
                  <span>จำกัด:</span>
                  <span>{status.browser.memory.limit.toLocaleString()} MB</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ 
                    width: `${(status.browser.memory.used / status.browser.memory.total) * 100}%` 
                  }}
                ></div>
              </div>
            </CardContent>
          </Card>

          {/* Performance */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ประสิทธิภาพ</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>เวลาโหลด:</span>
                  <span>{status.performance.loadTime.toFixed(0)}ms</span>
                </div>
                <div className="flex justify-between">
                  <span>เวลาแสดงผล:</span>
                  <span>{status.performance.renderTime.toFixed(0)}ms</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">การแก้ไขด่วน</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                รีเฟรชหน้าเว็บ
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => {
                  if ('caches' in window) {
                    caches.keys().then(names => {
                      names.forEach(name => caches.delete(name))
                    })
                  }
                }}
              >
                <HardDrive className="h-4 w-4 mr-2" />
                ล้างแคชเบราว์เซอร์
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={checkSystemStatus}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                ตรวจสอบระบบใหม่
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Troubleshooting Guide */}
      <Card>
        <CardHeader>
          <CardTitle>คำแนะนำการแก้ไขปัญหา</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">ปัญหา: ข้อผิดพลาด "map is not a function"</h4>
            <ul className="list-disc list-inside text-sm space-y-1 ml-4">
              <li>รีเฟรชหน้าเว็บ (F5 หรือ Ctrl+R)</li>
              <li>ล้างแคชเบราว์เซอร์</li>
              <li>ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต</li>
            </ul>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="font-semibold mb-2">ปัญหา: โหลดช้า</h4>
            <ul className="list-disc list-inside text-sm space-y-1 ml-4">
              <li>ตรวจสอบความเร็วอินเทอร์เน็ต</li>
              <li>ปิดแท็บอื่นๆ ที่ไม่จำเป็น</li>
              <li>รีสตาร์ทเบราว์เซอร์</li>
            </ul>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="font-semibold mb-2">ปัญหา: ไม่สามารถส่งข้อความได้</h4>
            <ul className="list-disc list-inside text-sm space-y-1 ml-4">
              <li>ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต</li>
              <li>ลองส่งข้อความใหม่อีกครั้ง</li>
              <li>รีเฟรชหน้าเว็บ</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card>
        <CardHeader>
          <CardTitle>นำทางกลับ</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => window.history.back()}>
            กลับหน้าหลัก Dashboard
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/test-chatbot'}>
            กลับหน้า Chatbot
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            หน้าแรกของเว็บไซต์
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}