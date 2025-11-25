'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'sonner'

interface OfflineContextType {
  isOnline: boolean
  syncPending: boolean
  syncData: () => Promise<void>
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined)

export function OfflineProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true)
  const [syncPending, setSyncPending] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      toast.success('Connection restored')
      syncData()
    }

    const handleOffline = () => {
      setIsOnline(false)
      toast.warning('You are offline. Some features may be limited.')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Check initial state
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const syncData = async () => {
    if (!isOnline) return

    setSyncPending(true)
    try {
      // Sync offline data (watch progress, quiz answers, etc.)
      const offlineData = localStorage.getItem('offline-data')
      if (offlineData) {
        const data = JSON.parse(offlineData)
        // Send to server
        await fetch('/api/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
        localStorage.removeItem('offline-data')
      }
    } catch (error) {
      console.error('Sync failed:', error)
    } finally {
      setSyncPending(false)
    }
  }

  return (
    <OfflineContext.Provider value={{
      isOnline,
      syncPending,
      syncData
    }}>
      {children}
    </OfflineContext.Provider>
  )
}

export function useOffline() {
  const context = useContext(OfflineContext)
  if (!context) {
    throw new Error('useOffline must be used within OfflineProvider')
  }
  return context
}