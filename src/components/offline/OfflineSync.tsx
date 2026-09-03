'use client'

import { useState, useEffect } from 'react'
import { Download, Wifi, WifiOff, CheckCircle, Clock, AlertCircle } from 'lucide-react'

interface OfflineContent {
  id: string
  title: string
  type: 'video' | 'audio' | 'document'
  size: string
  downloadProgress: number
  status: 'pending' | 'downloading' | 'completed' | 'error'
  lastSync: string
}

export default function OfflineSync() {
  const [isOnline, setIsOnline] = useState(true)
  const [offlineContent, setOfflineContent] = useState<OfflineContent[]>([
    {
      id: '1',
      title: 'React Hooks Complete Guide',
      type: 'video',
      size: '250 MB',
      downloadProgress: 100,
      status: 'completed',
      lastSync: '2 hours ago'
    },
    {
      id: '2',
      title: 'JavaScript Audio Course',
      type: 'audio',
      size: '45 MB',
      downloadProgress: 75,
      status: 'downloading',
      lastSync: 'Now'
    }
  ])

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const downloadContent = (id: string) => {
    setOfflineContent(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, status: 'downloading', downloadProgress: 0 }
          : item
      )
    )

    // Simulate download progress
    const interval = setInterval(() => {
      setOfflineContent(prev => 
        prev.map(item => {
          if (item.id === id && item.status === 'downloading') {
            const newProgress = Math.min(item.downloadProgress + 10, 100)
            return {
              ...item,
              downloadProgress: newProgress,
              status: newProgress === 100 ? 'completed' : 'downloading',
              lastSync: newProgress === 100 ? 'Just now' : 'Now'
            }
          }
          return item
        })
      )
    }, 500)

    setTimeout(() => clearInterval(interval), 5000)
  }

  const syncOfflineData = async () => {
    if (!isOnline) return

    // Simulate sync process
    console.log('Syncing offline data...')
    
    // Update last sync times
    setOfflineContent(prev => 
      prev.map(item => ({ ...item, lastSync: 'Just now' }))
    )
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">🔄 Offline Learning</h2>
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
          isOnline ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
          <span className="text-sm font-semibold">
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Sync Button */}
      {isOnline && (
        <button
          onClick={syncOfflineData}
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold mb-6 transition-colors"
        >
          Sync All Data
        </button>
      )}

      {/* Offline Content List */}
      <div className="space-y-4">
        {offlineContent.map((item) => (
          <div key={item.id} className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span className="capitalize">{item.type}</span>
                  <span>{item.size}</span>
                  <span>Last sync: {item.lastSync}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {item.status === 'completed' && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                {item.status === 'downloading' && (
                  <Clock className="w-5 h-5 text-blue-500 animate-spin" />
                )}
                {item.status === 'error' && (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
                
                {item.status === 'pending' && (
                  <button
                    onClick={() => downloadContent(item.id)}
                    className="bg-green-600 hover:bg-green-700 p-2 rounded-full transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            {(item.status === 'downloading' || item.status === 'completed') && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Download Progress</span>
                  <span>{item.downloadProgress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      item.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${item.downloadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Storage Info */}
      <div className="mt-6 p-4 bg-gray-800 rounded-lg">
        <h3 className="font-semibold mb-2">📱 Storage Usage</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Downloaded Content:</span>
            <span>295 MB</span>
          </div>
          <div className="flex justify-between">
            <span>Available Space:</span>
            <span>2.1 GB</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div className="bg-purple-500 h-2 rounded-full" style={{ width: '12%' }} />
          </div>
        </div>
      </div>

      {/* Offline Notice */}
      {!isOnline && (
        <div className="mt-4 p-4 bg-yellow-900/50 border border-yellow-500 rounded-lg">
          <div className="flex items-center space-x-2 text-yellow-300">
            <WifiOff className="w-5 h-5" />
            <span className="font-semibold">You're offline</span>
          </div>
          <p className="text-yellow-200 text-sm mt-1">
            You can still access downloaded content. Connect to sync your progress.
          </p>
        </div>
      )}
    </div>
  )
}