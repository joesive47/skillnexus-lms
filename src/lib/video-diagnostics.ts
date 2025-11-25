/**
 * Video diagnostics and network checking utilities
 */

export interface DiagnosticResult {
  isOnline: boolean
  canReachYouTube: boolean
  videoExists: boolean
  error?: string
}

/**
 * Check if user is online
 */
export function checkOnlineStatus(): boolean {
  return navigator.onLine
}

/**
 * Test network connectivity to YouTube
 */
export async function testYouTubeConnectivity(): Promise<boolean> {
  try {
    // Try to fetch YouTube's favicon (small file)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
    
    const response = await fetch('https://www.youtube.com/favicon.ico', {
      method: 'HEAD',
      mode: 'no-cors',
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    return true
  } catch (error) {
    console.warn('YouTube connectivity test failed:', error)
    return false
  }
}

/**
 * Check if a specific YouTube video exists and is accessible
 */
export async function checkVideoAccessibility(videoId: string): Promise<{ exists: boolean; error?: string }> {
  try {
    // Method 1: Try oEmbed API
    const oembedResponse = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
      { method: 'GET' }
    )
    
    if (oembedResponse.ok) {
      return { exists: true }
    }
    
    // Method 2: Try thumbnail check as fallback
    const thumbnailResponse = await fetch(
      `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      { method: 'HEAD' }
    )
    
    if (thumbnailResponse.ok) {
      return { exists: true }
    }
    
    return { 
      exists: false, 
      error: 'วีดีโอไม่พบหรือไม่สามารถเข้าถึงได้' 
    }
    
  } catch (error) {
    return { 
      exists: false, 
      error: 'ไม่สามารถตรวจสอบสถานะวีดีโอได้' 
    }
  }
}

/**
 * Run comprehensive video diagnostics
 */
export async function runVideoDiagnostics(videoId: string): Promise<DiagnosticResult> {
  const result: DiagnosticResult = {
    isOnline: checkOnlineStatus(),
    canReachYouTube: false,
    videoExists: false
  }
  
  if (!result.isOnline) {
    result.error = 'ไม่มีการเชื่อมต่ออินเทอร์เน็ต'
    return result
  }
  
  try {
    // Test YouTube connectivity
    result.canReachYouTube = await testYouTubeConnectivity()
    
    if (!result.canReachYouTube) {
      result.error = 'ไม่สามารถเชื่อมต่อกับ YouTube ได้'
      return result
    }
    
    // Check specific video
    const videoCheck = await checkVideoAccessibility(videoId)
    result.videoExists = videoCheck.exists
    
    if (!result.videoExists) {
      result.error = videoCheck.error || 'วีดีโอไม่พบ'
    }
    
  } catch (error) {
    result.error = 'เกิดข้อผิดพลาดในการตรวจสอบ'
  }
  
  return result
}

/**
 * Get user-friendly error message based on diagnostic results
 */
export function getDiagnosticErrorMessage(diagnostic: DiagnosticResult): string {
  if (!diagnostic.isOnline) {
    return 'ไม่มีการเชื่อมต่ออินเทอร์เน็ต กรุณาตรวจสอบการเชื่อมต่อของคุณ'
  }
  
  if (!diagnostic.canReachYouTube) {
    return 'ไม่สามารถเชื่อมต่อกับ YouTube ได้ อาจเป็นเพราะการตั้งค่าเครือข่ายหรือไฟร์วอลล์'
  }
  
  if (!diagnostic.videoExists) {
    return diagnostic.error || 'วีดีโอไม่พบหรือไม่สามารถเข้าถึงได้'
  }
  
  return diagnostic.error || 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ'
}

/**
 * Monitor network status changes
 */
export function createNetworkMonitor(onStatusChange: (isOnline: boolean) => void) {
  const handleOnline = () => onStatusChange(true)
  const handleOffline = () => onStatusChange(false)
  
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
  
  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  }
}

/**
 * Get browser and system info for debugging
 */
export function getBrowserInfo() {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    connection: (navigator as any).connection?.effectiveType || 'unknown'
  }
}