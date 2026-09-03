'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Download, 
  Smartphone, 
  Wifi, 
  WifiOff, 
  Bell, 
  Settings,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  HardDrive
} from 'lucide-react'
import { toast } from 'sonner'

interface PWAInstallPrompt extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface ServiceWorkerStatus {
  isSupported: boolean
  isRegistered: boolean
  isUpdating: boolean
  hasUpdate: boolean
}

interface OfflineStatus {
  isOnline: boolean
  lastSync: Date | null
  pendingSync: number
  offlineStorage: number
}

export function PWAManager() {
  const [installPrompt, setInstallPrompt] = useState<PWAInstallPrompt | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [swStatus, setSWStatus] = useState<ServiceWorkerStatus>({
    isSupported: false,
    isRegistered: false,
    isUpdating: false,
    hasUpdate: false
  })
  const [offlineStatus, setOfflineStatus] = useState<OfflineStatus>({
    isOnline: navigator.onLine,
    lastSync: null,
    pendingSync: 0,
    offlineStorage: 0
  })
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default')

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      const isInWebAppiOS = (window.navigator as any).standalone === true
      setIsInstalled(isStandalone || isInWebAppiOS)
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as PWAInstallPrompt)
    }

    // Check service worker support and registration
    const checkServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        setSWStatus(prev => ({ ...prev, isSupported: true }))
        
        try {
          const registration = await navigator.serviceWorker.getRegistration()
          if (registration) {
            setSWStatus(prev => ({ ...prev, isRegistered: true }))
            
            // Check for updates
            registration.addEventListener('updatefound', () => {
              setSWStatus(prev => ({ ...prev, isUpdating: true }))
              
              const newWorker = registration.installing
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    setSWStatus(prev => ({ ...prev, hasUpdate: true, isUpdating: false }))
                  }
                })
              }
            })
          }
        } catch (error) {
          console.error('Service Worker check failed:', error)
        }
      }
    }

    // Monitor online/offline status
    const handleOnlineStatus = () => {
      setOfflineStatus(prev => ({ ...prev, isOnline: navigator.onLine }))
      
      if (navigator.onLine) {
        // Trigger sync when coming back online
        syncOfflineData()
      }
    }

    // Check notification permission
    const checkNotificationPermission = () => {
      if ('Notification' in window) {
        setNotificationPermission(Notification.permission)
      }
    }

    // Initialize
    checkInstalled()
    checkServiceWorker()
    checkNotificationPermission()
    calculateOfflineStorage()

    // Event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('online', handleOnlineStatus)
    window.addEventListener('offline', handleOnlineStatus)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('online', handleOnlineStatus)
      window.removeEventListener('offline', handleOnlineStatus)
    }
  }, [])

  const handleInstallApp = async () => {
    if (!installPrompt) return

    try {
      await installPrompt.prompt()
      const { outcome } = await installPrompt.userChoice
      
      if (outcome === 'accepted') {
        setIsInstalled(true)
        setInstallPrompt(null)
        toast.success('แอปได้รับการติดตั้งเรียบร้อยแล้ว!')
      }
    } catch (error) {
      console.error('Installation failed:', error)
      toast.error('การติดตั้งล้มเหลว')
    }
  }

  const handleUpdateApp = async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration()
      if (registration?.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' })
        window.location.reload()
      }
    }
  }

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      setNotificationPermission(permission)
      
      if (permission === 'granted') {
        toast.success('การแจ้งเตือนได้รับการเปิดใช้งานแล้ว')
        
        // Subscribe to push notifications
        await subscribeToPushNotifications()
      }
    }
  }

  const subscribeToPushNotifications = async () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.getRegistration()
        if (registration) {
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
          })
          
          // Send subscription to server
          await fetch('/api/push/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subscription)
          })
        }
      } catch (error) {
        console.error('Push subscription failed:', error)
      }
    }
  }

  const syncOfflineData = async () => {
    try {
      // Sync offline data with server
      const pendingData = await getOfflinePendingData()
      
      if (pendingData.length > 0) {
        setSWStatus(prev => ({ ...prev, isUpdating: true }))
        
        for (const data of pendingData) {
          await syncDataItem(data)
        }
        
        setOfflineStatus(prev => ({ 
          ...prev, 
          lastSync: new Date(), 
          pendingSync: 0 
        }))
        
        toast.success('ข้อมูลได้รับการซิงค์เรียบร้อยแล้ว')
      }
    } catch (error) {
      console.error('Sync failed:', error)
      toast.error('การซิงค์ข้อมูลล้มเหลว')
    } finally {
      setSWStatus(prev => ({ ...prev, isUpdating: false }))
    }
  }

  const calculateOfflineStorage = async () => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate()
        const usedMB = Math.round((estimate.usage || 0) / 1024 / 1024)
        setOfflineStatus(prev => ({ ...prev, offlineStorage: usedMB }))
      } catch (error) {
        console.error('Storage calculation failed:', error)
      }
    }
  }

  const clearOfflineStorage = async () => {
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys()
        await Promise.all(cacheNames.map(name => caches.delete(name)))
      }
      
      // Clear IndexedDB data
      if ('indexedDB' in window) {
        // Implementation depends on your offline storage strategy
      }
      
      await calculateOfflineStorage()
      toast.success('ข้อมูลออฟไลน์ถูกล้างแล้ว')
    } catch (error) {
      console.error('Clear storage failed:', error)
      toast.error('การล้างข้อมูลล้มเหลว')
    }
  }

  // Mock functions - implement based on your offline strategy
  const getOfflinePendingData = async () => []
  const syncDataItem = async (data: any) => {}

  return (
    <div className="space-y-6">
      {/* PWA Installation */}
      {!isInstalled && installPrompt && (
        <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Smartphone className="w-5 h-5 mr-2" />
              ติดตั้งแอป SkillNexus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              ติดตั้งแอป SkillNexus บนอุปกรณ์ของคุณเพื่อประสบการณ์การเรียนรู้ที่ดีขึ้น
            </p>
            <div className="flex space-x-3">
              <Button 
                onClick={handleInstallApp}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Download className="w-4 h-4 mr-2" />
                ติดตั้งแอป
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* App Status */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            สถานะแอป
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Installation Status */}
          <div className="flex items-center justify-between">
            <span className="text-gray-300">การติดตั้งแอป</span>
            <Badge className={isInstalled ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'}>
              {isInstalled ? (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  ติดตั้งแล้ว
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3 mr-1" />
                  ยังไม่ติดตั้ง
                </>
              )}
            </Badge>
          </div>

          {/* Service Worker Status */}
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Service Worker</span>
            <Badge className={swStatus.isRegistered ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}>
              {swStatus.isRegistered ? 'ใช้งานได้' : 'ไม่พร้อมใช้งาน'}
            </Badge>
          </div>

          {/* Online Status */}
          <div className="flex items-center justify-between">
            <span className="text-gray-300">สถานะการเชื่อมต่อ</span>
            <Badge className={offlineStatus.isOnline ? 'bg-green-500/20 text-green-300' : 'bg-orange-500/20 text-orange-300'}>
              {offlineStatus.isOnline ? (
                <>
                  <Wifi className="w-3 h-3 mr-1" />
                  ออนไลน์
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 mr-1" />
                  ออฟไลน์
                </>
              )}
            </Badge>
          </div>

          {/* Notification Permission */}
          <div className="flex items-center justify-between">
            <span className="text-gray-300">การแจ้งเตือน</span>
            <div className="flex items-center space-x-2">
              <Badge className={
                notificationPermission === 'granted' 
                  ? 'bg-green-500/20 text-green-300'
                  : notificationPermission === 'denied'
                  ? 'bg-red-500/20 text-red-300'
                  : 'bg-yellow-500/20 text-yellow-300'
              }>
                {notificationPermission === 'granted' ? 'เปิดใช้งาน' : 
                 notificationPermission === 'denied' ? 'ปิดใช้งาน' : 'รอการอนุญาต'}
              </Badge>
              {notificationPermission !== 'granted' && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={requestNotificationPermission}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Bell className="w-3 h-3 mr-1" />
                  เปิดใช้งาน
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Offline Management */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <HardDrive className="w-5 h-5 mr-2" />
            การจัดการออฟไลน์
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">ข้อมูลที่เก็บไว้</span>
            <Badge className="bg-blue-500/20 text-blue-300">
              {offlineStatus.offlineStorage} MB
            </Badge>
          </div>

          {offlineStatus.lastSync && (
            <div className="flex items-center justify-between">
              <span className="text-gray-300">ซิงค์ล่าสุด</span>
              <span className="text-white text-sm">
                {offlineStatus.lastSync.toLocaleString('th-TH')}
              </span>
            </div>
          )}

          {offlineStatus.pendingSync > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-gray-300">รอการซิงค์</span>
              <Badge className="bg-orange-500/20 text-orange-300">
                {offlineStatus.pendingSync} รายการ
              </Badge>
            </div>
          )}

          <div className="flex space-x-3">
            <Button 
              onClick={syncOfflineData}
              disabled={!offlineStatus.isOnline || swStatus.isUpdating}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              ซิงค์ข้อมูล
            </Button>
            <Button 
              onClick={clearOfflineStorage}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              ล้างข้อมูล
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* App Update */}
      {swStatus.hasUpdate && (
        <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Download className="w-5 h-5 mr-2" />
              อัปเดตใหม่พร้อมใช้งาน
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              มีเวอร์ชันใหม่ของแอปพร้อมใช้งาน รีเฟรชเพื่อใช้งานฟีเจอร์ล่าสุด
            </p>
            <Button 
              onClick={handleUpdateApp}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              อัปเดตแอป
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}