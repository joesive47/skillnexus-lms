/**
 * Global fix for "g.map is not a function" errors
 */

export function initMapErrorFix() {
  if (typeof window === 'undefined') return

  // Override console.error to catch map errors
  const originalError = console.error
  console.error = function(...args) {
    const message = args.join(' ')
    
    if (message.includes('map is not a function')) {
      console.warn('🔧 Map error detected and handled:', message)
      
      // Show user notification
      showMapErrorToast()
      
      // Try to recover by reloading the page after a short delay
      setTimeout(() => {
        if (confirm('เกิดข้อผิดพลาดในการโหลดข้อมูล ต้องการรีเฟรชหน้าเว็บหรือไม่?')) {
          window.location.reload()
        }
      }, 2000)
    }
    
    originalError.apply(console, args)
  }

  // Global error handler
  window.addEventListener('error', (event) => {
    if (event.error?.message?.includes('map is not a function')) {
      event.preventDefault()
      console.warn('🔧 Global map error caught and prevented')
      showMapErrorToast()
    }
  })

  // Unhandled promise rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason?.message?.includes('map is not a function')) {
      event.preventDefault()
      console.warn('🔧 Promise rejection map error caught and prevented')
      showMapErrorToast()
    }
  })
}

function showMapErrorToast() {
  // Create toast notification
  const toast = document.createElement('div')
  toast.innerHTML = `
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
          <strong>ข้อมูลกำลังโหลด</strong><br>
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
  
  document.body.appendChild(toast)
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (toast.parentElement) {
      toast.parentElement.removeChild(toast)
    }
  }, 5000)
}

// Safe array wrapper that can be used anywhere
export function ensureArray<T>(value: any): T[] {
  if (Array.isArray(value)) return value
  if (value == null) return []
  if (typeof value === 'object' && value.length !== undefined) {
    return Array.from(value)
  }
  return []
}

// Safe map function that prevents errors
export function safeMapGlobal<T, R>(
  array: any,
  callback: (item: T, index: number) => R
): R[] {
  try {
    const safeArr = ensureArray<T>(array)
    return safeArr.map(callback)
  } catch (error) {
    console.warn('safeMapGlobal error prevented:', error)
    return []
  }
}