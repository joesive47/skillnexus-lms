'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Zap, Trash2, RefreshCw, Activity, Database, Clock } from 'lucide-react'

interface SystemStats {
  embeddingCacheSize: number
  maxCacheSize: number
  isEmbedderLoaded: boolean
  isEmbedderLoading: boolean
  fastMode: boolean
  similarityThreshold: number
  memoryUsage: {
    heapUsed: number
    heapTotal: number
    external: number
  }
  cacheHitRate: string
}

export function RAGUltraFastMonitor() {
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const fetchStats = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/rag/ultra-fast')
      const data = await response.json()
      
      if (data.success) {
        setStats(data.stats)
        setRecommendations(data.performance.recommendations)
        setLastUpdate(new Date())
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const clearCache = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/rag/ultra-fast', {
        method: 'DELETE'
      })
      
      if (response.ok) {
        await fetchStats()
      }
    } catch (error) {
      console.error('Failed to clear cache:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 10000) // Update every 10 seconds
    return () => clearInterval(interval)
  }, [])

  const formatMemory = (bytes: number) => {
    return `${Math.round(bytes / 1024 / 1024)}MB`
  }

  const getStatusColor = (isLoaded: boolean, isLoading: boolean) => {
    if (isLoading) return 'bg-yellow-500'
    if (isLoaded) return 'bg-green-500'
    return 'bg-red-500'
  }

  const getCacheUsageColor = (usage: number, max: number) => {
    const percentage = (usage / max) * 100
    if (percentage > 80) return 'bg-red-500'
    if (percentage > 60) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Zap className="w-6 h-6 text-yellow-500" />
          <h2 className="text-2xl font-bold">Ultra-Fast RAG Monitor</h2>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={fetchStats}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            รีเฟรช
          </Button>
          <Button
            onClick={clearCache}
            disabled={isLoading}
            variant="destructive"
            size="sm"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            ล้าง Cache
          </Button>
        </div>
      </div>

      {lastUpdate && (
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="w-4 h-4 mr-1" />
          อัปเดตล่าสุด: {lastUpdate.toLocaleTimeString('th-TH')}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Activity className="w-4 h-4 mr-2" />
              สถานะ Model
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div 
                className={`w-3 h-3 rounded-full ${getStatusColor(
                  stats?.isEmbedderLoaded || false, 
                  stats?.isEmbedderLoading || false
                )}`}
              />
              <span className="text-sm">
                {stats?.isEmbedderLoading ? 'กำลังโหลด...' :
                 stats?.isEmbedderLoaded ? 'พร้อมใช้งาน' : 'ยังไม่โหลด'}
              </span>
            </div>
            {stats?.fastMode && (
              <Badge variant="secondary" className="mt-2">
                <Zap className="w-3 h-3 mr-1" />
                Ultra-Fast Mode
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Database className="w-4 h-4 mr-2" />
              Cache Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>ใช้งาน:</span>
                <span>{stats?.embeddingCacheSize || 0}/{stats?.maxCacheSize || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    getCacheUsageColor(
                      stats?.embeddingCacheSize || 0, 
                      stats?.maxCacheSize || 1
                    )
                  }`}
                  style={{
                    width: `${Math.min(
                      ((stats?.embeddingCacheSize || 0) / (stats?.maxCacheSize || 1)) * 100,
                      100
                    )}%`
                  }}
                />
              </div>
              <div className="text-xs text-gray-500">
                Hit Rate: {stats?.cacheHitRate || '0%'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Heap Used:</span>
                <span>{formatMemory(stats?.memoryUsage.heapUsed || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Heap Total:</span>
                <span>{formatMemory(stats?.memoryUsage.heapTotal || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>External:</span>
                <span>{formatMemory(stats?.memoryUsage.external || 0)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Similarity:</span>
                <span>{stats?.similarityThreshold || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Fast Mode:</span>
                <span>{stats?.fastMode ? '✅' : '❌'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">คำแนะนำประสิทธิภาพ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recommendations.map((rec, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <span className="text-sm">{rec}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}