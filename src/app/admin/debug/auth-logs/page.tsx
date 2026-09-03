'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, Trash2, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'

interface AuthLog {
  timestamp: string
  level: 'info' | 'warn' | 'error' | 'success'
  step: string
  message: string
  data?: any
  email?: string
}

export default function AuthLogsPage() {
  const [logs, setLogs] = useState<AuthLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(false)

  const fetchLogs = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/debug/auth-logs')
      
      if (!response.ok) {
        throw new Error(`Failed to fetch logs: ${response.statusText}`)
      }

      const data = await response.json()
      setLogs(data.logs || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch logs')
      console.error('Error fetching logs:', err)
    } finally {
      setLoading(false)
    }
  }

  const clearLogs = async () => {
    if (!confirm('คุณแน่ใจว่าต้องการลบ logs ทั้งหมด?')) return

    try {
      const response = await fetch('/api/debug/auth-logs', { method: 'DELETE' })
      
      if (!response.ok) {
        throw new Error('Failed to clear logs')
      }

      setLogs([])
      alert('ลบ logs สำเร็จ')
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการลบ logs')
      console.error('Error clearing logs:', err)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      fetchLogs()
    }, 3000) // Refresh every 3 seconds

    return () => clearInterval(interval)
  }, [autoRefresh])

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case 'warn':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return <Info className="h-4 w-4 text-blue-600" />
    }
  }

  const getLevelBadge = (level: string) => {
    const variants: Record<string, any> = {
      error: 'destructive',
      warn: 'default',
      success: 'default',
      info: 'secondary'
    }
    
    const colors: Record<string, string> = {
      error: 'bg-red-100 text-red-800',
      warn: 'bg-yellow-100 text-yellow-800',
      success: 'bg-green-100 text-green-800',
      info: 'bg-blue-100 text-blue-800'
    }

    return (
      <Badge className={colors[level] || colors.info}>
        {level.toUpperCase()}
      </Badge>
    )
  }

  const getStepColor = (step: string) => {
    if (step.includes('ERROR') || step.includes('FAIL')) return 'text-red-700 bg-red-50'
    if (step.includes('SUCCESS')) return 'text-green-700 bg-green-50'
    if (step.includes('WARNING')) return 'text-yellow-700 bg-yellow-50'
    return 'text-blue-700 bg-blue-50'
  }

  // Group logs by email
  const groupedLogs = logs.reduce((acc, log) => {
    const email = log.email || 'Unknown'
    if (!acc[email]) acc[email] = []
    acc[email].push(log)
    return acc
  }, {} as Record<string, AuthLog[]>)

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">🔍 Auth Debug Logs</h1>
        <p className="text-gray-600">ติดตามและวิเคราะห์ปัญหาการ Login แบบ Real-time</p>
      </div>

      <div className="flex gap-3 mb-6">
        <Button onClick={fetchLogs} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        <Button 
          variant={autoRefresh ? "default" : "outline"}
          onClick={() => setAutoRefresh(!autoRefresh)}
        >
          {autoRefresh ? '⏸️ Stop Auto-Refresh' : '▶️ Auto-Refresh (3s)'}
        </Button>
        <Button variant="destructive" onClick={clearLogs}>
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All Logs
        </Button>
      </div>

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>📊 Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-700">{logs.length}</div>
                <div className="text-sm text-blue-600">Total</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-700">
                  {logs.filter(l => l.level === 'error').length}
                </div>
                <div className="text-sm text-red-600">Errors</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-700">
                  {logs.filter(l => l.level === 'warn').length}
                </div>
                <div className="text-sm text-yellow-600">Warnings</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-700">
                  {logs.filter(l => l.level === 'success').length}
                </div>
                <div className="text-sm text-green-600">Success</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-700">
                  {Object.keys(groupedLogs).length}
                </div>
                <div className="text-sm text-purple-600">Users</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>📝 Recent Logs</CardTitle>
          <CardDescription>
            แสดง {logs.length} รายการล่าสุด (อัพเดทอัตโนมัติ: {autoRefresh ? 'เปิด' : 'ปิด'})
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && logs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">กำลังโหลด...</div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">ไม่มี logs</div>
          ) : (
            <div className="space-y-3">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      {getLevelIcon(log.level)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {getLevelBadge(log.level)}
                          <Badge className={getStepColor(log.step)}>
                            {log.step}
                          </Badge>
                          {log.email && (
                            <Badge variant="outline" className="font-mono text-xs">
                              {log.email}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {log.message}
                        </p>
                        {log.data && Object.keys(log.data).length > 0 && (
                          <details className="mt-2">
                            <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                              📋 Show data
                            </summary>
                            <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                              {JSON.stringify(log.data, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('th-TH')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
