'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Download, 
  Smartphone, 
  Wifi, 
  WifiOff, 
  Battery, 
  Signal,
  Home,
  BookOpen,
  User,
  Settings,
  Bell,
  Search,
  Play,
  Pause,
  SkipForward,
  Volume2
} from 'lucide-react'

interface PWAInstallProps {
  onInstall?: () => void
}

export function PWAInstallPrompt({ onInstall }: PWAInstallProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setShowInstallPrompt(false)
        onInstall?.()
      }
      setDeferredPrompt(null)
    }
  }

  if (!showInstallPrompt) return null

  return (
    <Card className="bg-gradient-to-r from-purple-600 to-pink-600 border-0 text-white">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold">ติดตั้งแอป SkillNexus</h3>
              <p className="text-sm opacity-90">เรียนได้ทุกที่ แม้ไม่มีอินเทอร์เน็ต</p>
            </div>
          </div>
          <Button 
            onClick={handleInstall}
            className="bg-white text-purple-600 hover:bg-gray-100"
          >
            <Download className="w-4 h-4 mr-2" />
            ติดตั้ง
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function MobileStatusBar() {
  const [isOnline, setIsOnline] = useState(true)
  const [battery, setBattery] = useState(85)
  const [signal, setSignal] = useState(4)

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

  return (
    <div className="bg-black text-white px-4 py-2 flex items-center justify-between text-sm">
      <div className="flex items-center space-x-2">
        <span className="font-medium">SkillNexus</span>
        {!isOnline && (
          <Badge variant="destructive" className="text-xs">
            <WifiOff className="w-3 h-3 mr-1" />
            Offline
          </Badge>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        {isOnline ? (
          <Wifi className="w-4 h-4" />
        ) : (
          <WifiOff className="w-4 h-4 text-red-400" />
        )}
        <div className="flex">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`w-1 h-3 mx-px rounded-sm ${
                i < signal ? 'bg-white' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
        <div className="flex items-center">
          <Battery className="w-4 h-4" />
          <span className="ml-1 text-xs">{battery}%</span>
        </div>
      </div>
    </div>
  )
}

export function MobileNavigation() {
  const [activeTab, setActiveTab] = useState('home')

  const tabs = [
    { id: 'home', icon: Home, label: 'หน้าหลัก' },
    { id: 'courses', icon: BookOpen, label: 'คอร์ส' },
    { id: 'search', icon: Search, label: 'ค้นหา' },
    { id: 'notifications', icon: Bell, label: 'แจ้งเตือน' },
    { id: 'profile', icon: User, label: 'โปรไฟล์' }
  ]

  return (
    <div className="bg-gray-900 border-t border-gray-700 px-2 py-1">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'text-purple-400 bg-purple-400/10'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs mt-1">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function MobileVideoPlayer({ title, isPlaying, onTogglePlay }: {
  title: string
  isPlaying: boolean
  onTogglePlay: () => void
}) {
  return (
    <div className="bg-black">
      <div className="aspect-video relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Video Controls Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-3">
              <Button
                size="sm"
                variant="ghost"
                onClick={onTogglePlay}
                className="bg-black/50 hover:bg-black/70 rounded-full"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="bg-black/50 hover:bg-black/70 rounded-full"
              >
                <SkipForward className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="ghost"
                className="bg-black/50 hover:bg-black/70 rounded-full"
              >
                <Volume2 className="w-5 h-5" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="bg-black/50 hover:bg-black/70 rounded-full"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3">
            <div className="w-full bg-gray-600 rounded-full h-1">
              <div className="bg-purple-500 h-1 rounded-full" style={{ width: '35%' }} />
            </div>
            <div className="flex justify-between text-xs text-gray-300 mt-1">
              <span>12:34</span>
              <span>35:42</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-white font-semibold text-lg">{title}</h3>
        <p className="text-gray-400 text-sm mt-1">JavaScript Fundamentals • บทที่ 3</p>
      </div>
    </div>
  )
}

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [syncPending, setSyncPending] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      if (syncPending) {
        // Simulate sync
        setTimeout(() => setSyncPending(false), 2000)
      }
    }
    
    const handleOffline = () => {
      setIsOnline(false)
      setSyncPending(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [syncPending])

  if (isOnline && !syncPending) return null

  return (
    <div className={`px-4 py-2 text-center text-sm ${
      isOnline ? 'bg-green-600' : 'bg-orange-600'
    } text-white`}>
      {isOnline ? (
        syncPending ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            กำลังซิงค์ข้อมูล...
          </div>
        ) : (
          'ซิงค์ข้อมูลเสร็จสิ้น'
        )
      ) : (
        <div className="flex items-center justify-center">
          <WifiOff className="w-4 h-4 mr-2" />
          โหมดออฟไลน์ - ข้อมูลจะซิงค์เมื่อเชื่อมต่ออินเทอร์เน็ต
        </div>
      )}
    </div>
  )
}