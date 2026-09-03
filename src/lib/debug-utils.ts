/**
 * Debug utilities for troubleshooting common issues
 */

// Debug function to check if value can be safely mapped
export function debugMapError(value: any, context: string = 'unknown') {
  console.group(`🔍 Debug Map Error - Context: ${context}`)
  
  console.log('Value:', value)
  console.log('Type:', typeof value)
  console.log('Is Array:', Array.isArray(value))
  console.log('Is null/undefined:', value == null)
  console.log('Has map method:', value && typeof value.map === 'function')
  
  if (value && typeof value === 'object') {
    console.log('Object keys:', Object.keys(value))
    console.log('Constructor:', value.constructor?.name)
    console.log('Length property:', value.length)
  }
  
  console.groupEnd()
  
  return {
    canMap: Array.isArray(value) || (value && typeof value.map === 'function'),
    isArray: Array.isArray(value),
    type: typeof value,
    value: value
  }
}

// Safe data fetcher with error handling
export async function safeDataFetch<T>(
  fetchFn: () => Promise<T>,
  fallback: T,
  context: string = 'unknown'
): Promise<T> {
  try {
    const result = await fetchFn()
    
    // Debug log for array results
    if (Array.isArray(result)) {
      console.log(`✅ ${context}: Fetched array with ${result.length} items`)
    } else if (result && typeof result === 'object') {
      console.log(`✅ ${context}: Fetched object:`, Object.keys(result))
    }
    
    return result
  } catch (error) {
    console.error(`❌ ${context}: Fetch failed, using fallback:`, error)
    return fallback
  }
}

// Global error handler for map errors
export function setupGlobalErrorHandler() {
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
      if (event.error?.message?.includes('map is not a function')) {
        console.error('🚨 Global Map Error Detected:', {
          message: event.error.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error.stack
        })
        
        // Show user-friendly message
        showMapErrorNotification()
      }
    })
    
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason?.message?.includes('map is not a function')) {
        console.error('🚨 Unhandled Promise Rejection - Map Error:', event.reason)
        showMapErrorNotification()
      }
    })
  }
}

function showMapErrorNotification() {
  // Create a simple notification
  if (typeof document !== 'undefined') {
    const notification = document.createElement('div')
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: #fee2e2;
        border: 1px solid #fecaca;
        color: #991b1b;
        padding: 12px 16px;
        border-radius: 8px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        max-width: 400px;
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 14px;
      ">
        <strong>⚠️ เกิดข้อผิดพลาด</strong><br>
        ข้อผิดพลาด: g.map is not a function<br>
        <small>กรุณารีเฟรชหน้าเว็บ หรือไปที่หน้า Debug</small>
        <button onclick="this.parentElement.parentElement.remove()" style="
          float: right;
          background: none;
          border: none;
          font-size: 16px;
          cursor: pointer;
          margin-left: 8px;
        ">×</button>
      </div>
    `
    document.body.appendChild(notification)
    
    // Auto remove after 10 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.parentElement.removeChild(notification)
      }
    }, 10000)
  }
}

// Validate data structure before rendering
export function validateRenderData(data: any, expectedType: 'array' | 'object' = 'array') {
  if (expectedType === 'array') {
    if (!Array.isArray(data)) {
      console.warn('Expected array but got:', typeof data, data)
      return false
    }
  } else if (expectedType === 'object') {
    if (!data || typeof data !== 'object') {
      console.warn('Expected object but got:', typeof data, data)
      return false
    }
  }
  
  return true
}

// Initialize debug utilities
export function initializeDebugUtils() {
  if (process.env.NODE_ENV === 'development') {
    setupGlobalErrorHandler()
    console.log('🔧 Debug utilities initialized')
  }
}