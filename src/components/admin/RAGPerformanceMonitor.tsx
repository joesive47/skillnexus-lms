'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  RefreshCw, 
  Trash2, 
  Database, 
  Zap, 
  AlertTriangle,
  CheckCircle,
  Clock,
  HardDrive
} from 'lucide-react'

interface PerformanceStats {
  system: {
    embeddingCacheSize: number
    isEmbedderLoaded: boolean
    isEmbedderLoading: boolean
    memoryUsage: {
      heapUsed: number
      heapTotal: number
      external: number
    }
    queueSize: number
  }
  database: {
    totalDocuments: number
    totalChunks: number
    processingDocuments: number
    avgChunksPerDocument: number
  }
  performance: {
    cacheHitRate: string
    recommendedActions: string[]
  }
}

export default function RAGPerformanceMonitor() {
  const [stats, setStats] = useState<PerformanceStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchStats = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/rag/performance')
      const data = await response.json()
      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const performAction = async (action: string) => {
    setActionLoading(action)
    try {
      const response = await fetch('/api/rag/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })
      
      const data = await response.json()
      if (data.success) {
        await fetchStats() // รีเฟรชข้อมูล
      }
    } catch (error) {
      console.error('Error performing action:', error)
    } finally {
      setActionLoading(null)
    }
  }

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 30000) // อัปเดตทุก 30 วินาที
    return () => clearInterval(interval)
  }, [])

  if (!stats) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="animate-spin mr-2" />
            กำลังโหลดข้อมูลประสิทธิภาพ...
          </div>
        </CardContent>
      </Card>
    )
  }

  const memoryUsagePercent = (stats.system.memoryUsage.heapUsed / stats.system.memoryUsage.heapTotal) * 100
  const cacheUsagePercent = (stats.system.embeddingCacheSize / 1000) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">RAG System Performance</h2>
        <Button 
          onClick={fetchStats} 
          disabled={loading}
          variant="outline"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          รีเฟรช
        </Button>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">AI Model Status</p>
                <div className="flex items-center space-x-2">
                  {stats.system.isEmbedderLoaded ? (
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Ready
                    </Badge>
                  ) : stats.system.isEmbedderLoading ? (
                    <Badge variant="secondary">
                      <Clock className="w-3 h-3 mr-1" />
                      Loading
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Not Loaded
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <HardDrive className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Memory Usage</p>
                <p className="text-lg font-semibold">
                  {Math.round(stats.system.memoryUsage.heapUsed / 1024 / 1024)}MB
                </p>
                <Progress value={memoryUsagePercent} className="h-2 mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Database className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Cache Size</p>
                <p className="text-lg font-semibold">{stats.system.embeddingCacheSize}</p>
                <Progress value={cacheUsagePercent} className="h-2 mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Processing Queue</p>
                <p className="text-lg font-semibold">{stats.database.processingDocuments}</p>
                {stats.database.processingDocuments > 0 && (
                  <Badge variant="secondary" className="mt-1">
                    {stats.database.processingDocuments} รอประมวลผล
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Database Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Database Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.database.totalDocuments}</p>
              <p className="text-sm text-gray-600">เอกสารทั้งหมด</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.database.totalChunks}</p>
              <p className="text-sm text-gray-600">Chunks ทั้งหมด</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{stats.database.avgChunksPerDocument}</p>
              <p className="text-sm text-gray-600">Chunks เฉลี่ย/เอกสาร</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{stats.performance.cacheHitRate}</p>
              <p className="text-sm text-gray-600">Cache Hit Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            คำแนะนำ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats.performance.recommendedActions.map((action, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-sm">{action}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>การจัดการระบบ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => performAction('clearCache')}
              disabled={actionLoading === 'clearCache'}
              variant="outline"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {actionLoading === 'clearCache' ? 'กำลังล้าง...' : 'ล้าง Cache'}
            </Button>

            <Button
              onClick={() => performAction('cleanupFailedDocuments')}
              disabled={actionLoading === 'cleanupFailedDocuments'}
              variant="outline"
            >
              <Database className="w-4 h-4 mr-2" />
              {actionLoading === 'cleanupFailedDocuments' ? 'กำลังทำความสะอาด...' : 'ลบเอกสารที่ล้มเหลว'}
            </Button>

            <Button
              onClick={() => performAction('optimizeDatabase')}
              disabled={actionLoading === 'optimizeDatabase'}
              variant="outline"
            >
              <Zap className="w-4 h-4 mr-2" />
              {actionLoading === 'optimizeDatabase' ? 'กำลังปรับปรุง...' : 'ปรับปรุงฐานข้อมูล'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}