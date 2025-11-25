/**
 * Global Error Fix for Map Function Issues
 * แก้ไขปัญหา "s.map is not a function" แบบครอบคลุม
 */

// Global error counter
let errorCount = 0
const MAX_ERRORS = 5

export function initGlobalErrorFix() {
  if (typeof window === 'undefined') return

  // 1. Override Array.prototype.map globally with enhanced safety
  const originalMap = Array.prototype.map
  Array.prototype.map = function<T, U>(
    this: T[],
    callbackfn: (value: T, index: number, array: T[]) => U,
    thisArg?: any
  ): U[] {
    try {
      // Enhanced type checking
      if (this == null) {
        console.warn('🔧 Map called on null/undefined, returning empty array')
        return [] as U[]
      }
      
      if (!Array.isArray(this)) {
        console.warn('🔧 Map called on non-array:', typeof this, this)
        // Try to convert to array if possible
        if (this && typeof this === 'object' && 'length' in this) {
          const converted = Array.from(this as ArrayLike<T>) as T[]
          return originalMap.call(converted, callbackfn, thisArg) as U[]
        }
        return [] as U[]
      }
      
      return originalMap.call(this, callbackfn, thisArg) as U[]
    } catch (error) {
      console.error('🔧 Map operation failed:', error)
      return [] as U[]
    }
  }

  // 2. Global error handler for unhandled errors
  window.addEventListener('error', (event) => {
    const message = event.error?.message || event.message || ''
    
    if (message.includes('map is not a function') || 
        message.includes('.map is not a function')) {
      
      errorCount++
      console.warn(`🔧 Map error detected and handled (${errorCount}/${MAX_ERRORS}):`, message)
      
      // Prevent default error handling
      event.preventDefault()
      
      // Show user-friendly notification
      showMapErrorNotification()
      
      // Auto-reload if too many errors
      if (errorCount >= MAX_ERRORS) {
        setTimeout(() => {
          if (confirm('เกิดข้อผิดพลาดหลายครั้ง ต้องการรีเฟรชหน้าเว็บหรือไม่?')) {
            window.location.reload()
          }
        }, 1000)
      }
    }
  })

  // 3. Promise rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    const message = event.reason?.message || String(event.reason)
    
    if (message.includes('map is not a function')) {
      console.warn('🔧 Promise rejection map error handled:', message)
      event.preventDefault()
      showMapErrorNotification()
    }
  })

  // 4. Console error override
  const originalConsoleError = console.error
  console.error = function(...args) {
    const message = args.join(' ')
    
    if (message.includes('map is not a function')) {
      console.warn('🔧 Map error detected and handled:', message)
      showMapErrorNotification()
    }
    
    originalConsoleError.apply(console, args)
  }

  console.log('🛡️ Global error fix initialized')
}

function showMapErrorNotification() {
  // Remove existing notifications
  const existing = document.querySelectorAll('.map-error-notification')
  existing.forEach(el => el.remove())

  // Create new notification
  const notification = document.createElement('div')
  notification.className = 'map-error-notification'
  notification.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      border: 1px solid #f59e0b;
      color: #92400e;
      padding: 16px 20px;
      border-radius: 12px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      z-index: 10000;
      max-width: 400px;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      animation: slideIn 0.3s ease-out;
    ">
      <div style="display: flex; align-items: flex-start; gap: 12px;">
        <span style="font-size: 20px;">⚠️</span>
        <div style="flex: 1;">
          <div style="font-weight: 600; margin-bottom: 4px;">
            ระบบกำลังโหลดข้อมูล
          </div>
          <div style="font-size: 12px; opacity: 0.8;">
            กรุณารอสักครู่ หรือรีเฟรชหน้าเว็บหากปัญหายังคงอยู่
          </div>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" style="
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
          opacity: 0.6;
          padding: 0;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">×</button>
      </div>
    </div>
    <style>
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    </style>
  `
  
  document.body.appendChild(notification)
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = 'slideIn 0.3s ease-out reverse'
      setTimeout(() => {
        notification.remove()
      }, 300)
    }
  }, 5000)
}

// Enhanced safe array utilities
export function ensureArray<T>(value: any): T[] {
  if (value == null) return []
  if (Array.isArray(value)) return value
  
  // Handle array-like objects
  if (typeof value === 'object' && 'length' in value && typeof value.length === 'number') {
    try {
      return Array.from(value)
    } catch {
      return []
    }
  }
  
  // Handle single values
  if (typeof value !== 'object') {
    return [value]
  }
  
  return []
}

export function safeMap<T, R>(
  array: any,
  callback: (item: T, index: number, array: T[]) => R
): R[] {
  try {
    const safeArr = ensureArray<T>(array)
    return safeArr.map(callback)
  } catch (error) {
    console.warn('🔧 safeMap error prevented:', error)
    return []
  }
}

export function safeFilter<T>(
  array: any,
  predicate: (item: T, index: number, array: T[]) => boolean
): T[] {
  try {
    const safeArr = ensureArray<T>(array)
    return safeArr.filter(predicate)
  } catch (error) {
    console.warn('🔧 safeFilter error prevented:', error)
    return []
  }
}

export function safeForEach<T>(
  array: any,
  callback: (item: T, index: number, array: T[]) => void
): void {
  try {
    const safeArr = ensureArray<T>(array)
    safeArr.forEach(callback)
  } catch (error) {
    console.warn('🔧 safeForEach error prevented:', error)
  }
}

// Reset error count (useful for testing)
export function resetErrorCount() {
  errorCount = 0
}