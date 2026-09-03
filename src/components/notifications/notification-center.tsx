'use client'

import { useEffect, useState } from 'react'
import { Bell, X, CheckCircle, Award, BookOpen, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface Notification {
  id: string
  type: 'certificate' | 'progress' | 'course' | 'system'
  title: string
  message: string
  link?: string
  linkText?: string
  timestamp: Date
  read: boolean
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [open, setOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  // Load notifications from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('skillnexus_notifications')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        const notifications = parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }))
        setNotifications(notifications)
        setUnreadCount(notifications.filter((n: Notification) => !n.read).length)
      } catch (e) {
        console.error('Failed to parse notifications:', e)
      }
    }

    // Listen for new notifications
    const handleNewNotification = () => {
      const stored = localStorage.getItem('skillnexus_notifications')
      if (stored) {
        const parsed = JSON.parse(stored)
        const notifications = parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }))
        setNotifications(notifications)
        setUnreadCount(notifications.filter((n: Notification) => !n.read).length)
      }
    }

    window.addEventListener('notification-added', handleNewNotification)
    return () => window.removeEventListener('notification-added', handleNewNotification)
  }, [])

  // Save notifications to localStorage
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('skillnexus_notifications', JSON.stringify(notifications))
    }
  }, [notifications])

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
    const notification = notifications.find(n => n.id === id)
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
  }

  const clearAll = () => {
    setNotifications([])
    setUnreadCount(0)
    localStorage.removeItem('skillnexus_notifications')
  }

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'certificate':
        return <Award className="h-5 w-5 text-yellow-600" />
      case 'progress':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'course':
        return <BookOpen className="h-5 w-5 text-blue-600" />
      case 'system':
        return <AlertCircle className="h-5 w-5 text-gray-600" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'เมื่อสักครู่'
    if (diffMins < 60) return `${diffMins} นาทีที่แล้ว`
    if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`
    if (diffDays < 7) return `${diffDays} วันที่แล้ว`
    
    return date.toLocaleDateString('th-TH', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative"
        onClick={() => setOpen(!open)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {open && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setOpen(false)}
          />
          
          <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-800 z-50 max-h-[600px] flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  การแจ้งเตือน
                </h3>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs h-7"
                  >
                    อ่านทั้งหมด
                  </Button>
                )}
              </div>
              
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="w-full h-7 text-xs"
                >
                  ลบทั้งหมด
                </Button>
              )}
            </div>

            <div className="overflow-y-auto flex-1 p-4">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                  <Bell className="h-12 w-12 mb-4 opacity-20" />
                  <p className="text-sm">ไม่มีการแจ้งเตือนใหม่</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications
                    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                    .map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          "relative p-3 rounded-lg border transition-colors",
                          notification.read 
                            ? "bg-background" 
                            : "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900"
                        )}
                      >
                        <button
                          onClick={() => removeNotification(notification.id)}
                          className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                        >
                          <X className="h-3 w-3 text-gray-500" />
                        </button>

                        <div className="flex gap-3">
                          <div className="mt-0.5">
                            {getIcon(notification.type)}
                          </div>
                          
                          <div className="flex-1 space-y-1 pr-6">
                            <h4 className="font-semibold text-sm">
                              {notification.title}
                            </h4>
                            
                            <p className="text-xs text-muted-foreground">
                              {notification.message}
                            </p>

                            {notification.link && notification.linkText && (
                              <a
                                href={notification.link}
                                onClick={() => {
                                  markAsRead(notification.id)
                                  setOpen(false)
                                }}
                                className="inline-block text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium mt-1"
                              >
                                {notification.linkText} →
                              </a>
                            )}

                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-xs text-muted-foreground">
                                {formatTimestamp(notification.timestamp)}
                              </p>
                              
                              {!notification.read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400"
                                >
                                  ทำเครื่องหมาย
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

/**
 * Add notification to NotificationCenter
 * Call this from anywhere in the app to add a notification
 */
export function addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
  const stored = localStorage.getItem('skillnexus_notifications')
  let notifications: Notification[] = []
  
  if (stored) {
    try {
      notifications = JSON.parse(stored).map((n: any) => ({
        ...n,
        timestamp: new Date(n.timestamp)
      }))
    } catch (e) {
      console.error('Failed to parse notifications:', e)
    }
  }

  const newNotification: Notification = {
    ...notification,
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
    read: false
  }

  notifications.unshift(newNotification)
  
  // Keep only last 50 notifications
  if (notifications.length > 50) {
    notifications = notifications.slice(0, 50)
  }

  localStorage.setItem('skillnexus_notifications', JSON.stringify(notifications))
  
  // Dispatch custom event to update UI
  window.dispatchEvent(new CustomEvent('notification-added', { detail: newNotification }))
}
