'use client'

import { useEffect } from 'react'

export function ChatbotErrorHandler() {
  useEffect(() => {
    // Additional error handling specifically for chatbot
    const handleMapError = (error: any) => {
      if (error?.message?.includes('map is not a function')) {
        console.warn('🔧 Chatbot map error detected and handled:', error.message)
        
        // Show user-friendly notification
        const notification = document.createElement('div')
        notification.innerHTML = `
          <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: #fef3c7;
            border: 1px solid #f59e0b;
            color: #92400e;
            padding: 12px 16px;
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            max-width: 350px;
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 14px;
          ">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span>⚠️</span>
              <div>
                <strong>ระบบกำลังโหลดข้อมูล</strong><br>
                <small>กรุณารอสักครู่ หรือรีเฟรชหน้าเว็บ</small>
              </div>
              <button onclick="this.parentElement.parentElement.remove()" style="
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                margin-left: auto;
              ">×</button>
            </div>
          </div>
        `
        
        document.body.appendChild(notification)
        
        // Auto remove after 5 seconds
        setTimeout(() => {
          if (notification.parentElement) {
            notification.remove()
          }
        }, 5000)
        
        return true // Error handled
      }
      return false
    }

    // Override window.onerror for this component
    const originalOnError = window.onerror
    window.onerror = function(message, source, lineno, colno, error) {
      if (handleMapError(error)) {
        return true // Prevent default error handling
      }
      return originalOnError ? originalOnError(message, source, lineno, colno, error) : false
    }

    // Override unhandled promise rejection
    const originalOnUnhandledRejection = window.onunhandledrejection
    window.onunhandledrejection = function(event) {
      if (handleMapError(event.reason)) {
        event.preventDefault()
        return
      }
      if (originalOnUnhandledRejection) {
        originalOnUnhandledRejection.call(window, event)
      }
    }

    return () => {
      // Cleanup
      window.onerror = originalOnError
      window.onunhandledrejection = originalOnUnhandledRejection
    }
  }, [])

  return null // This component doesn't render anything
}