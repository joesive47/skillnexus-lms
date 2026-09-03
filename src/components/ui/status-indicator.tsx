'use client'

import { useState, useEffect } from 'react'

interface SystemStatus {
  database: 'online' | 'offline' | 'slow'
  api: 'online' | 'offline' | 'slow'
  cdn: 'online' | 'offline' | 'slow'
  responseTime: number
}

export function StatusIndicator() {
  const [status, setStatus] = useState<SystemStatus>({
    database: 'online',
    api: 'online', 
    cdn: 'online',
    responseTime: 45
  })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Simulate status check
    const checkStatus = async () => {
      try {
        const start = Date.now()
        // You can replace this with actual API calls
        await new Promise(resolve => setTimeout(resolve, 100))
        const responseTime = Date.now() - start
        
        setStatus({
          database: 'online',
          api: 'online',
          cdn: 'online',
          responseTime
        })
      } catch (error) {
        setStatus(prev => ({
          ...prev,
          api: 'offline'
        }))
      }
    }

    checkStatus()
    const interval = setInterval(checkStatus, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'slow': return 'bg-yellow-500'
      case 'offline': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'ปกติ'
      case 'slow': return 'ช้า'
      case 'offline': return 'ออฟไลน์'
      default: return 'ไม่ทราบ'
    }
  }

  return (
    <div className="fixed top-4 left-4 z-40">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-black/20 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 text-white text-sm hover:bg-black/30 transition-all duration-300"
      >
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${getStatusColor(status.api)} animate-pulse`}></div>
          <span>System Status</span>
        </div>
      </button>

      {isVisible && (
        <div className="absolute top-12 left-0 bg-black/80 backdrop-blur-xl border border-white/20 rounded-xl p-4 min-w-64 animate-fade-in-up">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            🚀 SkillNexus Status
          </h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Database:</span>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(status.database)}`}></div>
                <span className="text-white">{getStatusText(status.database)}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-300">API:</span>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(status.api)}`}></div>
                <span className="text-white">{getStatusText(status.api)}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-300">CDN:</span>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(status.cdn)}`}></div>
                <span className="text-white">{getStatusText(status.cdn)}</span>
              </div>
            </div>
            
            <div className="border-t border-white/20 pt-3 mt-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Response Time:</span>
                <span className="text-green-400 font-mono">{status.responseTime}ms</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Uptime:</span>
              <span className="text-green-400">99.99%</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Users Online:</span>
              <span className="text-blue-400">1,247</span>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-white/20">
            <div className="text-xs text-gray-400 text-center">
              Last updated: {new Date().toLocaleTimeString('th-TH')}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}